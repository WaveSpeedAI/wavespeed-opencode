// Checks both entry points against fakes of what OpenCode hands a plugin.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import plugin from "./index.ts";
import { MCP_URL, skillPath, skillsDir } from "./shared.ts";

assert.ok(existsSync(skillPath), "the skill is bundled");

// OpenCode 1: config hook
const hooks = await plugin.server({});
const config = {};
await hooks.config(config);
assert.deepEqual(config.mcp, { wavespeed: { type: "remote", url: MCP_URL } });
assert.deepEqual(config.skills.paths, [skillsDir]);
await hooks.config(config);
assert.equal(config.skills.paths.length, 1, "running the hook twice adds the skill directory once");
const own = { mcp: { wavespeed: { type: "remote", url: "https://example.com/mcp", headers: { Authorization: "Bearer x" } } } };
await hooks.config(own);
assert.equal(own.mcp.wavespeed.url, "https://example.com/mcp", "a wavespeed server the user configured is kept");

// OpenCode 2: skill and mcp transforms
const skills = [], servers = new Map();
await plugin.setup({
  skill: { transform: async (fn) => fn({ add: (s) => skills.push(s) }) },
  mcp: { transform: async (fn) => fn({ get: (n) => servers.get(n), set: (n, c) => servers.set(n, c) }) },
});
assert.equal(plugin.id, "wavespeed");
assert.equal(skills.length, 1);
assert.equal(skills[0].name, "wavespeed");
assert.ok(skills[0].description.startsWith("Generate or edit AI media"));
assert.ok(skills[0].content.includes("## Images and videos: the shortcuts") && !skills[0].content.startsWith("---"));
assert.deepEqual(servers.get("wavespeed"), { type: "remote", url: MCP_URL });
servers.set("wavespeed", { type: "remote", url: "https://example.com/mcp" });
await plugin.setup({ skill: { transform: async () => {} }, mcp: { transform: async (fn) => fn({ get: (n) => servers.get(n), set: (n, c) => servers.set(n, c) }) } });
assert.equal(servers.get("wavespeed").url, "https://example.com/mcp", "OpenCode 2 keeps the user's server too");
console.log("ok");
