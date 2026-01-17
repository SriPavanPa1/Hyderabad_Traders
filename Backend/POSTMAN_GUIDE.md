# Postman Collection Guide

## Import Instructions

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `postman_collection.json` from the Backend folder
5. Click **Import**

## Configuration

### Set Base URL

The collection uses a variable `{{baseUrl}}` which defaults to `http://localhost:8787`

**To change it:**
1. Click on the collection name
2. Go to **Variables** tab
3. Update `baseUrl` value:
   - Local: `http://localhost:8787`
   - Production: `https://your-worker.workers.dev`

### Auto-Save Variables

The collection automatically saves these variables after successful requests:
- `token` - JWT token (saved after login/register)
- `userId` - User ID (saved after login/register)
- `courseId` - Course ID (saved after creating/getting course)
- `blogId` - Blog ID (saved after creating/getting blog)
- `paymentId` - Payment ID (saved after creating payment)

## Quick Start Workflow

### 1. Register & Login

**Option A: Register as Student**
```
Authentication → Register User
```
This automatically saves your token and userId.

**Option B: Register as Admin**
```
Authentication → Register Admin
Then manually assign admin role using database or:
Roles → Assign Role to User (with role_id: 1)
```

### 2. Test Public Endpoints (No Auth Required)

```
Courses → Get All Courses (Public)
Courses → Search Courses
Blogs → Get All Blogs (Public)
Blogs → Search Blogs
```

### 3. Test Protected Endpoints (Auth Required)

Make sure you're logged in (token is saved). Then try:

```
Users → Get All Users (Admin only)
Courses → Create Course (Admin only)
Courses → Purchase Course
Payments → Create Payment
Blogs → Create Blog (Admin only)
```

## Request Organization

### Authentication (Public)
- Register User
- Login User
- Register Admin

### Users (Protected)
- Get All Users (Admin)
- Get User By ID
- Update User
- Delete User (Admin)

### Roles (Protected)
- Get All Roles
- Assign Role to User (Admin)
- Remove Role from User (Admin)

### Courses
- Get All Courses (Public) - with pagination
- Search Courses (Public) - with search query
- Get Course By ID (Public)
- Create Course (Admin)
- Update Course (Admin)
- Delete Course (Admin)
- Purchase Course (Authenticated)
- Get User Courses (Authenticated)

### Payments (Protected)
- Create Payment
- Get User Payments
- Get User Payments (Filtered) - filter by status
- Update Payment Status

### Blogs
- Get All Blogs (Public) - with pagination
- Search Blogs (Public) - with search query
- Get Blog By ID (Public)
- Create Blog (Admin)
- Update Blog (Admin)
- Delete Blog (Admin)

## Testing Tips

### 1. Test Flow for Students

```
1. Register User
2. Login User (token auto-saved)
3. Get All Courses
4. Purchase Course
5. Get User Courses
6. Create Payment
7. Get User Payments
```

### 2. Test Flow for Admins

```
1. Register Admin
2. Login User (token auto-saved)
3. Assign admin role (role_id: 1)
4. Create Course
5. Create Blog
6. Get All Users
7. Update Course
8. Delete Blog
```

### 3. Pagination & Search

All list endpoints support:
- `?page=1` - Page number (default: 1)
- `?limit=10` - Items per page (default: 10)
- `?search=keyword` - Search in title/description/content

Example:
```
GET /api/courses?page=2&limit=5&search=javascript
GET /api/blogs?search=tutorial&page=1&limit=20
```

### 4. Payment Status Filtering

```
GET /api/users/{userId}/payments?status=completed
GET /api/users/{userId}/payments?status=pending
GET /api/users/{userId}/payments?status=failed
```

## Common Issues

### 401 Unauthorized
- Make sure you're logged in
- Check if token is saved in collection variables
- Token expires after 7 days - login again

### 403 Forbidden
- Endpoint requires admin role
- Assign admin role (role_id: 1) to your user

### 404 Not Found
- Check if the ID exists in database
- Verify the variable (userId, courseId, etc.) is set

### 409 Conflict
- Email already exists (register)
- Course already purchased
- Role already assigned

## Environment Setup

### Local Development
```
baseUrl: http://localhost:8787
```

Run: `npm run dev` in Backend folder

### Production
```
baseUrl: https://your-worker.workers.dev
```

Deploy: `npm run deploy` in Backend folder

## Database Setup Required

Before testing, run the SQL schema in your Supabase SQL editor (see README.md).

The schema creates:
- users table
- roles table (with 'admin' and 'student' roles)
- user_roles table
- courses table
- user_courses table
- payments table
- blogs table

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "error": "Error message"
}
```

**Paginated:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "courses": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

## Support

For issues or questions:
1. Check the README.md for API documentation
2. Verify database schema is set up correctly
3. Check Cloudflare Workers logs for errors
4. Ensure environment variables are configured in wrangler.toml
