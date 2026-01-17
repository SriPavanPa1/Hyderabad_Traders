import { errorResponse, successResponse } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

export async function getAllBlogs(request, env, supabase) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';

  let query = supabase
    .from('blogs')
    .select('*, users!author_id(name)', { count: 'exact' });

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1)
    .order('published_date', { ascending: false });

  if (error) return errorResponse(error.message);

  return successResponse({
    blogs: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  });
}

export async function getBlogById(request, env, supabase, blogId) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*, users!author_id(name)')
    .eq('id', blogId)
    .single();

  if (error) return errorResponse('Blog not found', 404);
  return successResponse(data);
}

export async function createBlog(request, env, supabase, user) {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  const { title, content } = await request.json();

  const { data, error } = await supabase
    .from('blogs')
    .insert([{
      title,
      content,
      author_id: user.userId,
      published_date: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) return errorResponse(error.message);
  return successResponse(data, 'Blog created');
}

export async function updateBlog(request, env, supabase, user, blogId) {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  const updates = await request.json();

  const { data, error } = await supabase
    .from('blogs')
    .update(updates)
    .eq('id', blogId)
    .select()
    .single();

  if (error) return errorResponse(error.message);
  return successResponse(data, 'Blog updated');
}

export async function deleteBlog(request, env, supabase, user, blogId) {
  const adminError = requireAdmin(user);
  if (adminError) return adminError;

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', blogId);

  if (error) return errorResponse(error.message);
  return successResponse(null, 'Blog deleted');
}
