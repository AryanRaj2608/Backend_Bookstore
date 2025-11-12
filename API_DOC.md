# 📚 Book Management API Documentation

**Base URL:** `http://localhost:5555`

---

## Authentication
- Some routes require a Bearer token in the `Authorization` header:


---

### GET /books
- **Description:** Fetch all books (supports search, sort, pagination).
- **Query parameters (optional):**
- `q` — search keyword for title or author (string)
- `page` — page number (number, default `1`)
- `limit` — items per page (number, default `10`)
- `sortBy` — field to sort by (e.g. `createdAt`, `title`)
- `sortOrder` — `asc` or `desc` (default `desc`)
- **Response (200):**
```json
{
"success": true,
"books": [ { "_id": "ID", "title": "Atomic Habits", "author": "James Clear", "publicationYear": 2018, "genre": "Self-Help" } ],
"pagination": { "currentPage": 1, "totalPages": 1, "totalBooks": 1 }
}

GET /books/:id
Description: Get a single book by its ID.
URL params: id (MongoDB ObjectId)
Responses:
200 — success, returns { success: true, data: { ...book } }
400 — invalid id
404 — book not found
Example success:
{ "success": true, "data": { "_id": "abc123", "title": "Atomic Habits", "author": "James Clear" } }


POST /books
Description: Create a new book (auth required if your app requires it).
Headers:
Content-Type: application/json
Authorization: Bearer <token> (if requireAuth is used)
Request body (JSON):
{
  "title": "Book Title",
  "author": "Author Name",
  "publicationYear": 2024,
  "genre": "Fiction"
}


PUT /books/:id
Description: Update an existing book by ID (auth required if protected).
URL params: id
Headers: Content-Type: application/json, Authorization: Bearer <token>
Request body: include only fields you want to update (partial update supported)
{
  "title": "Updated Title",
  "publicationYear": 2022
}
Responses:
200 updated book
400 invalid id / validation error
404 book not found
401 unauthorized (if protected)

DELETE /books/:id
Description: Delete a book by ID (auth required if protected).
Headers: Authorization: Bearer <token>
Responses:
200 success + deleted document
400 invalid id
404 book not found
401 unauthorized

How to test with Postman
Start your server: node index.js (or npm run start).
Send requests to http://localhost:5555.
For protected routes add Authorization → Bearer Token in Postman (put your token).
Set Content-Type: application/json for body requests.

