import type { Category, Sprint, Feature, Checkpoint, TimelineMilestone } from '../types';

// Use relative URL for production, works with same-origin API
const API_BASE_URL = '/api';

export interface RoadmapData {
  categories: Category[];
  sprints: Sprint[];
  features: Feature[];
  checkpoints: Checkpoint[];
  milestones: TimelineMilestone[];
}

export async function loadRoadmapData(): Promise<RoadmapData> {
  try {
    const response = await fetch(`${API_BASE_URL}/roadmap`);
    if (!response.ok) {
      throw new Error('Failed to load roadmap data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading roadmap data:', error);
    throw error;
  }
}

export async function saveRoadmapData(data: RoadmapData): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save roadmap data');
    }
  } catch (error) {
    console.error('Error saving roadmap data:', error);
    throw error;
  }
}
