# API Request/Response Examples

## Important Notes

### Request Body Rules
- ✅ Send `password` (NOT `password_hash`) - the API hashes it for you
- ❌ Don't send `password_hash`, `created_at`, `updated_at` - these are managed by the system
- ❌ Don't send `is_active` on registration - it defaults to `true`

---

## Authentication

### Register User

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "1234567890",
  "age": 25
}
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "1234567890",
      "age": 25,
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**❌ Error Response (400):**
```json
{
  "error": "Name, email, and password are required"
}
```

**❌ Error Response (409):**
```json
{
  "error": "Email already exists"
}
```

---

### Login User

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "1234567890",
      "age": 25,
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**❌ Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

**❌ Error Response (403):**
```json
{
  "error": "Account is inactive. Please contact support."
}
```

---

## Users

### Update User

**Endpoint:** `PUT /api/users/{userId}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "name": "John Updated",
  "mobile": "9999999999",
  "age": 26,
  "password": "newpassword123",
  "is_active": false
}
```

**Note:** 
- Send `password` (not `password_hash`) if changing password
- Only admins or the user themselves can update
- `created_at` and `updated_at` are auto-managed

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "User updated",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Updated",
    "email": "john@example.com",
    "mobile": "9999999999",
    "age": 26,
    "is_active": false,
    "created_at": "2025-01-18T10:30:00Z",
    "updated_at": "2025-01-18T15:45:00Z"
  }
}
```

---

## Courses

### Create Course (Admin Only)

**Endpoint:** `POST /api/courses`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "JavaScript Fundamentals",
  "description": "Learn JavaScript from scratch",
  "price": 49.99
}
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Course created",
  "data": {
    "id": 1,
    "title": "JavaScript Fundamentals",
    "description": "Learn JavaScript from scratch",
    "price": 49.99,
    "created_by": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

### Purchase Course

**Endpoint:** `POST /api/courses/purchase`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "course_id": 1
}
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Course purchased",
  "data": [
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "course_id": 1,
      "purchase_date": "2025-01-18T15:45:00Z"
    }
  ]
}
```

**❌ Error Response (409):**
```json
{
  "error": "Course already purchased"
}
```

---

## Payments

### Create Payment

**Endpoint:** `POST /api/payments`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "course_id": 1,
  "amount": 49.99
}
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Payment initiated",
  "data": {
    "id": 1,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "course_id": 1,
    "amount": 49.99,
    "status": "pending",
    "payment_date": "2025-01-18T15:45:00Z"
  }
}
```

---

### Update Payment Status

**Endpoint:** `PUT /api/payments/{paymentId}`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Valid status values:** `pending`, `completed`, `failed`

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Payment status updated",
  "data": {
    "id": 1,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "course_id": 1,
    "amount": 49.99,
    "status": "completed",
    "payment_date": "2025-01-18T15:45:00Z"
  }
}
```

---

## Blogs

### Create Blog (Admin Only)

**Endpoint:** `POST /api/blogs`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Getting Started with JavaScript",
  "content": "JavaScript is a versatile programming language..."
}
```

**✅ Success Response (200):**
```json
{
  "success": true,
  "message": "Blog created",
  "data": {
    "id": 1,
    "title": "Getting Started with JavaScript",
    "content": "JavaScript is a versatile programming language...",
    "author_id": "550e8400-e29b-41d4-a716-446655440000",
    "published_date": "2025-01-18T15:45:00Z"
  }
}
```

---

## Common Errors

### 400 Bad Request
```json
{
  "error": "Name, email, and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```
**Solution:** Include `Authorization: Bearer YOUR_TOKEN` header

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```
**Solution:** Assign admin role to your user

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

---

## Quick Reference

### Fields You Should Send

**Registration:**
- ✅ `name`, `email`, `password`
- ✅ `mobile`, `age` (optional)
- ❌ NOT `password_hash`, `is_active`, `created_at`, `updated_at`

**Update User:**
- ✅ `name`, `email`, `mobile`, `age`, `is_active`
- ✅ `password` (if changing password)
- ❌ NOT `password_hash`, `id`, `created_at`

**Create Course:**
- ✅ `title`, `description`, `price`

**Create Payment:**
- ✅ `course_id`, `amount`

**Create Blog:**
- ✅ `title`, `content`
