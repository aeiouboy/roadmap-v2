<script setup lang="ts">
import { computed } from 'vue'
import { useRoadmapStore } from '../stores/roadmap'

const store = useRoadmapStore()

const toasts = computed(() => store.toasts)

function getToastClass(type: string) {
  switch (type) {
    case 'success':
      return 'toast-success'
    case 'error':
      return 'toast-error'
    case 'warning':
      return 'toast-warning'
    case 'info':
    default:
      return 'toast-info'
  }
}

function getIcon(type: string) {
  switch (type) {
    case 'success':
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />`
    case 'error':
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`
    case 'warning':
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />`
    case 'info':
    default:
      return `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`
  }
}

function dismissToast(id: string) {
  store.removeToast(id)
}
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="getToastClass(toast.type)"
      >
        <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-html="getIcon(toast.type)" />
        <span class="toast-message">{{ toast.message }}</span>
        <button
          @click="dismissToast(toast.id)"
          class="toast-dismiss"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  padding: 0.75rem 1.5rem;
  background: var(--bg-card);
  border-radius: 8px;
  font-size: 0.85rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 300px;
  max-width: 450px;
}

.toast-success {
  border: 1px solid var(--accent-green);
  color: var(--accent-green);
}

.toast-error {
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
}

.toast-warning {
  border: 1px solid var(--accent-yellow);
  color: var(--accent-yellow);
}

.toast-info {
  border: 1px solid var(--accent-cyan);
  color: var(--accent-cyan);
}

.toast-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
}

.toast-dismiss {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.toast-dismiss:hover {
  opacity: 1;
}

/* Animations */
.toast-enter-active {
  animation: toast-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-leave-active {
  animation: toast-out 0.3s ease-in;
}

@keyframes toast-in {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes toast-out {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100px);
    opacity: 0;
  }
}
</style>
