<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import type { Feature, Category, Sprint, DragData } from '../types'

const props = defineProps<{
  feature: Feature
  category: Category
  sprint: Sprint
}>()

const emit = defineEmits<{
  edit: [feature: Feature]
  save: []
}>()

const store = useRoadmapStore()
const isDragging = ref(false)

// Map category colors to CSS class names
const categoryColorClass = computed(() => {
  const colorMap: Record<string, string> = {
    'order': 'cat-order',
    'validation': 'cat-validation',
    'inventory': 'cat-inventory',
    'payment': 'cat-payment',
    'orchestration': 'cat-orchestration',
    'notification': 'cat-notification',
    'ui': 'cat-ui',
    'reporting': 'cat-reporting',
    'exceptional': 'cat-exceptional',
  }
  return colorMap[props.category.color] ?? 'cat-order'
})

function handleDragStart(e: DragEvent) {
  isDragging.value = true

  const dragData: DragData = {
    feature: props.feature,
    fromCategoryId: props.feature.category_id,
    fromSprintId: props.feature.sprint_id,
  }

  e.dataTransfer?.setData('application/json', JSON.stringify(dragData))
  e.dataTransfer!.effectAllowed = 'move'
}

function handleDragEnd() {
  isDragging.value = false
}

function handleDoubleClick() {
  emit('edit', props.feature)
}

async function handleDelete(e: Event) {
  e.stopPropagation()
  if (confirm(`Delete "${props.feature.title}"?`)) {
    await store.deleteFeature(props.feature.id)
    emit('save')
  }
}
</script>

<template>
  <div
    class="feature-card"
    :class="[categoryColorClass, { 'dragging': isDragging }]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dblclick="handleDoubleClick"
    :title="'Double-click to edit, drag to move'"
  >
    <div class="feature-content">
      <div class="feature-text">
        <h4 class="feature-title">
          {{ feature.title }}
        </h4>
        <!-- Description hidden for compact view -->
      </div>
      <button
        @click="handleDelete"
        class="delete-btn"
        title="Delete feature"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  user-select: none;
  line-height: 1.2;
  animation: slideIn 0.5s ease-out both;
  min-height: 36px;
}

.feature-card:active {
  cursor: grabbing;
}

.feature-card.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 4px 0 0 4px;
}

.feature-card:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.5);
}

.feature-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.feature-text {
  flex: 1;
  min-width: 0;
}

.feature-title {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 0;
  color: var(--text-primary);
}

.feature-description {
  font-size: 0.75rem;
  opacity: 0.75;
  margin-top: 0.35rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.delete-btn {
  flex-shrink: 0;
  opacity: 0;
  background: var(--accent-red);
  color: white;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card:hover .delete-btn {
  opacity: 0.7;
}

.delete-btn:hover {
  opacity: 1 !important;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.5);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
