import { pgTable, text, serial, integer, boolean, timestamp, foreignKey, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// World schema
export const worlds = pgTable("worlds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  magicSystem: text("magic_system").notNull(),
  geography: text("geography").notNull(),
  magic: text("magic").notNull(),
  inhabitants: text("inhabitants").notNull(),
  history: text("history").notNull(),
  region: text("region").notNull(),
  regions: text("regions").array(),
  imageUrl: text("image_url").notNull(),
  creatureCount: integer("creature_count").default(0),
  storyCount: integer("story_count").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

// Creature schema
export const creatures = pgTable("creatures", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  powerLevel: integer("power_level").notNull(),
  intelligence: integer("intelligence").notNull(),
  speed: integer("speed").notNull(),
  magic: integer("magic").notNull(),
  abilities: text("abilities").array(),
  imageUrl: text("image_url").notNull(),
  worldId: integer("world_id").references(() => worlds.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Story schema
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  theme: text("theme").notNull(),
  protagonist: text("protagonist").notNull(),
  setting: text("setting").notNull(),
  plotElements: text("plot_elements").array(),
  worldId: integer("world_id").references(() => worlds.id),
  creatureIds: integer("creature_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations after all tables are defined
export const usersRelations = relations(users, ({ many }) => ({
  worlds: many(worlds),
}));

export const worldsRelations = relations(worlds, ({ one, many }) => ({
  user: one(users, {
    fields: [worlds.userId],
    references: [users.id],
  }),
  creatures: many(creatures),
  stories: many(stories),
}));

export const creaturesRelations = relations(creatures, ({ one }) => ({
  world: one(worlds, {
    fields: [creatures.worldId],
    references: [worlds.id],
  }),
}));

export const storiesRelations = relations(stories, ({ one }) => ({
  world: one(worlds, {
    fields: [stories.worldId],
    references: [worlds.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWorldSchema = createInsertSchema(worlds).omit({
  id: true,
  creatureCount: true,
  storyCount: true,
  featured: true,
  createdAt: true,
});

export const insertCreatureSchema = createInsertSchema(creatures).omit({
  id: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

// Type Exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type World = typeof worlds.$inferSelect;
export type InsertWorld = z.infer<typeof insertWorldSchema>;

export type Creature = typeof creatures.$inferSelect;
export type InsertCreature = z.infer<typeof insertCreatureSchema>;

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
