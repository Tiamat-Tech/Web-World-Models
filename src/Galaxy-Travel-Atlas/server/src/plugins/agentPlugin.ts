import type { Destination, ThemeProfile, ThemeRequestPayload } from "../types.js";

export interface ThemePluginContext {
  destination: Destination;
  request: ThemeRequestPayload;
}

export interface AgentPlugin {
  id: string;
  label: string;
  supportsImages: boolean;
  ready(): boolean;
  generateTheme(context: ThemePluginContext): Promise<ThemeProfile>;
}
