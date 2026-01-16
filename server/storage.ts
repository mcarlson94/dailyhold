import { db } from "./db";
import { users, type User, type InsertUser } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Minimal interface since logic is client-side
  getUser(id: number): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
}

export const storage = new DatabaseStorage();
