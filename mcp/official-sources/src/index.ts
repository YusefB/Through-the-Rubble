#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { fetchReliefWebUpdates } from './sources/reliefweb.js'

const server = new Server(
  { name: 'official-sources', version: '0.1.0' },
  { capabilities: { tools: {} } },
)

const FETCH_RELIEFWEB_TOOL = {
  name: 'fetch_reliefweb_updates',
  description:
    'Fetch the latest reports from the ReliefWeb public API and return them in source_registry shape (id, publisher, title, url, url_hash, published_at, fetched_at, acquisition_mode, raw_payload). Read-only — does not write to the database.',
  inputSchema: {
    type: 'object',
    properties: {
      country: {
        type: 'string',
        description:
          "ReliefWeb country query value. Defaults to 'Palestinian Territory, occupied'.",
      },
      limit: {
        type: 'number',
        description: 'Maximum number of reports to return. Default: 10.',
        minimum: 1,
        maximum: 100,
      },
    },
    additionalProperties: false,
  },
} as const

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [FETCH_RELIEFWEB_TOOL],
}))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params

  if (name === 'fetch_reliefweb_updates') {
    const input = (args ?? {}) as { country?: string; limit?: number }
    try {
      const sources = await fetchReliefWebUpdates(input)
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(sources, null, 2),
          },
        ],
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `fetch_reliefweb_updates failed: ${message}`,
          },
        ],
      }
    }
  }

  return {
    isError: true,
    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
