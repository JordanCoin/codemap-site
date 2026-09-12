---
title: "Install and setup"
description: "Homebrew, Scoop, tarballs, then codemap setup for Claude Code and Codex."
---

```bash
# macOS/Linux
brew tap JordanCoin/tap && brew install codemap

# Windows
scoop bucket add codemap https://github.com/JordanCoin/scoop-codemap
scoop install codemap
```

> Other options: [Releases](https://github.com/JordanCoin/codemap/releases) | `go install` | build from source

### CI / tarball install

Release tarballs ship `codemap` and the bundled rules but not the `ast-grep` executable, which `--deps` needs. Either install it separately:

```bash
apk add --no-cache curl jq bash python3 py3-pip

ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then ARCH="amd64"; elif [ "$ARCH" = "aarch64" ]; then ARCH="arm64"; fi

CODEMAP_VERSION=$(curl -fsSL https://api.github.com/repos/JordanCoin/codemap/releases/latest | jq -r '.tag_name' | tr -d 'v')
curl -fsSL "https://github.com/JordanCoin/codemap/releases/download/v${CODEMAP_VERSION}/codemap_${CODEMAP_VERSION}_linux_${ARCH}.tar.gz" \
  | tar xz -C /usr/local/bin/ codemap

python3 -m pip install --no-cache-dir ast-grep-cli
```

…or use the self-contained `codemap-full` artifact, which bundles `codemap`, `ast-grep`, and `sg`:

```bash
curl -fsSL "https://github.com/JordanCoin/codemap/releases/download/v${CODEMAP_VERSION}/codemap-full_${CODEMAP_VERSION}_linux_${ARCH}.tar.gz" \
  | tar xz -C /usr/local/bin/ codemap ast-grep sg
```


## Setup

Run setup anywhere inside your git repo. Repo-scoped commands such as
`setup`, `doctor`, `config`, `watch`, `skill`, `context`, `serve`, and
managed hooks resolve the nearest git root automatically, including linked
worktrees with a `.git` file.

```bash
cd /path/to/your/project
codemap setup
```

`codemap setup` configures Claude Code and Codex by default:

- creates `.codemap/config.json` with auto-detected language filters
- merges hooks into `.claude/settings.local.json` and `.codex/hooks.json`
- configures MCP in `.mcp.json` and `.codex/config.toml`
- hooks start and read daemon state at session start

Managed entries record the verified absolute path of the running `codemap`, so agents don't depend on your shell `PATH`. Rerun setup if that path changes.

```bash
codemap setup --agent claude   # one agent only
codemap setup --agent codex
codemap setup --global         # user-scope, applies to every project
```

### Verify

```bash
codemap doctor            # validate this project's integrations
codemap doctor --global   # validate user-scope configuration
```

Doctor checks project scope and falls back to user scope, reporting which one satisfied each check. For Codex, trust the hooks from `/hooks` in CLI or Settings → Hooks in Desktop, then start a new session.


## Project config

Per-project defaults in `.codemap/config.json`, so you don't pass `--only`/`--exclude`/`--depth` every time. Hooks respect it too.

```bash
codemap config init   # auto-detect top extensions, write config
codemap config show   # display current config
```

```json
{
  "only": ["rs", "sh", "sql", "toml", "yml"],
  "exclude": ["docs/reference", "docs/research"],
  "depth": 4,
  "mode": "auto",
  "guidance": {
    "missing_extension_hints": true,
    "ignored_extensions": []
  },
  "budgets": {
    "session_start_bytes": 30000,
    "diff_bytes": 15000,
    "max_hubs": 8
  },
  "routing": {
    "retrieval": { "strategy": "keyword", "top_k": 3 },
    "subsystems": [
      {
        "id": "watching",
        "paths": ["watch/**"],
        "keywords": ["hook", "daemon", "events"],
        "docs": ["docs/HOOKS.md"],
        "agents": ["codemap-hook-triage"]
      }
    ]
  },
  "drift": {
    "enabled": true,
    "recent_commits": 10,
    "require_docs_for": ["watching"]
  }
}
```

All fields are optional; CLI flags always override config. When an MCP file search finds real matches hidden by `only`, codemap reports the paths and suggests which extensions to add  -  set `guidance.missing_extension_hints: false` to disable.
