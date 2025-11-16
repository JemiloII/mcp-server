import { readdir } from 'fs/promises';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default async function registerTools (mcp: McpServer) {
  const dir = await readdir('.');
  for (const module of dir) {
    const { name, tool, callback } = await import(`./${module}`);
    console.log('Registering Tool:', tool.title);
    mcp.registerTool(name, tool, callback);
  }
}
