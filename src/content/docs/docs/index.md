---
title: "Overview"
description: "What codemap computes and what it refuses to claim."
---

> **codemap  -  structural ground truth for coding agents.**
> Resolves what your code actually imports, tells you what breaks if you change it, and is explicit about what it couldn't figure out.

![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/JordanCoin/6ffe3276ddb8a7a7f08d50d649e567bd/raw/codemap-coverage.json)
[](https://smithery.ai/skills?ns=jordancoin&utm_source=github&utm_medium=badge)

![codemap screenshot](https://raw.githubusercontent.com/JordanCoin/codemap/main/assets/codemap.png)



An agent reading your repo can see what a file *says*. It can't cheaply see what depends on that file. That answer lives in `go.mod`, Cargo workspace membership, `package.json` `exports` maps, and `tsconfig` path aliases, not in the source text.

codemap computes three things:

| | |
|---|---|
| **Orientation** | A structure map with the most-imported files called out. Cheap cold start, useful when an agent has no memory of the last hour. |
| **Dependency graph** | Imports resolved through each ecosystem's real rules, not string matching. |
| **Blast radius** | Who breaks if you change this file. |


## Where to go next

- [Install and setup](/docs/install/)
- [Commands](/docs/commands/)
- [Coverage contract](/docs/coverage/)
- [MCP server](/docs/mcp/)
- [Hooks](/docs/hooks/)
- [The CI action](/docs/ci/)
- [Output standard](/docs/output-standard/)
