import { defineStore } from 'pinia';
import type { Category, Sprint, Feature, Checkpoint, Toast, TimelineMilestone } from '../types';

interface RoadmapState {
  categories: Category[];
  sprints: Sprint[];
  features: Feature[];
  checkpoints: Checkpoint[];
  milestones: TimelineMilestone[];
  showTimeline: boolean;
  theme: 'dark' | 'light';
  toasts: Toast[];
  loading: boolean;
  error: string | null;
  lastAction: {
    type: 'move' | 'create' | 'update' | 'delete';
    data: any;
  } | null;
}

export const useRoadmapStore = defineStore('roadmap', {
  state: (): RoadmapState => {
    // Load theme from localStorage, default to 'dark'
    const savedTheme = localStorage.getItem('roadmap-theme') as 'dark' | 'light' | null;
    return {
      categories: [],
      sprints: [],
      features: [],
      checkpoints: [],
      milestones: [],
      showTimeline: true,
      theme: savedTheme || 'dark',
      toasts: [],
      loading: false,
      error: null,
      lastAction: null,
    };
  },

  getters: {
    // Get features by category and sprint
    getFeaturesByLocation: (state) => (categoryId: number, sprintId: number) => {
      return state.features.filter(
        (f) => f.category_id === categoryId && f.sprint_id === sprintId
      ).sort((a, b) => a.position - b.position);
    },

    // Get category by ID
    getCategoryById: (state) => (id: number) => {
      return state.categories.find((c) => c.id === id);
    },

    // Get sprint by ID
    getSprintById: (state) => (id: number) => {
      return state.sprints.find((s) => s.id === id);
    },

    // Get sorted categories
    sortedCategories: (state) => {
      return [...state.categories].sort((a, b) => a.position - b.position);
    },

    // Get sorted sprints
    sortedSprints: (state) => {
      return [...state.sprints].sort((a, b) => a.number - b.number);
    },

    // Get sorted milestones
    sortedMilestones: (state) => {
      return [...state.milestones].sort((a, b) => a.sprint - b.sprint);
    },

    // Get milestone by ID
    getMilestoneById: (state) => (id: string) => {
      return state.milestones.find((m) => m.id === id);
    },
  },

  actions: {
    // Toast notifications
    showToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
      const toast: Toast = {
        id: Date.now().toString(),
        message,
        type,
        duration,
      };
      this.toasts.push(toast);

      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    },

    removeToast(id: string) {
      const index = this.toasts.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },

    // Initialize data (will be called from Tauri commands)
    async loadData() {
      this.loading = true;
      try {
        // These will be replaced with actual Tauri commands once the backend is ready
        // For now, we'll load default categories and sprints
        this.categories = this.getDefaultCategories();
        this.sprints = this.getDefaultSprints();
        this.features = [];
        this.checkpoints = [];
        this.milestones = this.getDefaultMilestones();
        this.error = null;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to load data';
        this.showToast(this.error, 'error');
      } finally {
        this.loading = false;
      }
    },

    // Default categories (will be stored in DB once Tauri is ready)
    getDefaultCategories(): Category[] {
      return [
        { id: 1, name: 'Order', icon: '📦', color: 'order', position: 0, is_custom: false, created_at: new Date().toISOString() },
        { id: 2, name: 'Validation', icon: '✅', color: 'validation', position: 1, is_custom: false, created_at: new Date().toISOString() },
        { id: 3, name: 'Inventory', icon: '📊', color: 'inventory', position: 2, is_custom: false, created_at: new Date().toISOString() },
        { id: 4, name: 'Payment', icon: '💳', color: 'payment', position: 3, is_custom: false, created_at: new Date().toISOString() },
        { id: 5, name: 'Orchestration', icon: '⚙️', color: 'orchestration', position: 4, is_custom: false, created_at: new Date().toISOString() },
        { id: 6, name: 'Notification', icon: '🔔', color: 'notification', position: 5, is_custom: false, created_at: new Date().toISOString() },
        { id: 7, name: 'UI', icon: '🎨', color: 'ui', position: 6, is_custom: false, created_at: new Date().toISOString() },
        { id: 8, name: 'Reporting', icon: '📈', color: 'reporting', position: 7, is_custom: false, created_at: new Date().toISOString() },
        { id: 9, name: 'Exceptional', icon: '⚠️', color: 'exceptional', position: 8, is_custom: false, created_at: new Date().toISOString() },
      ];
    },

    // Default sprints (backlog + 0-9)
    getDefaultSprints(): Sprint[] {
      const sprints: Sprint[] = [
        { id: 1, number: -1, name: 'Backlog', position: 0, created_at: new Date().toISOString() },
      ];

      for (let i = 0; i <= 9; i++) {
        sprints.push({
          id: i + 2,
          number: i,
          name: `Sprint ${i}`,
          position: i + 1,
          created_at: new Date().toISOString(),
        });
      }

      return sprints;
    },

    // Feature operations (will be replaced with Tauri commands)
    async createFeature(feature: Omit<Feature, 'id' | 'created_at' | 'updated_at'>) {
      // Placeholder: will be Tauri command
      const newFeature: Feature = {
        ...feature,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.features.push(newFeature);
      this.showToast(`Created feature: ${newFeature.title}`, 'success');
      return newFeature;
    },

    async updateFeature(id: number, updates: Partial<Feature>) {
      // Placeholder: will be Tauri command
      const index = this.features.findIndex((f) => f.id === id);
      if (index !== -1) {
        const existing = this.features[index];
        this.features[index] = {
          ...existing,
          ...updates,
          updated_at: new Date().toISOString(),
        } as Feature;
        this.showToast('Feature updated', 'success');
      }
    },

    async deleteFeature(id: number) {
      // Placeholder: will be Tauri command
      const index = this.features.findIndex((f) => f.id === id);
      if (index !== -1) {
        const feature = this.features[index]!;
        this.features.splice(index, 1);
        this.showToast(`Deleted: ${feature.title}`, 'success');
      }
    },

    async moveFeature(featureId: number, newCategoryId: number, newSprintId: number, newPosition: number) {
      // Placeholder: will be Tauri command
      const feature = this.features.find((f) => f.id === featureId);
      if (feature) {
        const oldCategoryId = feature.category_id;
        const oldSprintId = feature.sprint_id;

        await this.updateFeature(featureId, {
          category_id: newCategoryId,
          sprint_id: newSprintId,
          position: newPosition,
        });

        const categoryChanged = oldCategoryId !== newCategoryId;
        const category = this.getCategoryById(newCategoryId);
        const sprint = this.getSprintById(newSprintId);

        if (categoryChanged && category) {
          this.showToast(
            `Moved "${feature.title}" to ${category.name} → ${sprint?.name}`,
            'success'
          );
        } else if (sprint) {
          this.showToast(`Moved "${feature.title}" → ${sprint.name}`, 'success');
        }

        this.lastAction = {
          type: 'move',
          data: { featureId, oldCategoryId, oldSprintId, newCategoryId, newSprintId },
        };
      }
    },

    // Category operations (will be replaced with Tauri commands)
    async createCategory(category: Omit<Category, 'id' | 'created_at'>) {
      // Placeholder: will be Tauri command
      const newCategory: Category = {
        ...category,
        id: Date.now(),
        created_at: new Date().toISOString(),
      };
      this.categories.push(newCategory);
      this.showToast(`Created category: ${newCategory.name}`, 'success');
      return newCategory;
    },

    async updateCategory(id: number, updates: Partial<Category>) {
      // Placeholder: will be Tauri command
      const index = this.categories.findIndex((c) => c.id === id);
      if (index !== -1) {
        const existing = this.categories[index];
        this.categories[index] = { ...existing, ...updates } as Category;
        this.showToast('Category updated', 'success');
      }
    },

    async deleteCategory(id: number) {
      // Placeholder: will be Tauri command
      const category = this.categories.find((c) => c.id === id);
      if (category && category.is_custom) {
        const featuresCount = this.features.filter((f) => f.category_id === id).length;
        if (featuresCount > 0) {
          const confirmed = confirm(`This category has ${featuresCount} features. Delete anyway?`);
          if (!confirmed) return;
        }

        const index = this.categories.findIndex((c) => c.id === id);
        this.categories.splice(index, 1);
        this.showToast(`Deleted category: ${category.name}`, 'success');
      }
    },

    // Sprint operations (will be replaced with Tauri commands)
    async createSprint(sprint: Omit<Sprint, 'id' | 'created_at'>) {
      // Placeholder: will be Tauri command
      const newSprint: Sprint = {
        ...sprint,
        id: Date.now(),
        created_at: new Date().toISOString(),
      };
      this.sprints.push(newSprint);
      this.showToast(`Created sprint: ${newSprint.name}`, 'success');
      return newSprint;
    },

    async updateSprint(id: number, updates: Partial<Sprint>) {
      // Placeholder: will be Tauri command
      const index = this.sprints.findIndex((s) => s.id === id);
      if (index !== -1) {
        const existing = this.sprints[index];
        this.sprints[index] = { ...existing, ...updates } as Sprint;
        this.showToast('Sprint updated', 'success');
      }
    },

    async deleteSprint(id: number) {
      // Placeholder: will be Tauri command
      const sprint = this.sprints.find((s) => s.id === id);
      if (sprint) {
        const featuresCount = this.features.filter((f) => f.sprint_id === id).length;
        if (featuresCount > 0) {
          const confirmed = confirm(`This sprint has ${featuresCount} features. Delete anyway?`);
          if (!confirmed) return;
        }

        const index = this.sprints.findIndex((s) => s.id === id);
        this.sprints.splice(index, 1);
        this.showToast(`Deleted sprint: ${sprint.name}`, 'success');
      }
    },

    // Checkpoint operations (will be replaced with Tauri commands)
    async createCheckpoint(name: string) {
      // Placeholder: will be Tauri command
      const snapshot = {
        categories: this.categories,
        sprints: this.sprints,
        features: this.features,
      };

      const checkpoint: Checkpoint = {
        id: Date.now(),
        name,
        timestamp: new Date().toISOString(),
        snapshot_json: JSON.stringify(snapshot),
        created_at: new Date().toISOString(),
      };

      this.checkpoints.push(checkpoint);
      this.showToast(`Checkpoint created: ${name}`, 'success');
      return checkpoint;
    },

    async restoreCheckpoint(id: number) {
      // Placeholder: will be Tauri command
      const checkpoint = this.checkpoints.find((c) => c.id === id);
      if (checkpoint) {
        const confirmed = confirm(`Restore checkpoint "${checkpoint.name}"? This will replace your current roadmap.`);
        if (!confirmed) return;

        const snapshot = JSON.parse(checkpoint.snapshot_json);
        this.categories = snapshot.categories;
        this.sprints = snapshot.sprints;
        this.features = snapshot.features;
        this.showToast(`Restored checkpoint: ${checkpoint.name}`, 'success');
      }
    },

    // Timeline milestone operations
    getDefaultMilestones(): TimelineMilestone[] {
      return [
        { id: 'ms-0', sprint: 0, note: '', type: 'normal' },
        { id: 'ms-1', sprint: 1, note: 'Half resource', type: 'resource' },
        { id: 'ms-2', sprint: 2, note: 'New year leave', type: 'holiday' },
        { id: 'ms-5', sprint: 5, note: 'CFR - Pre-SIT', type: 'sit' },
        { id: 'ms-6', sprint: 6, note: 'CFR: Dev Completed', type: 'dev-complete' },
        { id: 'ms-7', sprint: 7, note: 'CFR: Full SIT', type: 'sit' },
        { id: 'ms-8', sprint: 8, note: 'DS: Dev Completed', type: 'dev-complete' },
        { id: 'ms-9', sprint: 9, note: 'CFR Go Live', type: 'golive' },
      ];
    },

    async createMilestone(milestone: Omit<TimelineMilestone, 'id'>) {
      const newMilestone: TimelineMilestone = {
        ...milestone,
        id: `ms-${Date.now()}`,
      };
      this.milestones.push(newMilestone);
      this.showToast(`Created milestone at Sprint ${newMilestone.sprint}`, 'success');
      return newMilestone;
    },

    async updateMilestone(id: string, updates: Partial<TimelineMilestone>) {
      const index = this.milestones.findIndex((m) => m.id === id);
      if (index !== -1) {
        this.milestones[index] = { ...this.milestones[index], ...updates } as TimelineMilestone;
        this.showToast('Milestone updated', 'success');
      }
    },

    async deleteMilestone(id: string) {
      const index = this.milestones.findIndex((m) => m.id === id);
      if (index !== -1) {
        const milestone = this.milestones[index];
        if (milestone) {
          this.milestones.splice(index, 1);
          this.showToast(`Deleted milestone at Sprint ${milestone.sprint}`, 'success');
        }
      }
    },

    async moveMilestone(id: string, newSprint: number) {
      await this.updateMilestone(id, { sprint: newSprint });
    },

    toggleTimeline() {
      this.showTimeline = !this.showTimeline;
      this.showToast(this.showTimeline ? 'Timeline shown' : 'Timeline hidden', 'info');
    },

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('roadmap-theme', this.theme);
      this.showToast(`Switched to ${this.theme} mode`, 'info');
    },
  },
});
