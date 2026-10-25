# Server

Express API for the Event Management Portal.

## Run

```
cd server
npm install
cp .env.example .env   # then fill in values
npm run dev            # nodemon, http://localhost:5000
```

Health check: `GET /api/health` returns `{ "status": "ok" }`.

All errors are returned as `{ "success": false, "message": "..." }`.

## Layout

```
src/
  app.js        # express app + middleware
  server.js     # loads env, connects DB, listens
  config/       # db connection (Kushagra)
  models/       # mongoose schemas (Kushagra)
  routes/ controllers/ middleware/ utils/
```
