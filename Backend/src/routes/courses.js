import { errorResponse, successResponse } from '../utils/response.js';
//import { requireAdmin } from '../middleware/auth.js';

export async function getAllCourses(request, env, supabase) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';
  
  let query = supabase
    .from('courses')
    .select('*, users!created_by(name)', { count: 'exact' });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('id', { ascending: false });

  if (error) return errorResponse(error.message);
  
  return successResponse({
    courses: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  });
}

export async function getCourseById(request, env, supabase, courseId) {
  const { data, error } = await supabase
    .from('courses')
    .select('*, users!created_by(name)')
    .eq('id', courseId)
    .single();

  if (error) return errorResponse('Course not found', 404);
  return successResponse(data);
}

export async function createCourse(request, env, supabase, user) {
  // const adminError = requireAdmin(user);
// if (adminError) return adminError;

  const { title, description, price } = await request.json();

  const { data, error } = await supabase
    .from('courses')
    .insert([{ title, description, price, created_by: user.userId }])
    .select()
    .single();

  if (error) return errorResponse(error.message);
  return successResponse(data, 'Course created');
}

export async function updateCourse(request, env, supabase, user, courseId) {
  // const adminError = requireAdmin(user);
// if (adminError) return adminError;

  const updates = await request.json();

  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', courseId)
    .select()
    .single();

  if (error) return errorResponse(error.message);
  return successResponse(data, 'Course updated');
}

export async function deleteCourse(request, env, supabase, user, courseId) {
  // const adminError = requireAdmin(user);
// if (adminError) return adminError;

  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) return errorResponse(error.message);
  return successResponse(null, 'Course deleted');
}

export async function purchaseCourse(request, env, supabase, user) {
  const { course_id } = await request.json();

  // Check if already purchased
  const { data: existing } = await supabase
    .from('user_courses')
    .select('*')
    .eq('user_id', user.userId)
    .eq('course_id', course_id)
    .single();

  if (existing) {
    return errorResponse('Course already purchased', 409);
  }

  const { data, error } = await supabase
    .from('user_courses')
    .insert([{ user_id: user.userId, course_id, purchase_date: new Date().toISOString() }])
    .select();

  if (error) return errorResponse(error.message);
  return successResponse(data, 'Course purchased');
}

export async function getUserCourses(request, env, supabase, user, userId) {
  const { data, error } = await supabase
    .from('user_courses')
    .select('*, courses(*)')
    .eq('user_id', userId);

  if (error) return errorResponse(error.message);
  return successResponse(data);
}
