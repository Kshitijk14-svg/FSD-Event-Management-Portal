# Event Management Portal — Demo Accounts & Credentials

This document provides ready-to-use credentials for localhost testing and the Day 6 project evaluation demo.

> **Universal Password:** `Password@123`  
> All accounts below share the exact same password, which is properly hashed with bcrypt upon creation/seeding.

---

## 1. System Administrator

| Name | Email | Password | Role | Permissions & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@event.com` | `Password@123` | `admin` | Full platform overview, view system stats, promote/demote user roles, delete any user or event. |

---

## 2. Event Organizers

Organizers can create, edit, and delete their own events, view live registered attendee rosters, and view capacity statistics.

| Name | Email | Password | Role | Specialization / Events Managed |
| :--- | :--- | :--- | :--- | :--- |
| **Elena Rostova** | `organizer1@event.com` | `Password@123` | `organizer` | Tech Summits, Developer Hacknights, UI/UX & React Masterclasses |
| **Marcus Vance** | `organizer2@event.com` | `Password@123` | `organizer` | Indie Festivals, Acoustic Sessions, Fintech Conferences, Startup Pitch Nights |
| **Sophia Chen** | `organizer3@event.com` | `Password@123` | `organizer` | Half Marathons, Badminton Tournaments, Gastronomy Expositions, Stargazing |

---

## 3. Attendees (Sample 12 Seed Users)

Attendees can explore public events, search by title/venue/description, filter by category/date, register for open events, cancel existing registrations, and view "My Registrations".

| # | Name | Email | Password | Seeded Registrations |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Alex Johnson** | `attendee1@event.com` | `Password@123` | Registered for: AI Summit, React Masterclass, Cloud Native, etc. |
| 2 | **Priya Sharma** | `attendee2@event.com` | `Password@123` | Registered for: AI Summit, React Masterclass, Hacknight, etc. |
| 3 | **Liam Smith** | `attendee3@event.com` | `Password@123` | Registered for: AI Summit, React Masterclass *(Fills 3rd seat!)*, etc. |
| 4 | **David Kim** | `attendee4@event.com` | `Password@123` | Registered for: AI Summit, Hacknight, Marathon, etc. |
| 5 | **Maya Patel** | `attendee5@event.com` | `Password@123` | Registered for: AI Summit, Cloud Native, C-Suite Roundtable, etc. |
| 6 | **Chloe Taylor** | `attendee6@event.com` | `Password@123` | Registered for: AI Summit, Hacknight, Acoustic Soul, etc. |
| 7 | **Ethan Wright** | `attendee7@event.com` | `Password@123` | Registered for: AI Summit, Cloud Native, Sunset Jazz, etc. |
| 8 | **Zoe Miller** | `attendee8@event.com` | `Password@123` | Registered for: AI Summit, Hacknight, Indie Fest, etc. |
| 9 | **Noah Davis** | `attendee9@event.com` | `Password@123` | Registered for: Cloud Native, Indie Fest, Sunset Jazz, etc. |
| 10 | **Emma Wilson** | `attendee10@event.com` | `Password@123` | Registered for: Hacknight, Acoustic Soul, Gastronomy Expo, etc. |
| 11 | **Lucas Garcia** | `attendee11@event.com` | `Password@123` | Registered for: Indie Fest, Marathon, Gastronomy Expo, etc. |
| 12 | **Olivia Brown** | `attendee12@event.com` | `Password@123` | Registered for: Hacknight, Acoustic Soul, Marathon, etc. |

---

## 4. Key Demo Scenarios for Day 6

1. **Attendee Registration & Discovery**:
   - Log in as `attendee4@event.com`.
   - Browse events, filter by category `Tech`, register for an open workshop.
   - Go to "My Registrations" and cancel it to see real-time seat decrement.
2. **Event Full / Concurrency Protection**:
   - Check the event: **"Advanced React 19 & Next.js Architecture Masterclass"** (`capacity: 3`).
   - Notice it is marked with the **"Full"** badge (`isFull: true`, `seatsLeft: 0`).
   - Attempting to register returns `409 Conflict` (Event full), demonstrating atomic capacity protection.
3. **Organizer Dashboard**:
   - Log in as `organizer1@event.com`.
   - View your 7 events, inspect live attendee rosters, create a new event.
4. **Admin Oversight**:
   - Log in as `admin@event.com`.
   - Review live platform count cards (`users`, `events`, `registrations`), modify user roles, or delete test records.
