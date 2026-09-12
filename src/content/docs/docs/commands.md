---
title: "Commands"
description: "Every command with its options and output."
---

```bash
codemap .              # structure view (respects .codemap/config.json)
codemap --diff         # what changed vs main
codemap --deps .       # dependency flow
codemap --importers f  # who imports a file
codemap blast-radius   # review bundle: diff + deps + importers
codemap collide        # rank open PRs by shared-file merge-order hazard
codemap find "<query>" # rank files by path and symbol match, with importer counts
codemap handoff .      # save layered handoff for cross-agent continuation
codemap context        # machine-readable project context JSON
codemap doctor         # validate agent integrations
codemap skill list     # available agent skills
codemap watch start    # background daemon for live graph state
codemap serve          # HTTP API for non-MCP integrations
codemap mcp            # MCP server on stdio
codemap --version
```

### Options

Standard linked Git worktrees automatically reuse the primary worktree's
`.codemap/config.json` and project skills. Create the worktree with Git, an IDE,
or any manager that uses standard linked-worktree metadata, then give the agent
its absolute path:

```bash
git worktree add <path> -b <branch> <base>
codemap -C /tmp/feature-worktree context
```

Normal CLI and plugin MCP calls need no `--setup-root`: central config and skills
come from the primary worktree, while handoffs, watcher files, and hook/session
state remain in the linked worktree. Independent clones have no trusted Git
metadata linking them, so sharing setup between them still requires an explicit
override:

```bash
codemap -C /tmp/independent-clone --setup-root /path/to/original context
```

`-C`/`--project-root` selects the repository Codemap operates on.
`--setup-root` explicitly reuses `<repository>/.codemap` policy and runtime state
from another checkout. Both accept a repository or subdirectory; relative setup
paths resolve from the project root.

| Flag | Description |

| Flag | Description |
|------|-------------|
| `-C, --project-root <repo>` | Operate on code in `<repo>` |
| `--setup-root <repo>` | Explicitly reuse policy and runtime state from `<repo>/.codemap` |
| `--depth, -d <n>` | Limit tree depth (0 = unlimited) |
| `--only <exts>` | Only include files with these extensions |
| `--exclude <patterns>` | Exclude files matching patterns |
| `--diff` | Show files changed vs main branch |
| `--ref <branch>` | Branch to compare against (with `--diff`) |
| `--deps` | Dependency flow mode |
| `--importers <file>` | Check who imports a file |
| `--skyline` | City skyline visualization |
| `--animate` | Animate the skyline (with `--skyline`) |
| `--json` | Output JSON |

> Flags come before the path/URL: `codemap --json github.com/user/repo`

**Pattern matching** needs no quotes: `.png` matches any `.png` file, `Fonts` matches any `/Fonts/` directory, `*Test*` is a glob.


## Modes

### Diff

```bash
codemap --diff
codemap --diff --ref develop
```

```
╭─────────────────────────── myproject ──────────────────────────╮
│ Changed: 4 files | +156 -23 lines vs main                      │
╰────────────────────────────────────────────────────────────────╯
├── api/
│   └── (new) auth.go         ✎ handlers.go (+45 -12)
└── ✎ main.go (+29 -3)

⚠ handlers.go is used by 3 other files
```

### Dependency flow

```bash
codemap --deps .
```

```
╭──────────────────────────────────────────────────────────────╮
│                    MyApp - Dependency Flow                   │
├──────────────────────────────────────────────────────────────┤
│ Go: chi, zap, testify                                        │
╰──────────────────────────────────────────────────────────────╯

Backend ════════════════════════════════════════════════════
  server ───▶ validate ───▶ rules, config
  api ───▶ handlers, middleware

HUBS: config (12←), api (8←), utils (5←)
```

### Blast radius

Who breaks if you change a file:

```bash
codemap --importers config/config.go
```

```
⚠️  HUB FILE: config/config.go
   Imported by 21 files - changes have wide impact!

   Dependents:
   • cmd/hooks.go
   • mcp/find_guidance.go
   ...
```

For a review bundle in one command  -  Markdown, text, or a single JSON object:

```bash
codemap blast-radius --ref main .
codemap blast-radius --json --ref main .
codemap blast-radius --text --ref main .
```

### Skyline

```bash
codemap --skyline --animate
```

![codemap skyline](https://raw.githubusercontent.com/JordanCoin/codemap/main/assets/skyline-animated.gif)

### Remote repos

Analyze any public GitHub or GitLab repo without cloning it yourself:

```bash
codemap github.com/anthropics/anthropic-cookbook
codemap gitlab.com/user/repo
```

Shallow-clones to a temp directory and cleans up. If you already have the repo locally, codemap uses your copy.


## Skills

Markdown files that give agents context-aware guidance, matched against intent, mentioned files, and project languages.

```bash
codemap skill list
codemap skill show hub-safety
codemap skill init            # custom skill template
```

| Builtin | Activates when |
|---------|---------------|
| `hub-safety` | Editing hub files (3+ importers) |
| `refactor` | Restructuring, renaming, moving code |
| `test-first` | Writing tests, TDD workflows |
| `explore` | Understanding how code works |
| `handoff` | Switching between AI agents |
| `config-setup` | `.codemap/config.json` is missing, boilerplate, or mismatched to the stack |

Drop a `.md` file with YAML frontmatter in `.codemap/skills/` to add your own  -  project-local skills override builtins, no Go code required:

```yaml
---
name: my-skill
description: When this skill should activate
keywords: ["relevant", "keywords"]
languages: ["go"]
---

# Instructions for the AI agent
```
