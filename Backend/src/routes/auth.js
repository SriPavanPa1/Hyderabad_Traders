import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { errorResponse, successResponse } from '../utils/response.js';

export async function register(request, env, supabase) {
  try {
    const { name, email, password, mobile, age } = await request.json();
    
    if (!name || !email || !password) {
      return errorResponse('Name, email, and password are required');
    }

    const hashedPassword = await hashPassword(password);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        name, 
        email, 
        mobile, 
        age, 
        password_hash: hashedPassword, 
        is_active: true 
      }])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      if (error.code === '23505') {
        return errorResponse('Email already exists', 409);
      }
      return errorResponse(error.message);
    }

    // Assign default 'student' role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([{ user_id: data.id, role_id: 2 }]); // Assuming role_id 2 is 'student'

    if (roleError) {
      console.error('Role assignment error:', roleError);
      // Continue even if role assignment fails
    }

    // Check if JWT_SECRET is configured
    if (!env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return errorResponse('Server configuration error: JWT_SECRET not set', 500);
    }

    const token = await generateToken(data, env.JWT_SECRET);
    
    return successResponse({ 
      user: { 
        id: data.id, 
        name: data.name, 
        email: data.email,
        mobile: data.mobile,
        age: data.age,
        is_active: data.is_active
      }, 
      token 
    }, 'Registration successful');
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(`Registration failed: ${error.message}`, 500);
  }
}

export async function login(request, env, supabase) {
  try {
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

    // Check if user is active
    if (!user.is_active) {
      return errorResponse('Account is inactive. Please contact support.', 403);
    }

    const isValid = await comparePassword(password, user.password_hash);
    
    if (!isValid) {
      return errorResponse('Invalid credentials', 401);
    }

    // Check if JWT_SECRET is configured
    if (!env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return errorResponse('Server configuration error: JWT_SECRET not set', 500);
    }

    const token = await generateToken(user, env.JWT_SECRET);
    
    return successResponse({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        mobile: user.mobile,
        age: user.age,
        is_active: user.is_active
      },
      token 
    }, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    return errorResponse(`Login failed: ${error.message}`, 500);
  }
}
