import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvnlklasaxjpqwwfwjog.supabase.co';
const supabaseAnonKey = 'sb_publishable_bULwPZWlnVu7ojY30wGgBg_aQiS2AHk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
