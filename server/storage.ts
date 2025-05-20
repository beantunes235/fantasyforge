import { 
  User, InsertUser, users,
  World, InsertWorld, worlds,
  Creature, InsertCreature, creatures,
  Story, InsertStory, stories
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Utility methods
  getRandomImage(type: 'landscape' | 'creature' | 'character'): string;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // World methods
  getWorld(id: number): Promise<World | undefined>;
  getWorlds(featured?: boolean): Promise<World[]>;
  getUserWorlds(userId: string): Promise<World[]>;
  createWorld(world: InsertWorld): Promise<World>;
  updateWorld(id: number, world: Partial<World>): Promise<World | undefined>;
  deleteWorld(id: number): Promise<boolean>;
  
  // Creature methods
  getCreature(id: number): Promise<Creature | undefined>;
  getCreaturesByWorld(worldId: number): Promise<Creature[]>;
  createCreature(creature: InsertCreature): Promise<Creature>;
  updateCreature(id: number, creature: Partial<Creature>): Promise<Creature | undefined>;
  deleteCreature(id: number): Promise<boolean>;
  
  // Story methods
  getStory(id: number): Promise<Story | undefined>;
  getStoriesByWorld(worldId: number): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, story: Partial<Story>): Promise<Story | undefined>;
  deleteStory(id: number): Promise<boolean>;
}

// Memory Storage Implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private worlds: Map<number, World>;
  private creatures: Map<number, Creature>;
  private stories: Map<number, Story>;
  
  private userId: number;
  private worldId: number;
  private creatureId: number;
  private storyId: number;

  constructor() {
    this.users = new Map();
    this.worlds = new Map();
    this.creatures = new Map();
    this.stories = new Map();
    
    this.userId = 1;
    this.worldId = 1;
    this.creatureId = 1;
    this.storyId = 1;
    
    // Initialize with some stock fantasy landscape image URLs
    this.stockImages = {
      landscapes: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80", // Floating islands
        "https://images.unsplash.com/photo-1604519029005-5a309bb68f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80", // Forest realm
        "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", // Fire realm
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80", // Floating islands 2
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", // Night sky
        "https://images.unsplash.com/photo-1655413035736-03608723e702?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"  // Mountain realm
      ],
      creatures: [
        "https://images.unsplash.com/photo-1568283096533-078a38221368?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", // Dragon
        "https://images.unsplash.com/photo-1593179357196-025231ff9fa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", // Wolf
        "https://images.unsplash.com/photo-1576554284028-f5f464849315?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", // Owl
        "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",    // Horse
        "https://images.unsplash.com/photo-1585394732656-afe358a50a6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80", // Fox
        "https://images.unsplash.com/photo-1523246181290-a16e4207bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80"  // Gryphon statue
      ],
      characters: [
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80", // Knight
        "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1157&q=80", // Warrior
        "https://images.unsplash.com/photo-1551431009-a802eeec77b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",    // Wizard
        "https://images.unsplash.com/photo-1612036779831-b3834d2f37e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"  // Archer
      ]
    };
  }

  private stockImages: {
    landscapes: string[];
    creatures: string[];
    characters: string[];
  };

  getRandomImage(type: 'landscape' | 'creature' | 'character'): string {
    switch(type) {
      case 'landscape':
        return this.stockImages.landscapes[Math.floor(Math.random() * this.stockImages.landscapes.length)];
      case 'creature':
        return this.stockImages.creatures[Math.floor(Math.random() * this.stockImages.creatures.length)];
      case 'character':
        return this.stockImages.characters[Math.floor(Math.random() * this.stockImages.characters.length)];
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // World methods
  async getWorld(id: number): Promise<World | undefined> {
    return this.worlds.get(id);
  }

  async getWorlds(featured?: boolean): Promise<World[]> {
    const allWorlds = Array.from(this.worlds.values());
    if (featured !== undefined) {
      return allWorlds.filter(world => world.featured === featured);
    }
    return allWorlds;
  }

  async getUserWorlds(userId: string): Promise<World[]> {
    return Array.from(this.worlds.values()).filter(
      (world) => world.userId === userId,
    );
  }

  async createWorld(insertWorld: InsertWorld): Promise<World> {
    const id = this.worldId++;
    const world: World = { 
      ...insertWorld, 
      id, 
      creatureCount: 0, 
      storyCount: 0, 
      featured: false,
      createdAt: new Date() 
    };
    this.worlds.set(id, world);
    return world;
  }

  async updateWorld(id: number, worldUpdate: Partial<World>): Promise<World | undefined> {
    const world = this.worlds.get(id);
    if (!world) return undefined;
    
    const updatedWorld = { ...world, ...worldUpdate };
    this.worlds.set(id, updatedWorld);
    return updatedWorld;
  }

  async deleteWorld(id: number): Promise<boolean> {
    return this.worlds.delete(id);
  }

  // Creature methods
  async getCreature(id: number): Promise<Creature | undefined> {
    return this.creatures.get(id);
  }

  async getCreaturesByWorld(worldId: number): Promise<Creature[]> {
    return Array.from(this.creatures.values()).filter(
      (creature) => creature.worldId === worldId,
    );
  }

  async createCreature(insertCreature: InsertCreature): Promise<Creature> {
    const id = this.creatureId++;
    const creature: Creature = { ...insertCreature, id, createdAt: new Date() };
    this.creatures.set(id, creature);
    
    // Update creature count in the associated world
    const world = this.worlds.get(creature.worldId);
    if (world) {
      this.worlds.set(world.id, {
        ...world,
        creatureCount: (world.creatureCount || 0) + 1
      });
    }
    
    return creature;
  }

  async updateCreature(id: number, creatureUpdate: Partial<Creature>): Promise<Creature | undefined> {
    const creature = this.creatures.get(id);
    if (!creature) return undefined;
    
    const updatedCreature = { ...creature, ...creatureUpdate };
    this.creatures.set(id, updatedCreature);
    return updatedCreature;
  }

  async deleteCreature(id: number): Promise<boolean> {
    const creature = this.creatures.get(id);
    if (!creature) return false;
    
    const result = this.creatures.delete(id);
    
    // Update creature count in the associated world
    if (result) {
      const world = this.worlds.get(creature.worldId);
      if (world && world.creatureCount > 0) {
        this.worlds.set(world.id, {
          ...world,
          creatureCount: world.creatureCount - 1
        });
      }
    }
    
    return result;
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStoriesByWorld(worldId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(
      (story) => story.worldId === worldId,
    );
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.storyId++;
    const story: Story = { ...insertStory, id, createdAt: new Date() };
    this.stories.set(id, story);
    
    // Update story count in the associated world
    const world = this.worlds.get(story.worldId);
    if (world) {
      this.worlds.set(world.id, {
        ...world,
        storyCount: (world.storyCount || 0) + 1
      });
    }
    
    return story;
  }

  async updateStory(id: number, storyUpdate: Partial<Story>): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (!story) return undefined;
    
    const updatedStory = { ...story, ...storyUpdate };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  async deleteStory(id: number): Promise<boolean> {
    const story = this.stories.get(id);
    if (!story) return false;
    
    const result = this.stories.delete(id);
    
    // Update story count in the associated world
    if (result) {
      const world = this.worlds.get(story.worldId);
      if (world && world.storyCount > 0) {
        this.worlds.set(world.id, {
          ...world,
          storyCount: world.storyCount - 1
        });
      }
    }
    
    return result;
  }
}

import { DatabaseStorage } from "./DatabaseStorage";

// For a memory-only implementation, use: export const storage = new MemStorage();
// For a database implementation, use: export const storage = new DatabaseStorage();
export const storage = new DatabaseStorage();
