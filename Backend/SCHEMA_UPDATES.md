# Database Schema Updates

## Users Table Changes

Updated to match your Supabase database schema:

### Column Changes

| Old Column | New Column | Type | Notes |
|------------|------------|------|-------|
| `password` | `password_hash` | TEXT | More descriptive name |
| - | `is_active` | BOOL | New field for account status (default: true) |
| - | `created_at` | TIMESTAMPTZ | Auto-set on creation |
| - | `updated_at` | TIMESTAMPTZ | Auto-updated on changes |
| `name` | `name` | VARCHAR | Changed from TEXT |
| `email` | `email` | VARCHAR | Changed from TEXT |
| `mobile` | `mobile` | VARCHAR | Changed from TEXT |
| `age` | `age` | INT2 | Changed from INT |

### Code Updates

#### 1. Authentication (`src/routes/auth.js`)
- ✅ Uses `password_hash` instead of `password`
- ✅ Sets `is_active: true` on registration
- ✅ Checks `is_active` status during login
- ✅ Returns user info including `is_active` status
- ✅ Uses `await` for async `generateToken()`

#### 2. User Management (`src/routes/users.js`)
- ✅ Includes `is_active`, `created_at`, `updated_at` in queries
- ✅ Converts `password` to `password_hash` on updates
- ✅ Prevents updating `id` and `created_at` fields
- ✅ Removes `password_hash` from response data

#### 3. Database Schema (`README.md`)
- ✅ Updated SQL schema with correct column types
- ✅ Added trigger to auto-update `updated_at` timestamp
- ✅ Proper constraints and defaults

#### 4. Postman Collection
- ✅ Updated user update request to include `is_active`

## New Features

### Account Status Management
Users can now be activated/deactivated:

```bash
# Deactivate user
curl -X PUT https://your-worker.workers.dev/api/users/{userId} \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"is_active": false}'
```

Inactive users cannot login and will receive:
```json
{
  "error": "Account is inactive. Please contact support."
}
```

### Automatic Timestamps
- `created_at` - Set automatically when user is created
- `updated_at` - Updated automatically on any user update via database trigger

### Password Security
- Column renamed to `password_hash` for clarity
- Password field automatically converted to `password_hash` on updates
- `password_hash` never returned in API responses

## Migration Notes

If you have existing data, run this migration:

```sql
-- If migrating from old schema
ALTER TABLE users RENAME COLUMN password TO password_hash;
ALTER TABLE users ADD COLUMN is_active BOOL DEFAULT true NOT NULL;
ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT now() NOT NULL;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now() NOT NULL;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## API Response Changes

### Before
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### After
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "age": 25,
    "is_active": true
  }
}
```

## Testing

All changes have been validated:
- ✅ No syntax errors
- ✅ Proper async/await usage
- ✅ Correct column names
- ✅ Security: password_hash never exposed
- ✅ Account status checks implemented
- ✅ Timestamps handled automatically
