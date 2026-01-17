import { errorResponse, successResponse } from '../utils/response.js';

export async function createPayment(request, env, supabase, user) {
  const { course_id, amount } = await request.json();

  const { data, error } = await supabase
    .from('payments')
    .insert([{
      user_id: user.userId,
      course_id,
      amount,
      status: 'pending',
      payment_date: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) return errorResponse(error.message);
  return successResponse(data, 'Payment initiated');
}

export async function getUserPayments(request, env, supabase, user, userId) {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  let query = supabase
    .from('payments')
    .select('*, courses(title)')
    .eq('user_id', userId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('payment_date', { ascending: false });

  if (error) return errorResponse(error.message);
  return successResponse(data);
}

export async function updatePaymentStatus(request, env, supabase, user, paymentId) {
  const { status } = await request.json();

  if (!['pending', 'completed', 'failed'].includes(status)) {
    return errorResponse('Invalid status');
  }

  const { data, error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', paymentId)
    .select()
    .single();

  if (error) return errorResponse(error.message);
  return successResponse(data, 'Payment status updated');
}
