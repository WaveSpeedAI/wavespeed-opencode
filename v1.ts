import type { Plugin } from "@opencode-ai/plugin";
import { MCP_NAME, MCP_URL, skillsDir } from "./shared.ts";

/**
 * OpenCode 1: adds the bundled skill directory and the hosted MCP server to the config.
 * A `wavespeed` MCP entry the user already has (another URL, an API key header, disabled) is left as it is.
 */
export const server: Plugin = async () => ({
  async config(input) {
    // @ts-expect-error -- OpenCode reads skills.paths, but the plugin SDK's Config type does not declare it yet
    input.skills ??= {};
    // @ts-expect-error -- see above
    input.skills.paths ??= [];
    // @ts-expect-error -- see above
    if (!input.skills.paths.includes(skillsDir)) input.skills.paths.push(skillsDir);

    input.mcp ??= {};
    input.mcp[MCP_NAME] ??= { type: "remote", url: MCP_URL };
  },
});
