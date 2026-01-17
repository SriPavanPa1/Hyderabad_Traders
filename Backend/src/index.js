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
      return errorResponse('Internal server error', 500);
    }
  },
};
