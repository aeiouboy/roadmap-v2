<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoadmapStore } from './stores/roadmap'
import { loadRoadmapData, saveRoadmapData } from './services/api'
import ControlPanel from './components/ControlPanel.vue'
import RoadmapGrid from './components/RoadmapGrid.vue'
import CategoryModal from './components/CategoryModal.vue'
import SprintModal from './components/SprintModal.vue'
import FeatureModal from './components/FeatureModal.vue'
import ToastContainer from './components/ToastContainer.vue'
import CheckpointTimeline from './components/CheckpointTimeline.vue'
import MilestoneModal from './components/MilestoneModal.vue'
import type { Category, Sprint, Feature, TimelineMilestone } from './types'

const store = useRoadmapStore()

// Computed properties for sticky header
const sortedSprints = computed(() => store.sortedSprints)
const gridTemplateColumns = computed(() => {
  const sprintColumns = sortedSprints.value.map(() => 'minmax(180px, 220px)').join(' ')
  return `200px ${sprintColumns}`
})

// Apply theme to document root
watch(() => store.theme, (newTheme) => {
  document.documentElement.setAttribute('data-theme', newTheme)
}, { immediate: true })

// Modal visibility states
const showCategoryModal = ref(false)
const showSprintModal = ref(false)
const showFeatureModal = ref(false)
const showMilestoneModal = ref(false)

// Edit states
const editingCategory = ref<Category | null>(null)
const editingSprint = ref<Sprint | null>(null)
const editingFeature = ref<Feature | null>(null)
const editingMilestone = ref<TimelineMilestone | null>(null)

// Default category/sprint for new feature
const defaultCategoryId = ref<number | null>(null)
const defaultSprintId = ref<number | null>(null)

onMounted(async () => {
  try {
    const data = await loadRoadmapData()

    // Load data from file, or use defaults if empty
    store.categories = data.categories?.length > 0 ? data.categories : store.getDefaultCategories()
    store.sprints = data.sprints?.length > 0 ? data.sprints : store.getDefaultSprints()
    store.features = data.features || []
    store.checkpoints = data.checkpoints || []
    store.milestones = data.milestones?.length > 0 ? data.milestones : store.getDefaultMilestones()

    // If we loaded defaults, save them immediately
    if (data.categories?.length === 0 || !data.categories) {
      await saveToFile()
    }
  } catch (error) {
    console.error('[ERROR] Failed to load data from file:', error)
    store.showToast('Failed to load data from file. Using defaults.', 'error')
    await store.loadData()
    await saveToFile()
  }
})

// Save to file via API
async function saveToFile() {
  const data = {
    categories: store.categories,
    sprints: store.sprints,
    features: store.features,
    checkpoints: store.checkpoints,
    milestones: store.milestones,
  }

  try {
    await saveRoadmapData(data)
    store.showToast('Saved to file successfully', 'success')
  } catch (error) {
    console.error('[ERROR] Failed to save:', error)
    store.showToast('Failed to save to file', 'error')
  }
}

// Load from file via API
async function loadFromFile() {
  try {
    const data = await loadRoadmapData()
    store.categories = data.categories || []
    store.sprints = data.sprints || []
    store.features = data.features || []
    store.checkpoints = data.checkpoints || []
    store.milestones = data.milestones || []
    store.showToast('Loaded from file successfully', 'success')
  } catch (error) {
    console.error('[ERROR] Failed to load:', error)
    store.showToast('Failed to load from file', 'error')
  }
}

// Modal handlers
function openCategoryModal(category?: Category) {
  editingCategory.value = category || null
  showCategoryModal.value = true
}

function openSprintModal(sprint?: Sprint) {
  editingSprint.value = sprint || null
  showSprintModal.value = true
}

function openFeatureModal(categoryId?: number, sprintId?: number, feature?: Feature) {
  editingFeature.value = feature || null
  defaultCategoryId.value = categoryId || null
  defaultSprintId.value = sprintId || null
  showFeatureModal.value = true
}

async function createCheckpoint() {
  const name = prompt('Enter checkpoint name:')
  if (name) {
    await store.createCheckpoint(name)
    await saveToFile()
  }
}

// Provide methods to child components
function handleNewFeature(categoryId: number, sprintId: number) {
  openFeatureModal(categoryId, sprintId)
}

function handleEditFeature(feature: Feature) {
  openFeatureModal(feature.category_id, feature.sprint_id, feature)
}

function handleEditCategory(category: Category) {
  openCategoryModal(category)
}

function handleEditSprint(sprint: Sprint) {
  openSprintModal(sprint)
}

// Save after modal closes
async function onCategorySaved() {
  showCategoryModal.value = false
  editingCategory.value = null
  await saveToFile()
}

async function onSprintSaved() {
  showSprintModal.value = false
  editingSprint.value = null
  await saveToFile()
}

async function onFeatureSaved() {
  showFeatureModal.value = false
  editingFeature.value = null
  await saveToFile()
}

async function onFeatureDeleted() {
  showFeatureModal.value = false
  editingFeature.value = null
  await saveToFile()
}

// Milestone modal handlers
function openMilestoneModal(milestone?: TimelineMilestone) {
  editingMilestone.value = milestone || null
  showMilestoneModal.value = true
}

function handleNewMilestone() {
  openMilestoneModal()
}

function handleEditMilestone(milestone: TimelineMilestone) {
  openMilestoneModal(milestone)
}

async function onMilestoneSaved() {
  showMilestoneModal.value = false
  editingMilestone.value = null
  await saveToFile()
}

function toggleTimeline() {
  store.toggleTimeline()
}

function toggleTheme() {
  store.toggleTheme()
}
</script>

<template>
  <div class="min-h-screen relative z-10">
    <!-- Header -->
    <header class="text-center py-8 px-6 animate-fade-in">
      <!-- Logo Badge -->
      <div class="logo-badge">
        <span class="pulse-dot"></span>
        Sprint Planning
      </div>

      <!-- Title -->
      <h1 class="app-title">
        Product Roadmap
      </h1>
      <p class="app-subtitle">
        Drag and drop features to plan your sprints
      </p>
    </header>

    <!-- Control Panel -->
    <ControlPanel
      @save="saveToFile"
      @load="loadFromFile"
      @new-category="openCategoryModal()"
      @new-sprint="openSprintModal()"
      @new-checkpoint="createCheckpoint"
      @toggle-timeline="toggleTimeline"
      @toggle-theme="toggleTheme"
    />

    <!-- Sticky Header Section (outside main for proper sticky behavior) -->
    <div class="sticky-header-wrapper">
      <!-- Checkpoint Timeline -->
      <CheckpointTimeline
        @edit-milestone="handleEditMilestone"
        @new-milestone="handleNewMilestone"
        @milestone-moved="saveToFile"
      />

      <!-- Sprint Headers (sticky along with timeline) -->
      <div class="sprint-header-row" :style="{ gridTemplateColumns }">
        <div class="header-cell category-header">
          <span class="text-text-secondary text-sm font-medium">Category</span>
        </div>
        <div
          v-for="sprint in sortedSprints"
          :key="sprint.id"
          class="header-cell sprint-header"
          @dblclick="handleEditSprint(sprint)"
          title="Double-click to edit"
        >
          <span :class="['sprint-label', sprint.number === -1 ? 'backlog' : '']">
            <span v-if="sprint.number === -1">{{ sprint.name }}</span>
            <span v-else>Sprint {{ sprint.number }}</span>
          </span>
          <span v-if="sprint.name !== `Sprint ${sprint.number}` && sprint.number !== -1" class="sprint-name">
            {{ sprint.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="roadmap-main">
      <!-- Main Grid (body only, no headers) -->
      <RoadmapGrid
        :hide-headers="true"
        @new-feature="handleNewFeature"
        @edit-feature="handleEditFeature"
        @edit-category="handleEditCategory"
        @edit-sprint="handleEditSprint"
        @save="saveToFile"
      />
    </main>

    <!-- Modals -->
    <CategoryModal
      v-if="showCategoryModal"
      :category="editingCategory"
      @close="showCategoryModal = false"
      @saved="onCategorySaved"
    />

    <SprintModal
      v-if="showSprintModal"
      :sprint="editingSprint"
      @close="showSprintModal = false"
      @saved="onSprintSaved"
    />

    <FeatureModal
      v-if="showFeatureModal"
      :feature="editingFeature"
      :default-category-id="defaultCategoryId"
      :default-sprint-id="defaultSprintId"
      @close="showFeatureModal = false"
      @saved="onFeatureSaved"
      @deleted="onFeatureDeleted"
    />

    <MilestoneModal
      v-if="showMilestoneModal"
      :milestone="editingMilestone"
      @close="showMilestoneModal = false"
      @saved="onMilestoneSaved"
    />

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeInDown 0.8s ease-out;
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 100px;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent-cyan);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-cyan);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.app-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-cyan) 50%, var(--accent-purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.app-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 400;
}

.roadmap-main {
  position: relative;
  z-index: 10;
  padding: 1rem;
}

.sticky-header-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-dark);
  padding: 0 1rem;
}

.sprint-header-row {
  display: grid;
  gap: 0;
  min-width: max-content;
  background: var(--bg-dark);
}

.header-cell {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 2px solid var(--border);
  background: var(--bg-dark);
}

.category-header {
  position: sticky;
  left: 0;
  z-index: 110;
  text-align: left;
  display: flex;
  align-items: center;
}

.sprint-header {
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.sprint-header:hover {
  background: var(--bg-hover);
}

.sprint-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent-cyan);
}

.sprint-label.backlog {
  color: var(--text-muted);
}

.sprint-name {
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
