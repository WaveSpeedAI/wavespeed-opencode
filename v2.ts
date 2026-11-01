import type { Plugin, Skill } from "@opencode/plugin";
import { MCP_NAME, MCP_URL, bundledSkill } from "./shared.ts";

/** OpenCode 2: registers the bundled skill and the hosted MCP server, keeping a `wavespeed` server the user configured. */
export const v2: Plugin.Plugin = {
  id: "wavespeed",
  async setup(ctx) {
    const skill = await bundledSkill();
    // SAFETY: Skill.Info's id and path are branded strings; the brands are compile-time only.
    await ctx.skill.transform((editor) => editor.add(skill as unknown as Skill.Info));
    await ctx.mcp.transform((editor) => {
      if (!editor.get(MCP_NAME)) editor.set(MCP_NAME, { type: "remote", url: MCP_URL });
    });
  },
};
