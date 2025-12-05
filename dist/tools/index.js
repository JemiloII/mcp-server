import { readdir } from 'fs/promises';
export async function registerTools(mcp) {
    const dir = await readdir(new URL('.', import.meta.url));
    for (const module of dir.filter(m => m !== 'index.ts' && m !== 'shared')) {
        const { name, tool, callback, disabled } = await import(`./${module}`);
        if (disabled)
            continue;
        console.log('Registering Tool:', tool.title);
        mcp.registerTool(name, tool, callback);
    }
}
