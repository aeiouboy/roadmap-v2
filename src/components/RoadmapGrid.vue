<script setup lang="ts">
import { computed } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import CategoryRow from './CategoryRow.vue'
import type { Category, Sprint, Feature } from '../types'

const store = useRoadmapStore()

const emit = defineEmits<{
  'new-feature': [categoryId: number, sprintId: number]
  'edit-feature': [feature: Feature]
  'edit-category': [category: Category]
  'edit-sprint': [sprint: Sprint]
  save: []
}>()

const categories = computed(() => store.sortedCategories)
const sprints = computed(() => store.sortedSprints)

// Generate grid template columns for CSS
const gridTemplateColumns = computed(() => {
  const sprintColumns = sprints.value.map(() => 'minmax(180px, 220px)').join(' ')
  return `200px ${sprintColumns}`
})

function handleNewFeature(categoryId: number, sprintId: number) {
  emit('new-feature', categoryId, sprintId)
}

function handleEditFeature(feature: Feature) {
  emit('edit-feature', feature)
}

function handleEditCategory(category: Category) {
  emit('edit-category', category)
}

function handleEditSprint(sprint: Sprint) {
  emit('edit-sprint', sprint)
}

function handleSave() {
  emit('save')
}
</script>

<template>
  <div class="roadmap-wrapper">
    <div
      class="roadmap"
      :style="{ gridTemplateColumns }"
    >
      <!-- Header Row -->
      <div class="header-cell category-header">
        <span class="text-text-secondary text-sm font-medium">Category</span>
      </div>
      <div
        v-for="sprint in sprints"
        :key="sprint.id"
        class="header-cell sprint-header"
        @dblclick="handleEditSprint(sprint)"
        :title="'Double-click to edit'"
      >
        <span :class="['sprint-label', sprint.number === -1 ? 'backlog' : '']">
          <span v-if="sprint.number === -1">{{ sprint.name }}</span>
          <span v-else>Sprint {{ sprint.number }}</span>
        </span>
        <span v-if="sprint.name !== `Sprint ${sprint.number}` && sprint.number !== -1" class="sprint-name">
          {{ sprint.name }}
        </span>
      </div>

      <!-- Category Rows -->
      <template v-for="category in categories" :key="category.id">
        <CategoryRow
          :category="category"
          :sprints="sprints"
          @new-feature="handleNewFeature"
          @edit-feature="handleEditFeature"
          @edit-category="handleEditCategory"
          @save="handleSave"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.roadmap-wrapper {
  padding-bottom: 2rem;
  position: relative;
}

.roadmap {
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: minmax(min-content, auto);
  gap: 0;
  min-width: max-content;
  align-items: stretch;
}

.header-cell {
  padding: 0.75rem;
  text-align: center;
  border-bottom: 2px solid var(--border);
  background: var(--bg-dark);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: fadeInDown 0.5s ease-out both;
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

.sprint-name {
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
