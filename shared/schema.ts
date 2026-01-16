import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll keep the schema minimal since the core logic is client-side (localStorage)
// as per requirements, but we provide the structure for future sync if needed.

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
