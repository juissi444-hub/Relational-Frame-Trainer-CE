// Backend Configuration for Relational Frame Trainer
// This file contains your Supabase credentials and should be kept secure

const SUPABASE_CONFIG = {
    // Your Supabase project URL
    url: 'https://hpqfgumdvftrwjzuoggx.supabase.co',
    
    // Your Supabase anonymous key (public key)
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcWZndW1kdmZ0cndqenVvZ2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNjE5OTQsImV4cCI6MjA3NzYzNzk5NH0.U8TLeF5D263-8rJ3dEgiukA84jWr8nwzznFKNLJB3zg'
};

// Database Schema Information
// You need to create the following table in your Supabase database:
/*

CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    score JSONB DEFAULT '{"correct": 0, "incorrect": 0, "missed": 0}'::jsonb,
    history JSONB DEFAULT '[]'::jsonb,
    stats_history JSONB DEFAULT '[]'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    recent_answers JSONB DEFAULT '[]'::jsonb,
    last_sync TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress" ON user_progress
    FOR DELETE USING (auth.uid() = user_id);

*/

// IMPORTANT SECURITY NOTES:
// 1. The anonKey is safe to expose in client-side code as it's meant for public access
// 2. Row Level Security (RLS) policies protect user data
// 3. Never expose your service_role key in client-side code
// 4. Consider using environment variables for production deployments
// 5. Review Supabase authentication settings to disable email confirmation if needed
