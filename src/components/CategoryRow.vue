<script setup lang="ts">
import { computed } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import SprintCell from './SprintCell.vue'
import type { Category, Sprint, Feature } from '../types'

const props = defineProps<{
  category: Category
  sprints: Sprint[]
}>()

const emit = defineEmits<{
  'new-feature': [categoryId: number, sprintId: number]
  'edit-feature': [feature: Feature]
  'edit-category': [category: Category]
  save: []
}>()

const store = useRoadmapStore()

// Map category colors to CSS styles
const categoryStyle = computed(() => {
  const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
    'order': {
      bg: 'rgba(0, 212, 255, 0.1)',
      border: '#00d4ff',
      icon: 'rgba(0, 212, 255, 0.2)',
    },
    'validation': {
      bg: 'rgba(168, 85, 247, 0.1)',
      border: '#a855f7',
      icon: 'rgba(168, 85, 247, 0.2)',
    },
    'inventory': {
      bg: 'rgba(34, 197, 94, 0.1)',
      border: '#22c55e',
      icon: 'rgba(34, 197, 94, 0.2)',
    },
    'payment': {
      bg: 'rgba(249, 115, 22, 0.1)',
      border: '#f97316',
      icon: 'rgba(249, 115, 22, 0.2)',
    },
    'orchestration': {
      bg: 'rgba(236, 72, 153, 0.1)',
      border: '#ec4899',
      icon: 'rgba(236, 72, 153, 0.2)',
    },
    'notification': {
      bg: 'rgba(234, 179, 8, 0.1)',
      border: '#eab308',
      icon: 'rgba(234, 179, 8, 0.2)',
    },
    'ui': {
      bg: 'rgba(20, 184, 166, 0.1)',
      border: '#14b8a6',
      icon: 'rgba(20, 184, 166, 0.2)',
    },
    'reporting': {
      bg: 'rgba(59, 130, 246, 0.1)',
      border: '#3b82f6',
      icon: 'rgba(59, 130, 246, 0.2)',
    },
    'exceptional': {
      bg: 'rgba(239, 68, 68, 0.1)',
      border: '#ef4444',
      icon: 'rgba(239, 68, 68, 0.2)',
    },
  }
  return colorMap[props.category.color] ?? colorMap['order']
})

function handleEditCategory() {
  emit('edit-category', props.category)
}

async function handleDeleteCategory() {
  if (props.category.is_custom) {
    await store.deleteCategory(props.category.id)
    emit('save')
  }
}

function handleNewFeature(categoryId: number, sprintId: number) {
  emit('new-feature', categoryId, sprintId)
}

function handleEditFeature(feature: Feature) {
  emit('edit-feature', feature)
}

function handleSave() {
  emit('save')
}
</script>

<template>
  <!-- Category Label -->
  <div
    class="category-label"
    @dblclick="handleEditCategory"
    :title="'Double-click to edit'"
  >
    <div
      class="category-icon"
      :style="{ backgroundColor: categoryStyle.icon }"
    >
      {{ category.icon }}
    </div>
    <span class="category-name">{{ category.name }}</span>

    <!-- New Feature Button -->
    <button
      @click.stop="() => handleNewFeature(category.id, sprints[0]?.id || 1)"
      class="add-feature-btn"
      title="Add new feature to this category"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <button
      v-if="category.is_custom"
      @click.stop="handleDeleteCategory"
      class="delete-btn"
      title="Delete category"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>

  <!-- Sprint Cells -->
  <SprintCell
    v-for="sprint in sprints"
    :key="sprint.id"
    :category="category"
    :sprint="sprint"
    @new-feature="handleNewFeature"
    @edit-feature="handleEditFeature"
    @save="handleSave"
  />
</template>

<style scoped>
.category-label {
  padding: 0.75rem;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border);
  position: sticky;
  left: 0;
  background: var(--bg-dark);
  z-index: 90;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-label:hover {
  background: var(--bg-hover);
}

.category-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.category-name {
  flex: 1;
}

.delete-btn {
  margin-left: auto;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0;
}

.category-label:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  color: var(--accent-red);
  background: rgba(239, 68, 68, 0.1);
}

.add-feature-btn {
  padding: 0.35rem 0.6rem;
  background: transparent;
  border: 1.5px solid rgba(0, 212, 255, 0.3);
  border-radius: 6px;
  color: var(--accent-cyan);
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  opacity: 0;
}

.category-label:hover .add-feature-btn {
  opacity: 1;
}

.add-feature-btn:hover {
  background: rgba(0, 212, 255, 0.15);
  border-color: var(--accent-cyan);
  transform: scale(1.05);
}
</style>
