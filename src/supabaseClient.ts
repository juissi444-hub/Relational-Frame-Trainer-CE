import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpqfgumdvftrwjzuoggx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcWZndW1kdmZ0cndqenVvZ2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNjE5OTQsImV4cCI6MjA3NzYzNzk5NH0.U8TLeF5D263-8rJ3dEgiukA84jWr8nwzznFKNLJB3zg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
