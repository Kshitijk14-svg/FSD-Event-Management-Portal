import { Router } from 'express';

import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);

// Phase 1+ routers mount here: /auth, /events, /registrations, /admin

export default router;
