<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import type { Sprint } from '../types'

const props = defineProps<{
  sprint: Sprint | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = useRoadmapStore()

const sprintNumber = ref(0)
const name = ref('')

const isEditing = ref(false)

// Calculate next sprint number
const nextSprintNumber = computed(() => {
  const maxNumber = Math.max(...store.sprints.map(s => s.number), -1)
  return maxNumber + 1
})

onMounted(() => {
  if (props.sprint) {
    isEditing.value = true
    sprintNumber.value = props.sprint.number
    name.value = props.sprint.name
  } else {
    sprintNumber.value = nextSprintNumber.value
    name.value = `Sprint ${nextSprintNumber.value}`
  }
})

watch(() => props.sprint, (newSprint) => {
  if (newSprint) {
    isEditing.value = true
    sprintNumber.value = newSprint.number
    name.value = newSprint.name
  } else {
    isEditing.value = false
    sprintNumber.value = nextSprintNumber.value
    name.value = `Sprint ${nextSprintNumber.value}`
  }
})

async function handleSave() {
  if (!name.value.trim()) {
    store.showToast('Please enter a sprint name', 'error')
    return
  }

  if (isEditing.value && props.sprint) {
    await store.updateSprint(props.sprint.id, {
      number: sprintNumber.value,
      name: name.value.trim(),
    })
  } else {
    await store.createSprint({
      number: sprintNumber.value,
      name: name.value.trim(),
      position: store.sprints.length,
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
          {{ isEditing ? 'Edit Sprint' : 'New Sprint' }}
        </h2>
      </div>

      <!-- Content -->
      <div class="modal-body">
        <!-- Sprint Number Input -->
        <div class="form-group">
          <label class="form-label">Sprint Number</label>
          <input
            v-model.number="sprintNumber"
            type="number"
            class="form-input"
            placeholder="0"
          />
        </div>

        <!-- Name Input -->
        <div class="form-group">
          <label class="form-label">Name</label>
          <input
            v-model="name"
            type="text"
            class="form-input"
            placeholder="Sprint name"
          />
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
  color: var(--accent-purple);
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
  border-color: var(--accent-purple);
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}
</style>
