<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import type { Feature } from '../types'

const props = defineProps<{
  feature: Feature | null
  defaultCategoryId: number | null
  defaultSprintId: number | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
  deleted: []
}>()

const store = useRoadmapStore()

const title = ref('')
const description = ref('')
const categoryId = ref<number | null>(null)
const sprintId = ref<number | null>(null)

const isEditing = ref(false)

const categories = computed(() => store.sortedCategories)
const sprints = computed(() => store.sortedSprints)

onMounted(() => {
  if (props.feature) {
    isEditing.value = true
    title.value = props.feature.title
    description.value = props.feature.description
    categoryId.value = props.feature.category_id
    sprintId.value = props.feature.sprint_id
  } else {
    categoryId.value = props.defaultCategoryId || (categories.value[0]?.id ?? null)
    sprintId.value = props.defaultSprintId || (sprints.value[0]?.id ?? null)
  }
})

watch(() => props.feature, (newFeature) => {
  if (newFeature) {
    isEditing.value = true
    title.value = newFeature.title
    description.value = newFeature.description
    categoryId.value = newFeature.category_id
    sprintId.value = newFeature.sprint_id
  } else {
    isEditing.value = false
    title.value = ''
    description.value = ''
    categoryId.value = props.defaultCategoryId || (categories.value[0]?.id ?? null)
    sprintId.value = props.defaultSprintId || (sprints.value[0]?.id ?? null)
  }
})

async function handleSave() {
  if (!title.value.trim()) {
    store.showToast('Please enter a feature title', 'error')
    return
  }

  if (!categoryId.value || !sprintId.value) {
    store.showToast('Please select a category and sprint', 'error')
    return
  }

  if (isEditing.value && props.feature) {
    await store.updateFeature(props.feature.id, {
      title: title.value.trim(),
      description: description.value.trim(),
      category_id: categoryId.value,
      sprint_id: sprintId.value,
    })
  } else {
    // Get current features count in target cell for position
    const currentFeatures = store.getFeaturesByLocation(categoryId.value, sprintId.value)

    await store.createFeature({
      title: title.value.trim(),
      description: description.value.trim(),
      category_id: categoryId.value,
      sprint_id: sprintId.value,
      position: currentFeatures.length,
    })
  }

  emit('saved')
}

async function handleDelete() {
  if (props.feature && confirm(`Delete "${props.feature.title}"?`)) {
    await store.deleteFeature(props.feature.id)
    emit('deleted')
  }
}

function handleClose() {
  emit('close')
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <div
    class="modal-backdrop"
    @click="handleBackdropClick"
  >
    <div class="modal-content modal-lg">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEditing ? 'Edit Feature' : 'New Feature' }}
        </h2>
        <button
          v-if="isEditing"
          @click="handleDelete"
          class="delete-btn"
          title="Delete feature"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-body">
        <!-- Title Input -->
        <div class="form-group">
          <label class="form-label">Title</label>
          <input
            v-model="title"
            type="text"
            class="form-input"
            placeholder="Feature title"
          />
        </div>

        <!-- Description Textarea -->
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea
            v-model="description"
            rows="3"
            class="form-input form-textarea"
            placeholder="Feature description (optional)"
          />
        </div>

        <!-- Category Selector -->
        <div class="form-group">
          <label class="form-label">Category</label>
          <select
            v-model="categoryId"
            class="form-input form-select"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.icon }} {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Sprint Selector -->
        <div class="form-group">
          <label class="form-label">Sprint</label>
          <select
            v-model="sprintId"
            class="form-input form-select"
          >
            <option v-for="sprint in sprints" :key="sprint.id" :value="sprint.id">
              <span v-if="sprint.number === -1">{{ sprint.name }}</span>
              <span v-else>Sprint {{ sprint.number }} - {{ sprint.name }}</span>
            </option>
          </select>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button
          @click="handleClose"
          class="btn"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          class="btn btn-primary"
        >
          {{ isEditing ? 'Save' : 'Create' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  width: 90%;
}

.modal-lg {
  max-width: 550px;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  color: var(--accent-green);
  font-family: 'Space Mono', monospace;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.delete-btn {
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  color: var(--accent-red);
  background: rgba(239, 68, 68, 0.1);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-green);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}

.form-select option {
  background: var(--bg-card);
  color: var(--text-primary);
}
</style>
