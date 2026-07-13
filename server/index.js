const path = require('path');
// Single-.env setup: the server reads the same root .env the Expo app uses.
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config(); // optional server-local .env overrides

const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { connectStore } = require('./src/store');
const { registerRoutes } = require('./src/routes');
const { registerSockets } = require('./src/sockets');

const PORT = Number(process.env.PORT || 4000);

async function main() {
  const store = await connectStore(process.env.MONGODB_URI);

  const app = express();
  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });

  registerRoutes(app, store);
  registerSockets(io, store);

  app.get('/health', (_req, res) =>
    res.json({
      ok: true,
      db: store.usingMongo ? 'mongodb' : 'in-memory',
      ai: process.env.GEMINI_API_KEY ? 'gemini' : 'heuristic-fallback',
    })
  );

  server.listen(PORT, () => {
    console.log(`Raasta Kashmir server listening on http://localhost:${PORT}`);
    console.log(`  DB: ${store.usingMongo ? 'MongoDB' : 'in-memory fallback'}`);
    console.log(`  AI: ${process.env.GEMINI_API_KEY ? 'Gemini' : 'heuristic fallback (set GEMINI_API_KEY)'}`);
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
