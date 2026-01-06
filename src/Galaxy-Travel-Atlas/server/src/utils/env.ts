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
};

export const isProduction = env.nodeEnv === "production";
