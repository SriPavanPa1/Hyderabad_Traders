# Supabase Row Level Security (RLS) Setup

## The Problem

You're getting this error:
```
"new row violates row-level security policy for table \"users\""
```

This happens because Supabase has Row Level Security (RLS) enabled on your tables, but no policies are defined to allow operations.

## Solution Options

### Option 1: Disable RLS (Quick Fix - Development Only)

**⚠️ WARNING: Only use this for development/testing. NOT recommended for production!**

Run this in your Supabase SQL Editor:

```sql
-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
```

### Option 2: Create RLS Policies (Recommended for Production)

Run this in your Supabase SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Allow anyone to insert (for registration)
CREATE POLICY "Allow public registration" ON users
  FOR INSERT
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to do everything (for your API)
CREATE POLICY "Service role has full access to users" ON users
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- ROLES TABLE POLICIES
-- ============================================

-- Allow anyone to read roles
CREATE POLICY "Anyone can read roles" ON roles
  FOR SELECT
  USING (true);

-- Service role full access
CREATE POLICY "Service role has full access to roles" ON roles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- USER_ROLES TABLE POLICIES
-- ============================================

-- Allow users to read their own roles
CREATE POLICY "Users can read own roles" ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow insert for registration (default student role)
CREATE POLICY "Allow role assignment on registration" ON user_roles
  FOR INSERT
  WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role has full access to user_roles" ON user_roles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- COURSES TABLE POLICIES
-- ============================================

-- Allow anyone to read courses
CREATE POLICY "Anyone can read courses" ON courses
  FOR SELECT
  USING (true);

-- Service role full access (for admin operations via API)
CREATE POLICY "Service role has full access to courses" ON courses
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- USER_COURSES TABLE POLICIES
-- ============================================

-- Allow users to read their own purchased courses
CREATE POLICY "Users can read own courses" ON user_courses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role full access
CREATE POLICY "Service role has full access to user_courses" ON user_courses
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- PAYMENTS TABLE POLICIES
-- ============================================

-- Allow users to read their own payments
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role full access
CREATE POLICY "Service role has full access to payments" ON payments
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- ============================================
-- BLOGS TABLE POLICIES
-- ============================================

-- Allow anyone to read blogs
CREATE POLICY "Anyone can read blogs" ON blogs
  FOR SELECT
  USING (true);

-- Service role full access (for admin operations via API)
CREATE POLICY "Service role has full access to blogs" ON blogs
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

## Important Notes

### Using Service Role Key

Since your Cloudflare Worker acts as a backend API (not using Supabase Auth directly), you should use the **Service Role Key** instead of the Anon Key.

**Update your `wrangler.toml`:**

```toml
[vars]
SUPABASE_URL = "https://your-project.supabase.co"
# Use SERVICE_ROLE key instead of ANON key
SUPABASE_ANON_KEY = "your-service-role-key-here"
```

**Where to find Service Role Key:**
1. Go to Supabase Dashboard
2. Project Settings → API
3. Copy the `service_role` key (NOT the `anon` key)

⚠️ **IMPORTANT:** The service role key bypasses RLS and should be kept secret. Never expose it in client-side code!

### Alternative: Use Anon Key with Proper Policies

If you want to use the anon key (more secure), you'll need to modify the Supabase client initialization to use JWT tokens properly. This is more complex but more secure.

## Quick Fix for Development

For immediate testing, use **Option 1** (Disable RLS) and switch to **Option 2** (RLS Policies with Service Role Key) before going to production.

## Verification

After applying the fix, test your registration endpoint:

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "mobile": "1234567890",
    "age": 25
  }'
```

You should get a successful response with a user object and token.

## Recommended Approach

1. **For Development:** Disable RLS (Option 1)
2. **For Production:** 
   - Use Service Role Key in `wrangler.toml`
   - Enable RLS with policies (Option 2)
   - Keep service role key in Cloudflare Workers secrets

```bash
# Set service role key as secret
wrangler secret put SUPABASE_SERVICE_KEY
```

Then update your code to use it:

```javascript
// src/config/supabase.js
export function getSupabaseClient(env) {
  return createClient(
    env.SUPABASE_URL, 
    env.SUPABASE_SERVICE_KEY || env.SUPABASE_ANON_KEY
  );
}
```
