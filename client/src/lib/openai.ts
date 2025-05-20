import { apiRequest } from "./queryClient";

// Types for world generation
export interface WorldGenerationRequest {
  description: string;
  type: string;
  magicSystem: string;
}

export interface CreatureGenerationRequest {
  type: string;
  description: string;
  powerLevel: number;
  intelligence: number;
  worldId?: number;
}

export interface StoryGenerationRequest {
  theme: string;
  protagonist: string;
  setting: string;
  plotElements: string[];
  worldId?: number;
  creatureIds?: number[];
}

// API functions for client-side use
export async function generateWorld(data: WorldGenerationRequest) {
  const response = await apiRequest('POST', '/api/world/generate', data);
  return response.json();
}

export async function generateCreature(data: CreatureGenerationRequest) {
  const response = await apiRequest('POST', '/api/creature/generate', data);
  return response.json();
}

export async function generateStory(data: StoryGenerationRequest) {
  const response = await apiRequest('POST', '/api/story/generate', data);
  return response.json();
}

export async function saveWorld(worldId: number) {
  const response = await apiRequest('POST', `/api/world/${worldId}/save`, {});
  return response.json();
}

export async function saveCreature(creatureId: number, worldId: number) {
  const response = await apiRequest('POST', `/api/creature/${creatureId}/save`, { worldId });
  return response.json();
}

export async function saveStory(storyId: number, worldId: number) {
  const response = await apiRequest('POST', `/api/story/${storyId}/save`, { worldId });
  return response.json();
}
