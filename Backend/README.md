# Cloudflare Workers + Supabase Backend

Node.js REST API for managing PostgreSQL database via Supabase, deployable to Cloudflare Workers.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `wrangler.toml`:
```toml
[vars]
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_ANON_KEY = "your-anon-key"
```

3. Set JWT secret:
```bash
wrangler secret put JWT_SECRET
```

4. Run locally:
```bash
npm run dev
```

5. Deploy to Cloudflare:
```bash
npm run deploy
```

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Protected)
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `POST /api/users/roles/assign` - Assign role (admin only)
- `POST /api/users/roles/remove` - Remove role (admin only)
- `GET /api/roles` - Get all roles

### Courses
- `GET /api/courses` - Get all courses (public, with pagination & search)
- `GET /api/courses/:id` - Get course by ID (public)
- `POST /api/courses` - Create course (admin only)
- `PUT /api/courses/:id` - Update course (admin only)
- `DELETE /api/courses/:id` - Delete course (admin only)
- `POST /api/courses/purchase` - Purchase course (authenticated)
- `GET /api/users/:id/courses` - Get user's purchased courses

### Payments (Protected)
- `POST /api/payments` - Create payment
- `GET /api/users/:id/payments?status=completed` - Get user payments (filter by status)
- `PUT /api/payments/:id` - Update payment status

### Blogs
- `GET /api/blogs` - Get all blogs (public, with pagination & search)
- `GET /api/blogs/:id` - Get blog by ID (public)
- `POST /api/blogs` - Create blog (admin only)
- `PUT /api/blogs/:id` - Update blog (admin only)
- `DELETE /api/blogs/:id` - Delete blog (admin only)

## Example Requests

### Register
```bash
curl -X POST https://your-worker.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123","mobile":"1234567890","age":25}'
```

### Login
```bash
curl -X POST https://your-worker.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

### Create Course (Admin)
```bash
curl -X POST https://your-worker.workers.dev/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"JavaScript Basics","description":"Learn JS","price":49.99}'
```

### Purchase Course
```bash
curl -X POST https://your-worker.workers.dev/api/courses/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"course_id":1}'
```

### Get Courses with Search
```bash
curl "https://your-worker.workers.dev/api/courses?page=1&limit=10&search=javascript"
```

## Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Create tables
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile TEXT,
  age INT
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  role_name TEXT UNIQUE NOT NULL
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  created_by UUID REFERENCES users(id)
);

CREATE TABLE user_courses (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id INT REFERENCES courses(id) ON DELETE CASCADE,
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  course_id INT REFERENCES courses(id),
  amount DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')),
  payment_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author_id UUID REFERENCES users(id),
  published_date TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (role_name) VALUES ('admin'), ('student');
```

## Features

✅ JWT authentication with Web Crypto API (Cloudflare Workers compatible)
✅ SHA-256 password hashing using native crypto
✅ Role-based access control (admin/student)
✅ Pagination & search for courses/blogs
✅ Payment status filtering
✅ CORS enabled
✅ Fully Cloudflare Workers compatible (no Node.js dependencies)
✅ ES Modules
✅ Error handling for duplicates & permissions

## Notes

- Uses Web Crypto API instead of bcrypt/jsonwebtoken for Cloudflare Workers compatibility
- All cryptographic operations use native browser/worker APIs
- No external crypto libraries needed - fully serverless compatible
- Dev dependency vulnerabilities (wrangler) don't affect production deployment
