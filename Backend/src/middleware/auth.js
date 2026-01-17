import { verifyToken, getUserRoles } from '../utils/auth.js';
import { errorResponse } from '../utils/response.js';

export async function authenticate(request, env, supabase) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: errorResponse('Unauthorized', 401) };
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token, env.JWT_SECRET);
  
  if (!decoded) {
    return { error: errorResponse('Invalid token', 401) };
  }

  const roles = await getUserRoles(supabase, decoded.userId);
  
  return { user: { ...decoded, roles } };
}

export function requireAdmin(user) {
  if (!user.roles.includes('admin')) {
    return errorResponse('Admin access required', 403);
  }
  return null;
}
