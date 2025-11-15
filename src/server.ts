import { createServer } from 'https';
import { readFileSync } from 'fs';
import { serve } from '@hono/node-server';
import app from './index.js';

const { SSL_KEY, SSL_CERT } = process.env;

serve({
  fetch: app.fetch,
  createServer,
  hostname: '0.0.0.0',
  port: 2096,
  serverOptions: {
    key: readFileSync(SSL_KEY as string),
    cert: readFileSync(SSL_CERT as string),
  },
}, (info) => console.log('Server started with:', info));
