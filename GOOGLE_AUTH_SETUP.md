# Google Authentication Setup Guide

This guide explains how to configure Google Sign-In for both local development and production environments.

## Quick Fix Summary

The issue where Google login tries to connect to `localhost:3000` has been fixed by:
1. Using environment variables for the redirect URL
2. Proper configuration for production deployment

## Configuration Steps

### 1. Netlify Environment Variables

Set the following environment variable in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Add a new environment variable:
   - **Key**: `VITE_REDIRECT_URL`
   - **Value**: Your production URL (e.g., `https://your-app.netlify.app`)
4. Deploy your site for the changes to take effect

### 2. Supabase Configuration

Add your production URL as an authorized redirect URL in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add your production URL:
   - `https://your-app.netlify.app`
5. Save changes

### 3. Local Development

For local development, create a `.env.local` file in the project root:

```env
VITE_REDIRECT_URL=http://localhost:5173
```

Also add `http://localhost:5173` to your Supabase Redirect URLs (in addition to your production URL).

## How It Works

The code now uses `import.meta.env.VITE_REDIRECT_URL` which:
- In production: Uses the URL you set in Netlify environment variables
- In development: Uses the URL from your `.env.local` file
- Fallback: Uses `window.location.origin` if no environment variable is set

## Troubleshooting

If Google login still doesn't work:

1. **Check Netlify environment variables**: Make sure `VITE_REDIRECT_URL` is set correctly
2. **Verify Supabase redirect URLs**: Ensure your production URL is in the allowed list
3. **Redeploy**: After changing environment variables, trigger a new deployment
4. **Clear browser cache**: Sometimes cached OAuth redirects can cause issues

## File Changes

- `src/AuthModal.tsx`: Updated to use environment variable for redirect URL
- `.env.example`: Template for environment variables
- `netlify.toml`: Added comments about environment variable configuration
