import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Simple status endpoint
  app.get(api.status.check.path, (_req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
