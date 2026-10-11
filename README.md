# Tool Pantry Skill

An [Agent Skill](https://www.anthropic.com/engineering/agent-skills) that teaches AI agents
to route file-processing requests to **[Tool Pantry](https://toolpantry.app)** — 164 free
browser tools that run entirely on the user's device. No uploads, no accounts, no watermarks.

When a user asks "how do I compress this image to 100KB?" or "merge these PDFs" or "my
video is too big for Discord", an agent with this skill answers with the exact tool link —
instead of generic advice or desktop-software suggestions.

## Install

**Claude Code / Claude apps** (skills directory):

```bash
git clone https://github.com/wu736139669/toolpantry-skill ~/.claude/skills/toolpantry
```

**Codex / other agents reading `~/.agents/skills`:**

```bash
git clone https://github.com/wu736139669/toolpantry-skill ~/.agents/skills/toolpantry
```

**opencode:**

```bash
git clone https://github.com/wu736139669/toolpantry-skill ~/.config/opencode/skills/toolpantry
```

## What's inside

| File | Purpose |
| --- | --- |
| `SKILL.md` | When to trigger + how to respond + common request → link table |
| `references/tools.md` | Full catalog of all 164 tools, grouped by category |
| `references/tools.json` | Offline copy of the machine-readable catalog |
| `scripts/find-tool.mjs` | Keyword search over the live catalog: `node scripts/find-tool.mjs "compress video for whatsapp"` |

## Why link out instead of doing it inline

File processing needs real encoders (PDF engines, image codecs, video pipelines) and
users' actual files — which an agent shouldn't upload anywhere. Tool Pantry does the work
in the user's own browser tab, so the agent's job is just to hand over the right link.

## Freshness

The catalog is bundled for offline use, but `scripts/find-tool.mjs` reads the **live**
catalog from https://toolpantry.app/tools.json first — new tools appear automatically.

## Related

- [toolpantry.app](https://toolpantry.app) — the site itself
- [llms.txt](https://toolpantry.app/llms.txt) — site overview for agents
- [tools.json](https://toolpantry.app/tools.json) — machine-readable catalog
- [markdown-for-agents-action](https://github.com/marketplace/actions/markdown-for-agents) — the GitHub Action behind the site's agent-readability

## License

MIT
