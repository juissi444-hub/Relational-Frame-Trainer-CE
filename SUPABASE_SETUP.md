# Supabase Setup Guide

This guide explains how to set up your Supabase database for the Relational Frame Trainer application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A Supabase project created

## Step-by-Step Setup

### 1. Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**

### 2. Create the Database Table

1. Open the `SUPABASE_SETUP.sql` file in this repository
2. Copy all the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)

This will create:
- The `user_progress` table to store user data
- Necessary indexes for performance
- Row Level Security (RLS) policies to protect user data
- Automatic timestamp updates

### 3. Verify the Table Was Created

1. Go to **Table Editor** in the left sidebar
2. You should see a `user_progress` table listed
3. Click on it to view its structure

### 4. Configure Authentication

Make sure you have authentication enabled in your Supabase project:

1. Go to **Authentication** in the left sidebar
2. Go to **Providers** tab
3. Enable at least one provider:
   - **Email** (recommended for testing)
   - **Google** (see `GOOGLE_AUTH_SETUP.md`)
   - **Discord** (see `DISCORD_AUTH_SETUP.md`)

### 5. Check Your Environment Variables

Make sure your `.env` file (or environment variables) contains the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase project settings:
1. Go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key

## Database Schema

### user_progress Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| user_id | UUID | Reference to auth.users (unique) |
| score | JSONB | User's score: `{correct, incorrect, missed}` |
| history | JSONB | Array of completed trials |
| stats_history | JSONB | Array of statistics |
| current_trial | JSONB | Current trial data (if paused) |
| time_left | INTEGER | Time remaining on current trial |
| feedback | TEXT | Current feedback message |
| is_paused | BOOLEAN | Whether game is paused |
| settings | JSONB | User settings and preferences |
| created_at | TIMESTAMP | When record was created |
| updated_at | TIMESTAMP | When record was last updated |

### Row Level Security (RLS)

The table has RLS enabled with policies that ensure:
- Users can only see their own data
- Users can only modify their own data
- No user can access another user's progress

## Testing

After setup, test that data is being saved:

1. Open your application
2. Create an account or log in
3. Play a few questions
4. Go back to Supabase → **Table Editor** → **user_progress**
5. You should see a row with your user data

## Troubleshooting

### Data not saving?

1. **Check RLS policies**: Go to Table Editor → user_progress → Click the shield icon to verify policies are enabled
2. **Check authentication**: Make sure you're logged in with a valid user account
3. **Check browser console**: Open Developer Tools (F12) and look for error messages
4. **Check Supabase logs**: Go to Logs → API Logs to see any errors

### "Insert failed" errors?

- Make sure RLS policies are correctly set up
- Verify the user is authenticated (check `auth.uid()`)
- Check that the table structure matches the schema

### Reset button not working?

- Verify the upsert operation is allowed by RLS policies
- Check that the user_id column has a unique constraint
- Look for errors in the browser console

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
