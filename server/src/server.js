// Must be the first import: ES module imports are evaluated in order, and
// app.js reads process.env when it configures CORS, so the .env file has to be
// loaded before app.js is imported below.
import 'dotenv/config';

import app from './app.js';

const PORT = process.env.PORT || 5000;

// TODO (Kushagra, Phase 0): once src/config/db.js exists, connect before we
// start listening so the server never accepts traffic without a database:
//   import { connectDB } from './config/db.js';
//   await connectDB();

app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log(`[server] listening on http://localhost:${PORT} (${env})`);
});
