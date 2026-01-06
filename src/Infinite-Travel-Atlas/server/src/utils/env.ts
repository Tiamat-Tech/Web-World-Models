import { config } from "dotenv";

config();

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: toNumber(process.env.PORT, 5001),
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    model: process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet",
  },
  procedural: {
    resolutionDeg: toNumber(process.env.PROCEDURAL_RESOLUTION_DEG, 0.75),
    cacheTtlMs: toNumber(process.env.PROCEDURAL_CACHE_TTL_MS, 1000 * 60 * 30),
    cacheLimit: toNumber(process.env.PROCEDURAL_CACHE_LIMIT, 1200),
  },
};

export const isProduction = env.nodeEnv === "production";
