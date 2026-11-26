import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) || 'https://qsxpiokosanwfkyoeozi.supabase.co';
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_hQNhvzAsry2ae2COIcrA5w_0M0LWdpL';

// Browser client uses ONLY the public anon/publishable key; RLS protects private data.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
