import { readdir } from 'fs/promises';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export default async function registerTools (mcp: McpServer) {
  const dir = await readdir(new URL('.', import.meta.url));
  for (const module of dir.filter(m => m !== 'index.ts')) {
    const { name, tool, callback } = await import(`./${module}`);
    console.log('Registering Tool:', tool.title);
    mcp.registerTool(name, tool, callback);
  }
}
