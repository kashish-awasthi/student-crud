# Student Records

A full-stack CRUD app built with **Next.js**, **React**, **TypeScript** and **PostgreSQL**. You can add, list, edit and delete student records from one page, and every change goes through a REST API backed by a PostgreSQL database.

## Stack

| Layer | Technology |
|---|---|
| Front end | Next.js 15 (App Router), React 19, TypeScript |
| API | Next.js API routes (`app/api/students/route.ts`) |
| Database | PostgreSQL, through the `pg` connection pool (`lib/db.ts`) |

## API

All requests go to `/api/students` and use JSON.

| Method | What it does | Body | Success |
|---|---|---|---|
| `GET` | List all students, ordered by id | none | `200` |
| `POST` | Add a student | `{ "name", "email" }` | `201` with the new row |
| `PUT` | Update a student | `{ "id", "name", "email" }` | `200` with the updated row |
| `DELETE` | Delete a student | `{ "id" }` | `200` |

Errors return `{ "error": "..." }` with a clear status code:

- `400` when input is missing or invalid (for example, an id that is not a positive whole number)
- `404` when no student has that id
- `500` when the database call fails

Every query uses parameters (`$1`, `$2`) rather than building SQL from strings, so user input cannot change the query.

## Run it locally

1. Create the database table in PostgreSQL:

   ```sql
   CREATE TABLE students (
     id SERIAL PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT NOT NULL
   );
   ```

2. Copy the example settings and fill in your database details:

   ```bash
   cp .env.example .env.local
   ```

3. Install and start:

   ```bash
   npm install
   npm run dev
   ```

4. Open http://localhost:3000.
