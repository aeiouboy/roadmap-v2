// Database entity types
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  position: number;
  is_custom: boolean;
  created_at: string;
}

export interface Sprint {
  id: number;
  number: number;
  name: string;
  position: number;
  created_at: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  category_id: number;
  sprint_id: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface Checkpoint {
  id: number;
  name: string;
  timestamp: string;
  snapshot_json: string;
  created_at: string;
}

// Timeline milestone types
export type MilestoneType = 'normal' | 'golive' | 'dev-complete' | 'sit' | 'resource' | 'holiday';

export interface TimelineMilestone {
  id: string;
  sprint: number;
  note: string;
  type: MilestoneType;
}

// UI types
export interface DragData {
  feature: Feature;
  fromCategoryId: number;
  fromSprintId: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

// Color configuration
export interface ColorConfig {
  light: string;
  DEFAULT: string;
  dark: string;
}

export const CATEGORY_COLORS: Record<string, ColorConfig> = {
  order: {
    light: '#e0f2fe',
    DEFAULT: '#0ea5e9',
    dark: '#0369a1',
  },
  validation: {
    light: '#f0fdf4',
    DEFAULT: '#10b981',
    dark: '#047857',
  },
  inventory: {
    light: '#fef3c7',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  payment: {
    light: '#ede9fe',
    DEFAULT: '#8b5cf6',
    dark: '#6d28d9',
  },
  orchestration: {
    light: '#fce7f3',
    DEFAULT: '#ec4899',
    dark: '#be185d',
  },
  notification: {
    light: '#dbeafe',
    DEFAULT: '#3b82f6',
    dark: '#1e40af',
  },
  ui: {
    light: '#fee2e2',
    DEFAULT: '#ef4444',
    dark: '#b91c1c',
  },
  reporting: {
    light: '#e0e7ff',
    DEFAULT: '#6366f1',
    dark: '#4338ca',
  },
  exceptional: {
    light: '#fef9c3',
    DEFAULT: '#eab308',
    dark: '#a16207',
  },
};
