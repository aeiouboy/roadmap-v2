<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import type { Category } from '../types'

const props = defineProps<{
  category: Category | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = useRoadmapStore()

const name = ref('')
const icon = ref('')
const selectedColor = ref('order')

// Predefined colors with dark theme styling
const colors = [
  { name: 'order', label: 'Cyan', hex: '#00d4ff' },
  { name: 'validation', label: 'Purple', hex: '#a855f7' },
  { name: 'inventory', label: 'Green', hex: '#22c55e' },
  { name: 'payment', label: 'Orange', hex: '#f97316' },
  { name: 'orchestration', label: 'Pink', hex: '#ec4899' },
  { name: 'notification', label: 'Yellow', hex: '#eab308' },
  { name: 'ui', label: 'Teal', hex: '#14b8a6' },
  { name: 'reporting', label: 'Blue', hex: '#3b82f6' },
  { name: 'exceptional', label: 'Red', hex: '#ef4444' },
]

const isEditing = ref(false)

onMounted(() => {
  if (props.category) {
    isEditing.value = true
    name.value = props.category.name
    icon.value = props.category.icon
    selectedColor.value = props.category.color
  }
})

watch(() => props.category, (newCategory) => {
  if (newCategory) {
    isEditing.value = true
    name.value = newCategory.name
    icon.value = newCategory.icon
    selectedColor.value = newCategory.color
  } else {
    isEditing.value = false
    name.value = ''
    icon.value = ''
    selectedColor.value = 'order'
  }
})

async function handleSave() {
  if (!name.value.trim()) {
    store.showToast('Please enter a category name', 'error')
    return
  }

  if (isEditing.value && props.category) {
    await store.updateCategory(props.category.id, {
      name: name.value.trim(),
      icon: icon.value || '📁',
      color: selectedColor.value,
    })
  } else {
    await store.createCategory({
      name: name.value.trim(),
      icon: icon.value || '📁',
      color: selectedColor.value,
      position: store.categories.length,
      is_custom: true,
    })
  }

  emit('saved')
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
    <div class="modal-content">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEditing ? 'Edit Category' : 'New Category' }}
        </h2>
      </div>

      <!-- Content -->
      <div class="modal-body">
        <!-- Name Input -->
        <div class="form-group">
          <label class="form-label">Name</label>
          <input
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Category name"
          />
        </div>

        <!-- Icon/Emoji Input -->
        <div class="form-group">
          <label class="form-label">Icon (emoji)</label>
          <input
            v-model="icon"
            type="text"
            class="form-input"
            placeholder="e.g., 📦 or 🚀"
          />
        </div>

        <!-- Color Picker -->
        <div class="form-group">
          <label class="form-label">Color</label>
          <div class="color-grid">
            <button
              v-for="color in colors"
              :key="color.name"
              @click="selectedColor = color.name"
              class="color-btn"
              :class="{ 'selected': selectedColor === color.name }"
              :style="{ backgroundColor: color.hex }"
              :title="color.label"
            />
          </div>
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

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  color: var(--accent-cyan);
  font-family: 'Space Mono', monospace;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
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
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.color-btn {
  height: 40px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-btn:hover {
  transform: scale(1.05);
}

.color-btn.selected {
  border-color: var(--text-primary);
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
}
</style>
