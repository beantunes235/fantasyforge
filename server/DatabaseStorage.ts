import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  users, worlds, creatures, stories,
  type User, type InsertUser,
  type World, type InsertWorld,
  type Creature, type InsertCreature,
  type Story, type InsertStory
} from "@shared/schema";
import { IStorage } from "./storage";

// Stock images for use in mock generation
const stockImages = {
  landscape: [
    "https://images.unsplash.com/photo-1655413035736-03608723e702?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1642344955072-c050603b42dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    "https://images.unsplash.com/photo-1604519029005-5a309bb68f21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80",
    "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
  ],
  creature: [
    "https://images.unsplash.com/photo-1585394732656-afe358a50a6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1171&q=80",
    "https://images.unsplash.com/photo-1568283096533-078a38221368?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1577493340887-b7bfff550145?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1531137377666-2f79abbda4a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-4.0.3&auto=format&fit=crop&w=1064&q=80"
  ],
  character: [
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1061&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1160&q=80",
    "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1599&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1088&q=80",
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1089&q=80"
  ]
};

export class DatabaseStorage implements IStorage {
  // Method to get random images for mock generation
  getRandomImage(type: 'landscape' | 'creature' | 'character'): string {
    const images = stockImages[type];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  }
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // World methods
  async getWorld(id: number): Promise<World | undefined> {
    const [world] = await db.select().from(worlds).where(eq(worlds.id, id));
    return world;
  }

  async getWorlds(featured?: boolean): Promise<World[]> {
    if (featured !== undefined) {
      return db.select().from(worlds).where(eq(worlds.featured, featured));
    }
    return db.select().from(worlds);
  }

  async getUserWorlds(userId: string): Promise<World[]> {
    return db.select().from(worlds).where(eq(worlds.userId, parseInt(userId)));
  }

  async createWorld(insertWorld: InsertWorld): Promise<World> {
    const [world] = await db.insert(worlds).values(insertWorld).returning();
    return world;
  }

  async updateWorld(id: number, worldUpdate: Partial<World>): Promise<World | undefined> {
    const [updated] = await db
      .update(worlds)
      .set(worldUpdate)
      .where(eq(worlds.id, id))
      .returning();
    return updated;
  }

  async deleteWorld(id: number): Promise<boolean> {
    const result = await db.delete(worlds).where(eq(worlds.id, id));
    return !!result;
  }

  // Creature methods
  async getCreature(id: number): Promise<Creature | undefined> {
    const [creature] = await db.select().from(creatures).where(eq(creatures.id, id));
    return creature;
  }

  async getCreaturesByWorld(worldId: number): Promise<Creature[]> {
    return db.select().from(creatures).where(eq(creatures.worldId, worldId));
  }

  async createCreature(insertCreature: InsertCreature): Promise<Creature> {
    const [creature] = await db.insert(creatures).values(insertCreature).returning();
    
    // Update creature count on the world
    if (insertCreature.worldId) {
      const [world] = await db
        .select()
        .from(worlds)
        .where(eq(worlds.id, insertCreature.worldId));
      
      if (world) {
        await db
          .update(worlds)
          .set({ creatureCount: (world.creatureCount || 0) + 1 })
          .where(eq(worlds.id, world.id));
      }
    }
    
    return creature;
  }

  async updateCreature(id: number, creatureUpdate: Partial<Creature>): Promise<Creature | undefined> {
    const [updated] = await db
      .update(creatures)
      .set(creatureUpdate)
      .where(eq(creatures.id, id))
      .returning();
    return updated;
  }

  async deleteCreature(id: number): Promise<boolean> {
    const [creature] = await db.select().from(creatures).where(eq(creatures.id, id));
    
    if (creature && creature.worldId) {
      // First decrement the creature count on the world
      const [world] = await db
        .select()
        .from(worlds)
        .where(eq(worlds.id, creature.worldId));
      
      if (world && world.creatureCount && world.creatureCount > 0) {
        await db
          .update(worlds)
          .set({ creatureCount: world.creatureCount - 1 })
          .where(eq(worlds.id, world.id));
      }
    }
    
    // Then delete the creature
    const result = await db.delete(creatures).where(eq(creatures.id, id));
    return !!result;
  }

  // Story methods
  async getStory(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story;
  }

  async getStoriesByWorld(worldId: number): Promise<Story[]> {
    return db.select().from(stories).where(eq(stories.worldId, worldId));
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db.insert(stories).values(insertStory).returning();
    
    // Update story count on the world
    if (insertStory.worldId) {
      const [world] = await db
        .select()
        .from(worlds)
        .where(eq(worlds.id, insertStory.worldId));
      
      if (world) {
        await db
          .update(worlds)
          .set({ storyCount: (world.storyCount || 0) + 1 })
          .where(eq(worlds.id, world.id));
      }
    }
    
    return story;
  }

  async updateStory(id: number, storyUpdate: Partial<Story>): Promise<Story | undefined> {
    const [updated] = await db
      .update(stories)
      .set(storyUpdate)
      .where(eq(stories.id, id))
      .returning();
    return updated;
  }

  async deleteStory(id: number): Promise<boolean> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    
    if (story && story.worldId) {
      // First decrement the story count on the world
      const [world] = await db
        .select()
        .from(worlds)
        .where(eq(worlds.id, story.worldId));
      
      if (world && world.storyCount && world.storyCount > 0) {
        await db
          .update(worlds)
          .set({ storyCount: world.storyCount - 1 })
          .where(eq(worlds.id, world.id));
      }
    }
    
    // Then delete the story
    const result = await db.delete(stories).where(eq(stories.id, id));
    return !!result;
  }
}