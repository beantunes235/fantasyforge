import OpenAI from "openai";
import { storage } from "./storage";
import { InsertWorld, InsertCreature, InsertStory } from "@shared/schema";
import { 
  mockGenerateWorld, 
  mockGenerateCreature, 
  mockGenerateStory 
} from "./mockGenerator";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

// Check if OpenAI API is available
let useOpenAI = true;
let openAIError = "";

// World generation function
export async function generateFantasyWorld(
  description: string,
  type: string,
  magicSystem: string
): Promise<InsertWorld> {
  try {
    // If we know OpenAI is unavailable, use mock generator instead
    if (!useOpenAI) {
      console.log("Using mock world generator due to previous OpenAI API errors");
      return await mockGenerateWorld(description, type, magicSystem);
    }

    // Try using OpenAI
    const prompt = `Generate a detailed fantasy world based on the following description:
"${description}"

World type: ${type}
Magic system: ${magicSystem}

Please respond with a JSON object in this exact format:
{
  "name": "Fantasy world name",
  "description": "A one-paragraph description of the world",
  "type": "${type}",
  "magicSystem": "${magicSystem}",
  "geography": "Detailed description of the geography",
  "magic": "Explanation of how magic works in this world",
  "inhabitants": "Description of the main inhabitants and races",
  "history": "Brief history of the world",
  "region": "Main region or notable place",
  "regions": ["Region 1", "Region 2", "Region 3"] 
}

Be creative, detailed, and imaginative. Make it feel like a rich fantasy setting.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    const worldData = JSON.parse(response.choices[0].message.content!);
    
    // Get a random landscape image
    const imageUrl = storage.getRandomImage('landscape');
    
    // Ensure all required fields are present
    return {
      name: worldData.name,
      description: worldData.description,
      type: worldData.type || type,
      magicSystem: worldData.magicSystem || magicSystem,
      geography: worldData.geography,
      magic: worldData.magic,
      inhabitants: worldData.inhabitants,
      history: worldData.history,
      region: worldData.region,
      regions: worldData.regions || [worldData.region],
      imageUrl
    };
  } catch (error: any) {
    console.error("Error generating fantasy world:", error);
    
    // If it's an OpenAI API error, mark API as unavailable
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      useOpenAI = false;
      openAIError = error.error?.message || "API quota exceeded";
      console.log("Switching to mock generator due to OpenAI API error:", openAIError);
      
      // Use mock generator as fallback
      try {
        return await mockGenerateWorld(description, type, magicSystem);
      } catch (mockError) {
        console.error("Mock generator also failed:", mockError);
        throw new Error("Failed to generate fantasy world with mock generator");
      }
    }
    
    throw new Error("Failed to generate fantasy world. Please try again.");
  }
}

// Creature generation function
export async function generateFantasyCreature(
  type: string,
  description: string,
  powerLevel: number,
  intelligence: number,
  worldId: number
): Promise<InsertCreature> {
  try {
    // If we know OpenAI is unavailable, use mock generator instead
    if (!useOpenAI) {
      console.log("Using mock creature generator due to previous OpenAI API errors");
      return await mockGenerateCreature(type, description, powerLevel, intelligence, worldId);
    }
    
    // Get world context if available
    let worldContext = "";
    if (worldId) {
      const world = await storage.getWorld(worldId);
      if (world) {
        worldContext = `This creature exists in the world of "${world.name}", which is described as: ${world.description}
Geography: ${world.geography}
Magic: ${world.magic}
Inhabitants: ${world.inhabitants}
`;
      }
    }

    const prompt = `Generate a detailed fantasy creature based on the following description:
"${description}"

Creature type: ${type}
Power level (1-10): ${powerLevel}
Intelligence level (1-10): ${intelligence}
${worldContext}

Please respond with a JSON object in this exact format:
{
  "name": "Creature name",
  "description": "A detailed description of the creature",
  "type": "${type}",
  "powerLevel": ${powerLevel},
  "intelligence": ${intelligence},
  "speed": [Speed rating from 1-10],
  "magic": [Magic ability rating from 1-10],
  "abilities": ["Ability 1", "Ability 2", "Ability 3"]
}

Be creative, detailed, and make the creature feel unique and fantastical.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8
    });

    const creatureData = JSON.parse(response.choices[0].message.content!);
    
    // Get a random creature image
    const imageUrl = storage.getRandomImage('creature');
    
    // Ensure all required fields are present
    return {
      name: creatureData.name,
      description: creatureData.description,
      type: creatureData.type || type,
      powerLevel: creatureData.powerLevel || powerLevel,
      intelligence: creatureData.intelligence || intelligence,
      speed: creatureData.speed || Math.floor(Math.random() * 8) + 3, // Random 3-10 if not provided
      magic: creatureData.magic || Math.floor(Math.random() * 8) + 3, // Random 3-10 if not provided
      abilities: creatureData.abilities || [],
      imageUrl,
      worldId
    };
  } catch (error: any) {
    console.error("Error generating fantasy creature:", error);
    
    // If it's an OpenAI API error, mark API as unavailable
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      useOpenAI = false;
      openAIError = error.error?.message || "API quota exceeded";
      console.log("Switching to mock generator due to OpenAI API error:", openAIError);
      
      // Use mock generator as fallback
      try {
        return await mockGenerateCreature(type, description, powerLevel, intelligence, worldId);
      } catch (mockError) {
        console.error("Mock generator also failed:", mockError);
        throw new Error("Failed to generate fantasy creature with mock generator");
      }
    }
    
    throw new Error("Failed to generate fantasy creature. Please try again.");
  }
}

// Story generation function
export async function generateFantasyStory(
  theme: string,
  protagonist: string,
  setting: string,
  plotElements: string[],
  worldId?: number,
  creatureIds?: number[]
): Promise<InsertStory> {
  try {
    // If we know OpenAI is unavailable, use mock generator instead
    if (!useOpenAI) {
      console.log("Using mock story generator due to previous OpenAI API errors");
      return await mockGenerateStory(theme, protagonist, setting, plotElements, worldId, creatureIds);
    }
    
    // Get world and creatures context if available
    let worldContext = "";
    let creaturesContext = "";
    
    if (worldId) {
      const world = await storage.getWorld(worldId);
      if (world) {
        worldContext = `This story is set in the world of "${world.name}", which is described as: ${world.description}
Geography: ${world.geography}
Magic: ${world.magic}
Inhabitants: ${world.inhabitants}
History: ${world.history}
`;
      }
    }
    
    if (creatureIds && creatureIds.length > 0) {
      const creaturesList = await Promise.all(creatureIds.map(id => storage.getCreature(id)));
      const validCreatures = creaturesList.filter(c => c !== undefined);
      
      if (validCreatures.length > 0) {
        creaturesContext = "Creatures in this story include:\n";
        validCreatures.forEach(creature => {
          creaturesContext += `- ${creature!.name}: ${creature!.description}\n`;
        });
      }
    }

    const plotElementsText = plotElements.length > 0 
      ? `Plot elements to include: ${plotElements.join(", ")}` 
      : "";

    const prompt = `Generate a fantasy story with the following elements:
Theme: ${theme}
Protagonist: ${protagonist}
Setting: ${setting}
${plotElementsText}
${worldContext}
${creaturesContext}

Please respond with a JSON object in this exact format:
{
  "title": "Story title",
  "content": "The full story content with multiple paragraphs. Be descriptive and engaging."
}

Make the story creative, engaging, and approximately 500-700 words. Include dialogue and descriptive language to bring the fantasy world to life.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 1500
    });

    const storyData = JSON.parse(response.choices[0].message.content!);
    
    return {
      title: storyData.title,
      content: storyData.content,
      theme,
      protagonist,
      setting,
      plotElements,
      worldId: worldId || 0,
      creatureIds: creatureIds || []
    };
  } catch (error: any) {
    console.error("Error generating fantasy story:", error);
    
    // If it's an OpenAI API error, mark API as unavailable
    if (error?.status === 429 || error?.code === 'insufficient_quota') {
      useOpenAI = false;
      openAIError = error.error?.message || "API quota exceeded";
      console.log("Switching to mock generator due to OpenAI API error:", openAIError);
      
      // Use mock generator as fallback
      try {
        return await mockGenerateStory(theme, protagonist, setting, plotElements, worldId, creatureIds);
      } catch (mockError) {
        console.error("Mock generator also failed:", mockError);
        throw new Error("Failed to generate fantasy story with mock generator");
      }
    }
    
    throw new Error("Failed to generate fantasy story. Please try again.");
  }
}

// Export API status for frontend to check
export function getOpenAIStatus() {
  return {
    available: useOpenAI,
    error: openAIError
  };
}
