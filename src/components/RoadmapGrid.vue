<script setup lang="ts">
import { computed } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import CategoryRow from './CategoryRow.vue'
import type { Category, Sprint, Feature } from '../types'

const props = defineProps<{
  hideHeaders?: boolean
}>()

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
    <!-- Grid Body -->
    <div
      class="roadmap"
      :style="{ gridTemplateColumns }"
    >
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
</style>
