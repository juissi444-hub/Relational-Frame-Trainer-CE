# Discord OAuth Setup Guide

This guide explains how to configure Discord Sign-In for your application using Supabase.

## Step 1: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"**
3. Give your application a name (e.g., "Relational Frame Trainer")
4. Click **"Create"**

## Step 2: Configure OAuth2 Settings

1. In your Discord application, go to **OAuth2** in the left sidebar
2. Click **"Add Redirect"** under **Redirects**
3. Add your Supabase callback URL:
   ```
   https://hpqfgumdvftrwjzuoggx.supabase.co/auth/v1/callback
   ```
4. Click **"Save Changes"**

## Step 3: Get Your Discord Credentials

1. Still in the **OAuth2** section, you'll see:
   - **CLIENT ID** - Copy this
   - **CLIENT SECRET** - Click "Reset Secret" if needed, then copy it

## Step 4: Configure Supabase

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/hpqfgumdvftrwjzuoggx/auth/providers
   ```

2. Find **Discord** in the list of providers

3. Enable Discord and enter:
   - **Discord Client ID**: Paste the Client ID from Discord
   - **Discord Client Secret**: Paste the Client Secret from Discord

4. Under **Redirect URLs**, ensure you have:
   ```
   https://cogncels.netlify.app
   ```

5. Click **"Save"**

## Step 5: Test Your Integration

1. Deploy your application
2. Click the "Continue with Discord" button
3. You should be redirected to Discord to authorize
4. After authorization, you'll be redirected back to your app

## Troubleshooting

### "Invalid OAuth2 redirect_uri"
- Make sure the Supabase callback URL is added to Discord's OAuth2 redirects
- Verify the URL exactly matches: `https://hpqfgumdvftrwjzuoggx.supabase.co/auth/v1/callback`

### "The site can't be reached" or localhost error
- Ensure `VITE_REDIRECT_URL` environment variable is set in Netlify to `https://cogncels.netlify.app`
- Make sure your production URL is in Supabase's allowed redirect URLs
- Redeploy your site after making configuration changes

### User data not showing correctly
- Discord provides user data through OAuth
- Username is extracted from Discord profile automatically
- Users can be identified by their Discord email or username

## Security Notes

- **Never commit** your Discord Client Secret to version control
- Store credentials only in Supabase dashboard
- Regularly rotate your Client Secret if you suspect it's been compromised
- Review OAuth scopes to ensure you're only requesting necessary permissions

## What Gets Shared

When users sign in with Discord, your app receives:
- Discord User ID
- Username
- Email address (if user has verified email)
- Avatar URL

All this information is securely handled by Supabase and never stored in your client-side code.
