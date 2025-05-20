import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateFantasyWorld, 
  generateFantasyCreature, 
  generateFantasyStory,
  getOpenAIStatus 
} from "./openai";
import { insertWorldSchema, insertCreatureSchema, insertStorySchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Define validation schemas
  const worldGenerationSchema = z.object({
    description: z.string().min(10, "Please provide a more detailed description of your world"),
    type: z.string(),
    magicSystem: z.string()
  });

  const creatureGenerationSchema = z.object({
    description: z.string().min(10, "Please provide a more detailed description of your creature"),
    type: z.string(),
    powerLevel: z.number().min(1).max(10),
    intelligence: z.number().min(1).max(10),
    worldId: z.number().optional()
  });

  const storyGenerationSchema = z.object({
    theme: z.string(),
    protagonist: z.string(),
    setting: z.string(),
    plotElements: z.array(z.string()),
    worldId: z.number().optional(),
    creatureIds: z.array(z.number()).optional()
  });

  // Initialize sample data for demo purposes
  await initializeSampleData();

  // API status route
  app.get("/api/status", (req, res) => {
    const apiStatus = getOpenAIStatus();
    res.json({
      openai: apiStatus,
      demo: !apiStatus.available,
      server: "online"
    });
  });

  // World Routes
  app.get("/api/worlds", async (req, res) => {
    try {
      const featured = req.query.featured === "true";
      const worlds = await storage.getWorlds(featured);
      res.json(worlds);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch worlds" });
    }
  });

  app.get("/api/worlds/my-worlds", async (req, res) => {
    try {
      // In a real implementation, we would get userId from auth
      // For demo purposes, we'll return all worlds
      const worlds = await storage.getWorlds();
      res.json(worlds);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch your worlds" });
    }
  });

  app.get("/api/world/:id", async (req, res) => {
    try {
      const worldId = parseInt(req.params.id);
      const world = await storage.getWorld(worldId);
      
      if (!world) {
        return res.status(404).json({ message: "World not found" });
      }
      
      res.json(world);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch world" });
    }
  });

  app.post("/api/world/generate", async (req, res) => {
    try {
      // Validate request
      const validation = worldGenerationSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { description, type, magicSystem } = validation.data;
      
      // Generate world using OpenAI
      const worldData = await generateFantasyWorld(description, type, magicSystem);
      
      // Validate generated world against schema
      const worldValidation = insertWorldSchema.safeParse(worldData);
      
      if (!worldValidation.success) {
        const errorMessage = fromZodError(worldValidation.error).message;
        return res.status(500).json({ message: `Generated world is invalid: ${errorMessage}` });
      }
      
      // Store the world
      const world = await storage.createWorld(worldValidation.data);
      
      res.json(world);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate world";
      res.status(500).json({ message });
    }
  });

  app.post("/api/world/:id/save", async (req, res) => {
    try {
      const worldId = parseInt(req.params.id);
      const world = await storage.getWorld(worldId);
      
      if (!world) {
        return res.status(404).json({ message: "World not found" });
      }
      
      // In a real implementation, we would set the userId from auth
      const updatedWorld = await storage.updateWorld(worldId, { userId: 1 });
      
      res.json(updatedWorld);
    } catch (err) {
      res.status(500).json({ message: "Failed to save world" });
    }
  });

  // Creature Routes
  app.get("/api/world/:worldId/creatures", async (req, res) => {
    try {
      const worldId = parseInt(req.params.worldId);
      const creatures = await storage.getCreaturesByWorld(worldId);
      
      res.json(creatures);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch creatures" });
    }
  });

  app.post("/api/creature/generate", async (req, res) => {
    try {
      // Validate request
      const validation = creatureGenerationSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { description, type, powerLevel, intelligence, worldId } = validation.data;
      
      // Generate creature using OpenAI
      const creatureData = await generateFantasyCreature(type, description, powerLevel, intelligence, worldId || 0);
      
      // Validate generated creature against schema
      const creatureValidation = insertCreatureSchema.safeParse(creatureData);
      
      if (!creatureValidation.success) {
        const errorMessage = fromZodError(creatureValidation.error).message;
        return res.status(500).json({ message: `Generated creature is invalid: ${errorMessage}` });
      }
      
      // Store the creature
      const creature = await storage.createCreature(creatureValidation.data);
      
      res.json(creature);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate creature";
      res.status(500).json({ message });
    }
  });

  app.post("/api/creature/:id/save", async (req, res) => {
    try {
      const creatureId = parseInt(req.params.id);
      const { worldId } = req.body;
      
      if (!worldId) {
        return res.status(400).json({ message: "World ID is required" });
      }
      
      const creature = await storage.getCreature(creatureId);
      const world = await storage.getWorld(worldId);
      
      if (!creature) {
        return res.status(404).json({ message: "Creature not found" });
      }
      
      if (!world) {
        return res.status(404).json({ message: "World not found" });
      }
      
      // In a real implementation, we would check if the user owns the world
      const updatedCreature = await storage.updateCreature(creatureId, { worldId });
      
      res.json(updatedCreature);
    } catch (err) {
      res.status(500).json({ message: "Failed to save creature" });
    }
  });

  // Story Routes
  app.get("/api/world/:worldId/stories", async (req, res) => {
    try {
      const worldId = parseInt(req.params.worldId);
      const stories = await storage.getStoriesByWorld(worldId);
      
      res.json(stories);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.post("/api/story/generate", async (req, res) => {
    try {
      // Validate request
      const validation = storyGenerationSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error).message;
        return res.status(400).json({ message: errorMessage });
      }
      
      const { theme, protagonist, setting, plotElements, worldId, creatureIds } = validation.data;
      
      // Generate story using OpenAI
      const storyData = await generateFantasyStory(
        theme, 
        protagonist, 
        setting, 
        plotElements, 
        worldId, 
        creatureIds
      );
      
      // Validate generated story against schema
      const storyValidation = insertStorySchema.safeParse(storyData);
      
      if (!storyValidation.success) {
        const errorMessage = fromZodError(storyValidation.error).message;
        return res.status(500).json({ message: `Generated story is invalid: ${errorMessage}` });
      }
      
      // Store the story
      const story = await storage.createStory(storyValidation.data);
      
      res.json(story);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate story";
      res.status(500).json({ message });
    }
  });

  app.post("/api/story/:id/save", async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const { worldId } = req.body;
      
      if (!worldId) {
        return res.status(400).json({ message: "World ID is required" });
      }
      
      const story = await storage.getStory(storyId);
      const world = await storage.getWorld(worldId);
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      if (!world) {
        return res.status(404).json({ message: "World not found" });
      }
      
      // In a real implementation, we would check if the user owns the world
      const updatedStory = await storage.updateStory(storyId, { worldId });
      
      res.json(updatedStory);
    } catch (err) {
      res.status(500).json({ message: "Failed to save story" });
    }
  });

  return httpServer;
}

// Initialize sample data for new users
async function initializeSampleData() {
  const worlds = await storage.getWorlds();
  
  // Only seed data if no worlds exist
  if (worlds.length === 0) {
    // Create a sample featured world
    const aerithia = await storage.createWorld({
      name: "Aerithia",
      description: "A magical realm where floating islands drift among luminous clouds, inhabited by beings that can shape-shift between human and animal forms.",
      type: "celestial",
      magicSystem: "arcane",
      geography: "Floating islands connected by light bridges and air currents, surrounded by luminous clouds",
      magic: "Aether magic that allows control of wind, light, and gravity",
      inhabitants: "Shape-shifting beings with both human and animal forms",
      history: "Ancient civilization that ascended to the skies during the Great Cataclysm",
      region: "The Floating Isles of Aerithia",
      regions: ["Crystal Spire Islands", "Cloud Wilds", "The Luminous Abyss"],
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
    });
    
    // Set it as featured
    await storage.updateWorld(aerithia.id, { featured: true });
    
    // Create a creature for this world
    await storage.createCreature({
      name: "Zephyr Felinus",
      description: "A majestic winged feline with iridescent feathers that shimmer in the light of Aerithia's twin moons. Its paws can manipulate air currents.",
      type: "mythical",
      powerLevel: 7,
      intelligence: 8,
      speed: 9,
      magic: 7,
      abilities: ["Wind manipulation", "Flight", "Telepathy with other creatures"],
      imageUrl: "https://images.unsplash.com/photo-1568283096533-078a38221368?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      worldId: aerithia.id
    });
    
    // Create a second sample world
    const sylvaneth = await storage.createWorld({
      name: "Sylvaneth",
      description: "An ancient forest realm where trees whisper secrets and sentient plants rule.",
      type: "medieval",
      magicSystem: "elemental",
      geography: "Vast ancient forests with towering trees, hidden glades, and mystical groves",
      magic: "Nature magic that allows communication with plants and animals",
      inhabitants: "Plant-like humanoids, forest spirits, and woodland creatures",
      history: "Born from the tears of the Earth Mother, Sylvaneth has remained unchanged for millennia",
      region: "The Great Verdant Expanse",
      regions: ["Whispering Woods", "Ancient Grove", "Crystal Pools"],
      imageUrl: "https://images.unsplash.com/photo-1604519029005-5a309bb68f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80"
    });
    
    // Create a third sample world
    await storage.createWorld({
      name: "Ignarium",
      description: "A volcanic kingdom where fire elementals forge artifacts of incredible power.",
      type: "elemental",
      magicSystem: "elemental",
      geography: "Volcanic islands, rivers of lava, and obsidian mountains",
      magic: "Fire magic that allows the manipulation of heat and flame",
      inhabitants: "Fire elementals, salamanders, and heat-resistant humanoids",
      history: "Formed in the Great Sundering when the world split open, revealing the molten core",
      region: "The Blazing Archipelago",
      regions: ["Magma Falls", "Obsidian Peaks", "Ember Isles"],
      imageUrl: "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    });
  }
}
