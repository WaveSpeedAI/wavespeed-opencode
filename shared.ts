import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** The hosted WaveSpeed MCP server. It signs in through the browser (OAuth); OpenCode keeps the token. */
export const MCP_NAME = "wavespeed";
export const MCP_URL = "https://api.wavespeed.ai/mcp";

/** The directory holding the bundled `wavespeed` skill (`skills/wavespeed/SKILL.md`). */
export const skillsDir = join(dirname(fileURLToPath(import.meta.url)), "skills");
export const skillPath = join(skillsDir, "wavespeed", "SKILL.md");

/** The skill's `name`, `description` and body, for OpenCode 2, which takes skills as entries rather than directories. */
export async function bundledSkill() {
  const text = await readFile(skillPath, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  const fields: Record<string, string> = {};
  for (const line of (match?.[1] ?? "").split("\n")) {
    const field = /^([\w-]+):\s*(.*)$/.exec(line);
    if (field) fields[field[1]] = field[2];
  }
  return {
    id: "wavespeed",
    name: fields.name ?? "wavespeed",
    description: fields.description,
    path: skillPath,
    content: match ? text.slice(match[0].length) : text,
  };
}
