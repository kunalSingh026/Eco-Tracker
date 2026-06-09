// backend/src/index.ts
import { Elysia } from 'elysia';
import cors from '@elysiajs/cors';
import { footprintRoutes } from './controllers/footprintController';
import { insightsRoutes } from './controllers/insightsController'; // 1. Import

const app = new Elysia()
  .use(cors({ origin: 'http://localhost:5173' }))
  .get('/', () => ({ status: 'online' }))
  .use(footprintRoutes)
  .use(insightsRoutes) // 2. Mount
  .listen(process.env.PORT || 3000);

console.log(`🚀 API Server running smoothly at http://${app.server?.hostname}:${app.server?.port}`);