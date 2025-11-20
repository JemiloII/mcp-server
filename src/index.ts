import { fileURLToPath } from 'url';
import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from '@hono/node-server/serve-static';
import { StreamableHTTPTransport } from '@hono/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './tools';

const SUPPORTED_PROTOCOL = ['2025-06-18'];
const mcp = new McpServer({ name: 'Umamusume Trainer', version: '1.0.1' });
await registerTools(mcp);

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
app.use('/favicon.ico', serveStatic({
  path: fileURLToPath(new URL('./favicon.ico', import.meta.url))
}));

app.use('*', cors({
  origin: (origin) => origin ?? '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['*'],
  exposeHeaders: ['Mcp-Session-Id', 'WWW-Authenticate', 'Content-Type', 'Last-Event-ID'],
  maxAge: 86400,
}));

app.get('/.well-known/mcp.json', (c) =>
  c.json({
    name: 'Umamusume Trainer',
    transport: 'streamable-http',
    endpoint: '/mcp',
    icon: 'https://umamusume.training/favicon.png',
    versions: SUPPORTED_PROTOCOL,
  })
);

app.get('/health', (c) => c.json({ status: 'ok', ts: new Date().toISOString() }));

app.on(['GET', 'POST', 'OPTIONS'], ['/', '/mcp'], async (c: Context) => {
  await ensureConnected();
  const response = await transport.handleRequest(c);

  if (response!.headers.get('content-type')?.includes('text/event-stream')) {
    const text = await response!.text();
    return c.text(text, 200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    });
  }

  return response;
});

app.notFound((c) => {
  return c.text('Not Found', 404);
});

app.onError((error, c) => {
  console.error(`${error}`);
  return c.text('Server Error', 500);
});

export default app;
