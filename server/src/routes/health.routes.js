import { Router } from 'express';

import { sendResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/', (req, res) =>
  sendResponse(res, { data: { status: 'ok', uptime: process.uptime() } })
);

export default router;
