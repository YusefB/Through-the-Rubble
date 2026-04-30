# official-sources MCP server

A standalone Model Context Protocol server that fetches updates from public humanitarian / official sources and returns them shaped for the `source_registry` table used by the Through The Rubble project.

This server is **read-only**: it does not write to the database. Admins review the returned objects and decide what to import.

## Tools

### `fetch_reliefweb_updates`

Calls the [ReliefWeb v1 API](https://apidoc.reliefweb.int/) and returns a list of `NormalizedSource` objects.

Input:

```jsonc
{
  "country": "Palestinian Territory, occupied", // optional, default shown
  "limit": 10                                    // optional, default 10
}
```

Each returned object has the shape:

```ts
{
  id: string,                                  // e.g. "reliefweb:4242"
  publisher: string,
  title: string,
  url: string,
  url_hash: string,                            // sha256 hex digest of url
  published_at: string | null,                 // ISO 8601
  fetched_at: string,                          // ISO 8601 (now)
  acquisition_mode: 'api',
  raw_payload: unknown                         // original ReliefWeb report
}
```

## Local development

This package is independent from the Next.js app. From this directory:

```bash
npm install
npm run dev          # tsx — direct TypeScript run
# or
npm run build && npm start
npm test             # vitest
```

Node 24+ is required (the server relies on the global `fetch`).

## Wiring it into Claude Code / Cursor

Add an entry to your client's `mcp.json` (e.g. `~/.cursor/mcp.json` or the Claude desktop config):

```json
{
  "mcpServers": {
    "official-sources": {
      "command": "node",
      "args": ["/Users/yusef/throughtherubble/mcp/official-sources/dist/index.js"]
    }
  }
}
```

For dev iteration without rebuilding, use `tsx`:

```json
{
  "mcpServers": {
    "official-sources": {
      "command": "npx",
      "args": ["tsx", "/Users/yusef/throughtherubble/mcp/official-sources/src/index.ts"]
    }
  }
}
```

After editing the config, restart the client to pick up the server.

## Adding more sources

1. Create a new module under `src/sources/`, exporting a function that returns `Promise<NormalizedSource[]>`.
2. Register a new tool in `src/index.ts`.
3. Add tests next to the source module (`*.test.ts`).
