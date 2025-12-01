<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'
import type { TimelineMilestone } from '../types'

const store = useRoadmapStore()

const emit = defineEmits<{
  editMilestone: [milestone: TimelineMilestone]
  newMilestone: []
  milestoneMoved: []
}>()

// Drag state
const draggedMilestone = ref<TimelineMilestone | null>(null)
const isDragging = ref(false)

// Get sorted milestones
const sortedMilestones = computed(() => store.sortedMilestones)
const sortedSprints = computed(() => store.sortedSprints)

// Generate grid template columns to match RoadmapGrid
const gridTemplateColumns = computed(() => {
  const sprintColumns = sortedSprints.value.map(() => 'minmax(180px, 220px)').join(' ')
  return `200px ${sprintColumns}`
})

// Get grid column for a sprint number
function getGridColumn(sprintNumber: number): number {
  // Find the index of the sprint in the sorted sprints array
  const index = sortedSprints.value.findIndex(s => s.number === sprintNumber)
  // Column 1 is category label, then sprint columns start at 2
  return index >= 0 ? index + 2 : 1
}

// Get milestone type class
function getMilestoneClass(type: string): string {
  return type !== 'normal' ? `milestone-${type}` : ''
}

// Handle milestone click for editing
function handleMilestoneClick(milestone: TimelineMilestone) {
  emit('editMilestone', milestone)
}

// Handle delete milestone
async function handleDelete(milestone: TimelineMilestone, event: Event) {
  event.stopPropagation()
  const confirmed = confirm(`Delete milestone at Sprint ${milestone.sprint}?`)
  if (confirmed) {
    await store.deleteMilestone(milestone.id)
  }
}

// Handle edit button
function handleEdit(milestone: TimelineMilestone, event: Event) {
  event.stopPropagation()
  emit('editMilestone', milestone)
}

// Drag and drop handlers
function handleDragStart(milestone: TimelineMilestone, event: DragEvent) {
  draggedMilestone.value = milestone
  isDragging.value = true

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', milestone.id)
  }
}

function handleDragEnd() {
  draggedMilestone.value = null
  isDragging.value = false
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function handleDrop(sprintNumber: number, event: DragEvent) {
  event.preventDefault()

  if (draggedMilestone.value && draggedMilestone.value.sprint !== sprintNumber) {
    store.moveMilestone(draggedMilestone.value.id, sprintNumber)
    emit('milestoneMoved')
  }

  handleDragEnd()
}

// Get sprint number from grid column
function getSprintFromColumn(columnIndex: number): number {
  const sprintIndex = columnIndex - 2 // Subtract category column and 0-based index
  return sortedSprints.value[sprintIndex]?.number ?? 0
}
</script>

<template>
  <div v-if="store.showTimeline" class="checkpoint-timeline-container">
    <div class="checkpoint-timeline" :style="{ gridTemplateColumns }">
      <!-- Timeline label in first column -->
      <div class="timeline-label">Timeline</div>
      <!-- Timeline line -->
      <div class="checkpoint-timeline-line"></div>

      <!-- Drop zones for each sprint -->
      <div
        v-for="sprint in sortedSprints"
        :key="`drop-${sprint.id}`"
        class="checkpoint-drop-zone"
        :style="{ gridColumn: getGridColumn(sprint.number) }"
        @dragover="handleDragOver"
        @drop="handleDrop(sprint.number, $event)"
      ></div>

      <!-- Milestone markers -->
      <div
        v-for="milestone in sortedMilestones"
        :key="milestone.id"
        :class="[
          'checkpoint-marker',
          getMilestoneClass(milestone.type),
          { 'dragging': isDragging && draggedMilestone?.id === milestone.id }
        ]"
        :style="{ gridColumn: getGridColumn(milestone.sprint) }"
        draggable="true"
        @dragstart="handleDragStart(milestone, $event)"
        @dragend="handleDragEnd"
        @dblclick="handleMilestoneClick(milestone)"
      >
        <!-- Label above marker (only show note if exists) -->
        <div v-if="milestone.note" class="checkpoint-marker-label">
          <div class="checkpoint-note">{{ milestone.note }}</div>
        </div>

        <!-- Connector line -->
        <div class="checkpoint-marker-connector"></div>

        <!-- Marker dot -->
        <div class="checkpoint-marker-dot"></div>

        <!-- Action buttons (shown on hover) -->
        <div class="checkpoint-actions">
          <button class="checkpoint-btn edit" @click="handleEdit(milestone, $event)">Edit</button>
          <button class="checkpoint-btn delete" @click="handleDelete(milestone, $event)">Del</button>
        </div>
      </div>
    </div>

    <!-- Add new milestone button -->
    <div class="timeline-controls">
      <button class="timeline-btn" @click="emit('newMilestone')">
        + Add Milestone
      </button>
    </div>
  </div>
</template>

<style scoped>
.checkpoint-timeline-container {
  position: relative;
  padding: 0;
}

.checkpoint-timeline {
  position: relative;
  padding: 3rem 0 1rem 0;
  min-height: 100px;
  display: grid;
  gap: 0;
  min-width: 100%;
  align-items: center;
  overflow: visible;
}

.timeline-label {
  grid-column: 1;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-cyan);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.75rem;
}

.checkpoint-timeline-line {
  position: absolute;
  top: 50%;
  left: 200px;
  right: 0;
  height: 3px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-purple) 100%);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  z-index: 1;
}

.checkpoint-drop-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 0;
}

.checkpoint-marker {
  position: relative;
  cursor: grab;
  z-index: 2;
  transition: all 0.3s ease;
  justify-self: center;
  user-select: none;
}

.checkpoint-marker:active {
  cursor: grabbing;
}

.checkpoint-marker:hover {
  transform: translateY(-3px);
}

.checkpoint-marker.dragging {
  opacity: 0.5;
  transform: scale(1.1);
  cursor: grabbing;
  z-index: 100;
}

.checkpoint-marker:hover .checkpoint-actions {
  opacity: 1;
  pointer-events: auto;
}

.checkpoint-marker-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-dark);
  border: 3px solid var(--accent-cyan);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.6);
  transition: all 0.3s ease;
}

.checkpoint-marker:hover .checkpoint-marker-dot {
  transform: scale(1.3);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
}

/* Milestone type colors */
.checkpoint-marker.milestone-golive .checkpoint-marker-dot {
  border-color: var(--accent-pink);
  box-shadow: 0 0 12px rgba(236, 72, 153, 0.6);
  background: rgba(236, 72, 153, 0.2);
}

.checkpoint-marker.milestone-golive:hover .checkpoint-marker-dot {
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.8);
}

.checkpoint-marker.milestone-dev-complete .checkpoint-marker-dot {
  border-color: var(--accent-purple);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.6);
  background: rgba(168, 85, 247, 0.2);
}

.checkpoint-marker.milestone-dev-complete:hover .checkpoint-marker-dot {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
}

.checkpoint-marker.milestone-sit .checkpoint-marker-dot {
  border-color: var(--accent-blue);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
  background: rgba(59, 130, 246, 0.2);
}

.checkpoint-marker.milestone-sit:hover .checkpoint-marker-dot {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
}

.checkpoint-marker.milestone-resource .checkpoint-marker-dot {
  border-color: var(--accent-yellow);
  box-shadow: 0 0 12px rgba(234, 179, 8, 0.6);
  background: rgba(234, 179, 8, 0.2);
}

.checkpoint-marker.milestone-resource:hover .checkpoint-marker-dot {
  box-shadow: 0 0 20px rgba(234, 179, 8, 0.8);
}

.checkpoint-marker.milestone-holiday .checkpoint-marker-dot {
  border-color: var(--accent-orange);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.6);
  background: rgba(249, 115, 22, 0.2);
}

.checkpoint-marker.milestone-holiday:hover .checkpoint-marker-dot {
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.8);
}

.checkpoint-marker-connector {
  position: absolute;
  left: 50%;
  top: 16px;
  transform: translateX(-50%);
  width: 2px;
  height: 34px;
  background: linear-gradient(180deg, transparent 0%, var(--border) 100%);
}

.checkpoint-marker-label {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 15px;
  white-space: nowrap;
  text-align: center;
  z-index: 10;
}

.checkpoint-note {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
  max-width: 180px;
  background: var(--bg-card);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--accent-cyan);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.checkpoint-note:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.35), 0 4px 8px rgba(0, 0, 0, 0.4);
}

.checkpoint-actions {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.checkpoint-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkpoint-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--accent-cyan);
}

.checkpoint-btn.delete:hover {
  border-color: var(--accent-red);
  color: var(--accent-red);
}

.timeline-controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.timeline-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--accent-cyan);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-btn:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--accent-cyan);
}
</style>
