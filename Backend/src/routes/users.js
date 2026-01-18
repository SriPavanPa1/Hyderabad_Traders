import { hashPassword } from '../utils/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

export async function getAllUsers(request, env, supabase, user) {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  const { data, error } = await supabase
    .from('users')
    .select(`
      id, name, email, mobile, age, is_active, created_at, updated_at,
      user_roles(role_id, roles(role_name))
    `);

  if (error) return errorResponse(error.message);
  return successResponse(data);
}

export async function getUserById(request, env, supabase, user, userId) {
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, name, email, mobile, age, is_active, created_at, updated_at,
      user_roles(role_id, roles(role_name))
    `)
    .eq('id', userId)
    .single();

  if (error) return errorResponse('User not found', 404);
  return successResponse(data);
}

export async function updateUser(request, env, supabase, user, userId) {
  const updates = await request.json();
  
  // Hash password if provided
  if (updates.password) {
    updates.password_hash = await hashPassword(updates.password);
    delete updates.password;
  }

  // Don't allow updating these fields directly
  delete updates.id;
  delete updates.created_at;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) return errorResponse(error.message);
  
  // Remove password_hash from response
  delete data.password_hash;
  
  return successResponse(data, 'User updated');
}

export async function deleteUser(request, env, supabase, user, userId) {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) return errorResponse(error.message);
  return successResponse(null, 'User deleted');
}

export async function assignRole(request, env, supabase, user) {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  const { user_id, role_id } = await request.json();

  const { data, error } = await supabase
    .from('user_roles')
    .insert([{ user_id, role_id }])
    .select();

  if (error) {
    if (error.code === '23505') {
      return errorResponse('Role already assigned', 409);
    }
    return errorResponse(error.message);
  }

  return successResponse(data, 'Role assigned');
}

export async function removeRole(request, env, supabase, user) {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  const { user_id, role_id } = await request.json();

  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', user_id)
    .eq('role_id', role_id);

  if (error) return errorResponse(error.message);
  return successResponse(null, 'Role removed');
}

export async function getAllRoles(request, env, supabase, user) {
  const { data, error } = await supabase
    .from('roles')
    .select('*');

  if (error) return errorResponse(error.message);
  return successResponse(data);
}
