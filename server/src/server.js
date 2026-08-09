// Must load before app.js, which reads process.env when it is imported.
import 'dotenv/config';

import app from './app.js';

const PORT = process.env.PORT || 5000;

// TODO (Kushagra): await connectDB() from ./config/db.js here once it exists.

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
