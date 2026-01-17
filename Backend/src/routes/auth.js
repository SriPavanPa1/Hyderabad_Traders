import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

export async function register(request, env, supabase) {
  const { name, email, password, mobile, age,  } = await request.json();
  
  if (!name || !email || !password) {
    return errorResponse('Name, email, and password are required');
  }

  const hashedPassword = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword, mobile, age }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return errorResponse('Email already exists', 409);
    }
    return errorResponse(error.message);
  }

  // Assign default 'student' role
  await supabase
    .from('user_roles')
    .insert([{ user_id: data.id, role_id: 2 }]); // Assuming role_id 2 is 'student'

  const token = generateToken(data, env.JWT_SECRET);
  
  return successResponse({ user: { id: data.id, name, email }, token }, 'Registration successful');
}

export async function login(request, env, supabase) {
  const { email, password } = await request.json();
  
  if (!email || !password) {
    return errorResponse('Email and password are required');
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return errorResponse('Invalid credentials', 401);
  }

  const isValid = await comparePassword(password, user.password);
  
  if (!isValid) {
    return errorResponse('Invalid credentials', 401);
  }

  const token = generateToken(user, env.JWT_SECRET);
  
  return successResponse({ 
    user: { id: user.id, name: user.name, email: user.email },
    token 
  }, 'Login successful');
}
