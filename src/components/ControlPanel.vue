<script setup lang="ts">
import { useRoadmapStore } from '../stores/roadmap'

const store = useRoadmapStore()

defineEmits<{
  save: []
  load: []
  'new-category': []
  'new-sprint': []
  'new-checkpoint': []
  'toggle-timeline': []
  'toggle-theme': []
}>()
</script>

<template>
  <div class="control-panel">
    <div class="flex flex-wrap gap-3">
      <!-- Save/Load buttons -->
      <div class="flex gap-2">
        <button
          @click="$emit('save')"
          class="btn btn-cyan"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save
        </button>
        <button
          @click="$emit('load')"
          class="btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Load
        </button>
      </div>

      <div class="divider"></div>

      <!-- Create buttons -->
      <div class="flex gap-2">
        <button
          @click="$emit('new-category')"
          class="btn btn-green"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Category
        </button>
        <button
          @click="$emit('new-sprint')"
          class="btn btn-purple"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Sprint
        </button>
        <button
          @click="$emit('new-checkpoint')"
          class="btn btn-orange"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          New Checkpoint
        </button>
      </div>

      <div class="divider"></div>

      <!-- View toggles -->
      <div class="flex gap-2">
        <button
          @click="$emit('toggle-timeline')"
          :class="['btn', store.showTimeline ? 'btn-purple' : '']"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          {{ store.showTimeline ? 'Hide' : 'Show' }} Timeline
        </button>
        <button
          @click="$emit('toggle-theme')"
          :class="['btn', 'btn-cyan']"
          :title="store.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="store.theme === 'dark'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {{ store.theme === 'dark' ? 'Light' : 'Dark' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 1rem 1.5rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.divider {
  width: 1px;
  background: var(--border);
  margin: 0 0.5rem;
}
</style>
