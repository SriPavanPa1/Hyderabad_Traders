import { authenticate } from './middleware/auth.js';
import { errorResponse } from './utils/response.js';
import * as authRoutes from './routes/auth.js';
import * as userRoutes from './routes/users.js';
import * as courseRoutes from './routes/courses.js';
import * as paymentRoutes from './routes/payments.js';
import * as blogRoutes from './routes/blogs.js';

export async function handleRequest(request, env, supabase) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Public routes
  if (path === '/api/auth/register' && method === 'POST') {
    return authRoutes.register(request, env, supabase);
  }
  if (path === '/api/auth/login' && method === 'POST') {
    return authRoutes.login(request, env, supabase);
  }

  // Public course/blog listing
  if (path === '/api/courses' && method === 'GET') {
    return courseRoutes.getAllCourses(request, env, supabase);
  }
  if (path.match(/^\/api\/courses\/\d+$/) && method === 'GET') {
    const courseId = path.split('/')[3];
    return courseRoutes.getCourseById(request, env, supabase, courseId);
  }
  if (path === '/api/blogs' && method === 'GET') {
    return blogRoutes.getAllBlogs(request, env, supabase);
  }
  if (path.match(/^\/api\/blogs\/\d+$/) && method === 'GET') {
    const blogId = path.split('/')[3];
    return blogRoutes.getBlogById(request, env, supabase, blogId);
  }

  // Protected routes - require authentication
  const authResult = await authenticate(request, env, supabase);
  if (authResult.error) return authResult.error;
  const user = authResult.user;

  // Users
  if (path === '/api/users' && method === 'GET') {
    return userRoutes.getAllUsers(request, env, supabase, user);
  }
  if (path.match(/^\/api\/users\/[a-f0-9-]+$/) && method === 'GET') {
    const userId = path.split('/')[3];
    return userRoutes.getUserById(request, env, supabase, user, userId);
  }
  if (path.match(/^\/api\/users\/[a-f0-9-]+$/) && method === 'PUT') {
    const userId = path.split('/')[3];
    return userRoutes.updateUser(request, env, supabase, user, userId);
  }
  if (path.match(/^\/api\/users\/[a-f0-9-]+$/) && method === 'DELETE') {
    const userId = path.split('/')[3];
    return userRoutes.deleteUser(request, env, supabase, user, userId);
  }
  if (path === '/api/users/roles/assign' && method === 'POST') {
    return userRoutes.assignRole(request, env, supabase, user);
  }
  if (path === '/api/users/roles/remove' && method === 'POST') {
    return userRoutes.removeRole(request, env, supabase, user);
  }
  if (path === '/api/roles' && method === 'GET') {
    return userRoutes.getAllRoles(request, env, supabase, user);
  }

  // Courses (protected)
  if (path === '/api/courses' && method === 'POST') {
    return courseRoutes.createCourse(request, env, supabase, user);
  }
  if (path.match(/^\/api\/courses\/\d+$/) && method === 'PUT') {
    const courseId = path.split('/')[3];
    return courseRoutes.updateCourse(request, env, supabase, user, courseId);
  }
  if (path.match(/^\/api\/courses\/\d+$/) && method === 'DELETE') {
    const courseId = path.split('/')[3];
    return courseRoutes.deleteCourse(request, env, supabase, user, courseId);
  }
  if (path === '/api/courses/purchase' && method === 'POST') {
    return courseRoutes.purchaseCourse(request, env, supabase, user);
  }
  if (path.match(/^\/api\/users\/[a-f0-9-]+\/courses$/) && method === 'GET') {
    const userId = path.split('/')[3];
    return courseRoutes.getUserCourses(request, env, supabase, user, userId);
  }

  // Payments
  if (path === '/api/payments' && method === 'POST') {
    return paymentRoutes.createPayment(request, env, supabase, user);
  }
  if (path.match(/^\/api\/users\/[a-f0-9-]+\/payments$/) && method === 'GET') {
    const userId = path.split('/')[3];
    return paymentRoutes.getUserPayments(request, env, supabase, user, userId);
  }
  if (path.match(/^\/api\/payments\/\d+$/) && method === 'PUT') {
    const paymentId = path.split('/')[3];
    return paymentRoutes.updatePaymentStatus(request, env, supabase, user, paymentId);
  }

  // Blogs (protected)
  if (path === '/api/blogs' && method === 'POST') {
    return blogRoutes.createBlog(request, env, supabase, user);
  }
  if (path.match(/^\/api\/blogs\/\d+$/) && method === 'PUT') {
    const blogId = path.split('/')[3];
    return blogRoutes.updateBlog(request, env, supabase, user, blogId);
  }
  if (path.match(/^\/api\/blogs\/\d+$/) && method === 'DELETE') {
    const blogId = path.split('/')[3];
    return blogRoutes.deleteBlog(request, env, supabase, user, blogId);
  }

  return errorResponse('Not found', 404);
}
