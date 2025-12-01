<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import type { TimelineMilestone, MilestoneType } from '../types'

const store = useRoadmapStore()

// Get available sprints
const availableSprints = computed(() => store.sortedSprints)

const props = defineProps<{
  milestone?: TimelineMilestone | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

// Form state
const sprint = ref(0)
const note = ref('')
const milestoneType = ref<MilestoneType>('normal')

// Watch for milestone prop changes (edit mode)
watch(() => props.milestone, (newMilestone) => {
  if (newMilestone) {
    sprint.value = newMilestone.sprint
    note.value = newMilestone.note
    milestoneType.value = newMilestone.type
  } else {
    // Reset for new milestone - default to sprint 0 (start point)
    sprint.value = 0
    note.value = ''
    milestoneType.value = 'normal'
  }
}, { immediate: true })

// Handle form submission
async function handleSubmit() {
  if (props.milestone) {
    // Update existing milestone
    await store.updateMilestone(props.milestone.id, {
      sprint: sprint.value,
      note: note.value,
      type: milestoneType.value,
    })
  } else {
    // Create new milestone
    await store.createMilestone({
      sprint: sprint.value,
      note: note.value,
      type: milestoneType.value,
    })
  }
  emit('saved')
}

// Handle cancel
function handleCancel() {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleCancel">
    <div class="modal-content">
      <h3>{{ milestone ? 'Edit Milestone' : 'Add Milestone' }}</h3>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="milestone-sprint">Select Sprint</label>
          <select id="milestone-sprint" v-model.number="sprint" required>
            <option v-for="s in availableSprints" :key="s.id" :value="s.number">
              {{ s.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="milestone-note">Note/Label</label>
          <textarea
            id="milestone-note"
            v-model="note"
            placeholder="e.g., Half resource, Dev completed, SIT phase..."
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="milestone-type">Milestone Type</label>
          <select id="milestone-type" v-model="milestoneType">
            <option value="normal">Normal</option>
            <option value="golive">Go Live</option>
            <option value="dev-complete">Dev Completed</option>
            <option value="sit">SIT Phase</option>
            <option value="resource">Resource Constraint</option>
            <option value="holiday">Holiday/Leave</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="handleCancel">
            Cancel
          </button>
          <button type="submit" class="btn-primary">
            {{ milestone ? 'Update' : 'Create' }} Milestone
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

input[type="number"],
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

input[type="number"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.btn-secondary {
  background: transparent;
  border-color: var(--border);
  color: var(--text-secondary);
}

.btn-secondary:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--accent-cyan);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
  border-color: transparent;
  color: var(--bg-dark);
  font-weight: 600;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.4);
}
</style>
