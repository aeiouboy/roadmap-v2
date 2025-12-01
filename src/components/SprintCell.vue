<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import FeatureCard from './FeatureCard.vue'
import type { Category, Sprint, Feature, DragData } from '../types'

const props = defineProps<{
  category: Category
  sprint: Sprint
}>()

const emit = defineEmits<{
  'new-feature': [categoryId: number, sprintId: number]
  'edit-feature': [feature: Feature]
  save: []
}>()

const store = useRoadmapStore()

const isDragOver = ref(false)

// Get features for this cell
const features = computed(() => {
  return store.getFeaturesByLocation(props.category.id, props.sprint.id)
})

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

async function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false

  const dataStr = e.dataTransfer?.getData('application/json')
  if (!dataStr) return

  try {
    const dragData: DragData = JSON.parse(dataStr)
    const { feature, fromCategoryId, fromSprintId } = dragData

    // Move feature to new location
    if (fromCategoryId !== props.category.id || fromSprintId !== props.sprint.id) {
      await store.moveFeature(
        feature.id,
        props.category.id,
        props.sprint.id,
        features.value.length
      )
      emit('save')
    }
  } catch (err) {
    console.error('Failed to parse drag data:', err)
  }
}

function handleEditFeature(feature: Feature) {
  emit('edit-feature', feature)
}

function handleSave() {
  emit('save')
}
</script>

<template>
  <div
    class="sprint-cell"
    :class="{ 'drag-over': isDragOver }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <!-- Feature Cards -->
    <div class="features-container">
      <FeatureCard
        v-for="feature in features"
        :key="feature.id"
        :feature="feature"
        :category="category"
        :sprint="sprint"
        @edit="handleEditFeature"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<style scoped>
.sprint-cell {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
  border-left: 1px solid rgba(30, 41, 59, 0.5);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-height: 120px;
  background: transparent;
}

.sprint-cell.drag-over {
  background: rgba(34, 197, 94, 0.15);
  border: 2px dashed var(--accent-green);
  border-radius: 6px;
}

.features-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
