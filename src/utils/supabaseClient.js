import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mvnlklasaxjpqwwfwjog.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bULwPZWlnVu7ojY30wGgBg_aQiS2AHk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
