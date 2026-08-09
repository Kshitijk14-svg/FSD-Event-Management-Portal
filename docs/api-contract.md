# EventHub API Contract

**Status: frozen at end of Phase 0.** Any change to this file must be announced
in the group chat the same day and land in the same PR as the code change.

Owner: Kshitij. Consumers: Kunal (client), Kushagra (schemas + tests).

**Base URL:** `/api/v1`

---

## Response envelope

Every successful response:

```json
{
  "success": true,
  "data": {},
  "message": "OK",
  "meta": { "page": 1, "limit": 12, "total": 40, "totalPages": 4 }
}
```

`meta` is `null` on everything except list endpoints.

Every failed response, with the proper HTTP status:

```json
{
  "success": false,
  "message": "Event not found",
  "errors": []
}
```

`errors` is a field-wise array on validation failures:
`[{ "field": "email", "message": "Invalid email" }]`. It is `[]` for
everything else. In development the body also carries a `stack` key; in
production it never does.

## Status codes in use

| Code | Meaning here |
|------|--------------|
| 200 | OK |
| 201 | Created (register, create event, register for event) |
| 400 | Malformed request — bad ObjectId, event not published, event already started |
| 401 | Missing/invalid token, or bad login credentials |
| 403 | Authenticated but wrong role, or not the owner of the resource |
| 404 | Resource or route not found |
| 409 | Conflict — duplicate email, already registered, event full, already checked in |
| 422 | Validation failed (Zod or Mongoose) |
| 429 | Rate limit exceeded |
| 500 | Unhandled server error |

## Auth

Protected endpoints expect `Authorization: Bearer <token>`. The token is a JWT
carrying `{ userId, role }`. Roles: `attendee`, `organizer`, `admin`.

---

## Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/health` | — | Liveness check → `{ status, uptime }` |
| POST | `/auth/register` | — | Create account |
| POST | `/auth/login` | — | Get JWT |
| GET | `/auth/me` | any | Current user |
| GET | `/events` | — | List published events (`?q=&category=&city=&from=&to=&page=&limit=`) |
| GET | `/events/mine` | organizer | My created events |
| GET | `/events/:id` | — | Event detail |
| POST | `/events` | organizer | Create event (status `pending`) |
| PATCH | `/events/:id` | owner | Update event |
| DELETE | `/events/:id` | owner/admin | Soft delete |
| GET | `/events/:id/attendees` | owner/admin | Attendee list, paginated |
| GET | `/events/:id/attendees/export` | owner/admin | CSV download |
| POST | `/events/:id/register` | attendee | Register, returns `ticketCode` |
| GET | `/registrations/me` | any | My tickets |
| PATCH | `/registrations/:id/cancel` | owner | Cancel registration |
| POST | `/registrations/check-in` | organizer | Body `{ ticketCode }` → mark attended |
| GET | `/admin/events?status=pending` | admin | Moderation queue |
| PATCH | `/admin/events/:id/status` | admin | approve / reject |
| GET | `/admin/users?role=&q=` | admin | User list |
| PATCH | `/admin/users/:id/role` | admin | Change a user's role |
| GET | `/admin/stats` | admin | Counts for dashboard |

**Route order note:** `/events/mine` must be declared before `/events/:id`,
otherwise Express matches `mine` as an `:id` and returns a CastError 400.

---

## Implemented so far (Phase 0)

### `GET /health`

No auth. Response `200`:

```json
{
  "success": true,
  "data": { "status": "ok", "uptime": 12.34 },
  "message": "OK",
  "meta": null
}
```

Used as Render's health check path. It touches no external service, so it
answers 200 even when MongoDB is unreachable.

### Unmatched routes

Any path under `/api/v1` with no handler returns `404`:

```json
{
  "success": false,
  "message": "Route /api/v1/nope not found",
  "errors": []
}
```

---

## Not yet implemented

Everything else in the table above is a Phase 1–4 commitment. Request bodies,
success payloads, and per-endpoint error cases get filled in here as each phase
lands, and the final version is regenerated from the actual route and validator
files in Phase 5.
