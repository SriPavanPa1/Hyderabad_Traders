import { getSupabaseClient } from './config/supabase.js';
import { handleRequest } from './router.js';
import { errorResponse } from './utils/response.js';

export default {
  async fetch(request, env, ctx) {
    try {
      const supabase = getSupabaseClient(env);
      return await handleRequest(request, env, supabase);
    } catch (error) {
      console.error('Error:', error);
      console.error('Error stack:', error.stack);
      console.error('Error message:', error.message);
      return errorResponse(`Internal server error: ${error.message}`, 500);
    }
  },
};
