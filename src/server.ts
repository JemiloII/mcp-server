import { serve } from '@hono/node-server';
import app from './index.js';

serve({
  fetch: app.fetch,
  port: 5096,
}, (info) => console.log('Server started with:', info));
