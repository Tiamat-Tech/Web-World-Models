import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import { apiRouter } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "*"
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => {
    res.json({
      status: "ok",
      service: "Web World Model API",
      docs: "/api"
    });
  });

  app.get("/healthz", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", apiRouter);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ message: "Unexpected server error" });
  });

  return app;
}
