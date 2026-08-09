// Must load before app.js, which reads process.env when it is imported.
import 'dotenv/config';

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

