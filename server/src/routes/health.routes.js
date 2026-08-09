import { Router } from 'express';

import { sendResponse } from '../utils/apiResponse.js';

const router = Router();

// Deployment health check (Render pings /api/v1/health). Deliberately touches
// nothing external so it still answers 200 when MongoDB is unreachable.
router.get('/', (req, res) =>
  sendResponse(res, {
    data: { status: 'ok', uptime: process.uptime() },
  })
);

export default router;
