# EventHub — Project Context for Claude Code

## What this is
A minimal Event Management Portal built for a college full-stack lab.
MERN stack. Three developers. Prioritize clarity and correctness over
cleverness — every line must be explainable in a viva.

## Team ownership — DO NOT EDIT FILES YOU DON'T OWN
- Kshitij  → server/src/{routes,controllers,middleware,services,validators}, app.js
- Kunal    → client/** (everything)
- Kushagra → server/src/{config,models,seed}, server/tests, server/src/services/stats.aggregations.js
If a task seems to need a change outside the current owner's scope, STOP and
say so instead of making the change.

## Hard rules
- Do not add dependencies beyond the approved stack without asking.
- Do not use TypeScript. This project is JavaScript with ES modules.
- Do not introduce Redux, Next.js, Docker, GraphQL, or microservices.
- Do not scaffold features that were not requested.
- Do not write to .env — only .env.example.
- API responses always use { success, data, message, meta }.
- Business logic goes in services, never in controllers or React components.
- Every async operation needs an error path.

## Approved stack
Node 20, Express 4, Mongoose 8, JWT, bcryptjs, Zod, React 18 + Vite,
React Router 6, Axios, Tailwind, react-hook-form, date-fns, lucide-react,
Jest + Supertest + mongodb-memory-server.

## The contract
docs/api-contract.md is the source of truth for every endpoint. Read it before
writing any code that crosses the client/server boundary. If code and contract
disagree, flag it — do not silently pick one.

## Style
- Named exports, one responsibility per file
- Comment the *why*, not the *what*
- No premature abstraction; duplicate twice before extracting
