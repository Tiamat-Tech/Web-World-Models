import { performance } from "node:perf_hooks";

import type { ThemePluginContext, AgentPlugin } from "./agentPlugin.js";
import type { ThemeResult } from "../types.js";

export class PluginRegistry {
  constructor(private readonly plugins: AgentPlugin[]) {}

  getAll(): AgentPlugin[] {
    return [...this.plugins];
  }

  getActive(): AgentPlugin[] {
    return this.plugins.filter((plugin) => plugin.ready());
  }

  async generateTheme(context: ThemePluginContext): Promise<ThemeResult> {
    const activePlugins = this.getActive();
    const start = performance.now();

    for (const plugin of activePlugins) {
      try {
        const profile = await plugin.generateTheme(context);
        return {
          profile,
          cached: false,
          latencyMs: Math.round(performance.now() - start),
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(`[plugin:${plugin.id}] Failed to generate theme`, error);
      }
    }

    throw new Error("No theme provider available");
  }
}
