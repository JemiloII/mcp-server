import { Hono, type Context, type Handler } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPTransport } from '@hono/mcp';
import { z } from 'zod';

const SUPPORTED_PROTOCOL = ['2024-11-05', '2025-06-18'];
const mcp = new McpServer({ name: 'umamusume-mcp', version: '1.0.1' });

mcp.registerTool(
  'stamina.calculate',
  {
    title: 'Umamusume Stamina Calculator',
    description: 'Compute stamina from inputs.',
    inputSchema: { speed: z.number() },
    outputSchema: { result: z.number() }
  },
  (params: any) => {
    try {
      console.log('params:', params);
      const { speed } = params;
      const result = speed * 2;
      const output = { result };
      const response = {
        content: [ {
          type: 'text',
          text: JSON.stringify(output)
        } ],
        structuredContent: output
      };
      console.log('Response:', response);
      return response;
    } catch (e) {
      console.error('GOT MCP ERROR', e);
      throw e;
    }
  }
);

const app = new Hono({ strict: false });
const transport = new StreamableHTTPTransport();
async function ensureConnected(): Promise<void> {
  if (!mcp.isConnected()) {
    await mcp.connect(transport as any);
  }
}

app.use('*', async (c, next) => {
  const req = c.req;
  const raw = req.raw;

  console.log('=== Incoming request ===');
  console.log('Method:', raw.method);
  console.log('URL:', raw.url);
  console.log('Headers:', Object.fromEntries(raw.headers.entries()));

  try {
    const cloned = raw.clone();
    const contentType = cloned.headers.get('content-type') || '';
    const text = await cloned.text();

    if (!text) {
      console.log('Body: <empty>');
    } else if (contentType.includes('application/json')) {
      try {
        console.log('JSON Body:', JSON.parse(text));
      } catch {
        console.log('Body (invalid JSON):', text);
      }
    } else {
      console.log('Body:', text);
    }
  } catch (err) {
    console.log('Body read error:', err);
  }

  await next();
});
app.use('*', logger());

app.use('*', cors({
  origin: (origin) => origin ?? '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['*'],
  exposeHeaders: ['Mcp-Session-Id', 'WWW-Authenticate', 'Content-Type', 'Last-Event-ID'],
  maxAge: 86400,
}));

app.get('/.well-known/mcp.json', (c) =>
  c.json({
    transport: 'streamable-http',
    endpoint: '/mcp',
    versions: SUPPORTED_PROTOCOL,
  })
);

app.get('/health', (c) => c.json({ status: 'ok', ts: new Date().toISOString() }));

const mcpHandler: Handler = async (c: Context) => {
  await ensureConnected();
  return transport.handleRequest(c);
};

// Mount both paths (keep your UX).
app.on(['GET', 'POST', 'OPTIONS'], ['/', '/mcp'], mcpHandler);

app.notFound((c) => {
  return c.text('Not Found', 404);
});

app.onError((error, c) => {
  console.error(`${error}`);
  return c.text('Server Error', 500);
});

export default app;
