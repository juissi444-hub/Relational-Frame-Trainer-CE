# Supabase Integration - Complete Implementation

The login system **already saves everything to Supabase**! Here's what's implemented:

## ✓ What Gets Saved

### User Progress Data
- **Score**: correct, incorrect, missed counts
- **History**: complete question history
- **Stats History**: performance statistics
- **Current Trial**: active question state
- **Time Left**: remaining time on current question
- **Feedback**: current feedback state
- **Pause State**: whether game is paused

### Settings
- Difficulty level (premise count)
- Time per question
- Network complexity
- Spoiler mode
- Dark mode
- Stimulus types (real words, nonsense, letters, emojis, etc.)
- Auto-progression settings
- Universal & mode-specific progress
- Enabled relation modes

## ✓ How It Works

### 1. Auto-Save System
**Location**: `src/RelationalFrameTrainer.tsx:962-975`

Automatically saves to Supabase whenever:
- User answers a question
- Settings change
- Score updates
- Game state changes (pause, resume, etc.)

### 2. User Login Flow
**Location**: `src/RelationalFrameTrainer.tsx:807-909`

When user logs in:
1. Checks for anonymous session data in localStorage
2. **Migrates** localStorage data to Supabase automatically
3. Loads user's saved data from Supabase
4. Clears localStorage after successful migration

### 3. Anonymous Users
**Location**: `src/RelationalFrameTrainer.tsx:790-793, 911-949`

When not logged in:
- Saves to localStorage
- Upon login, automatically migrates to Supabase

### 4. Save Function
**Location**: `src/RelationalFrameTrainer.tsx:737-798`

```javascript
const saveToStorage = useCallback(async () => {
  if (user) {
    // Save to Supabase
    await supabase.from('user_progress').upsert({...});
  } else {
    // Save to localStorage
    localStorage.setItem('rft_local_progress', JSON.stringify({...}));
  }
}, [user, score, history, ...]);
```

## ✓ Database Schema

**File**: `SUPABASE_SETUP.sql`

### Table: user_progress
- `user_id`: UUID (unique per user)
- `score`: JSONB (correct/incorrect/missed counts)
- `history`: JSONB (question history array)
- `stats_history`: JSONB (statistics array)
- `current_trial`: JSONB (active question)
- `time_left`: INTEGER
- `feedback`: TEXT
- `is_paused`: BOOLEAN
- `settings`: JSONB (all settings)
- `created_at`, `updated_at`: TIMESTAMP

### Security (RLS Policies)
✓ Users can only view their own data
✓ Users can only update their own data
✓ Foreign key to auth.users ensures data integrity
✓ Automatic timestamp updates

## ✓ Setup Instructions

### If Database Isn't Set Up Yet:

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run the SQL** from `SUPABASE_SETUP.sql`
3. **Verify** the table was created in Table Editor

### Verification:

1. **Login** to the app
2. **Play a few questions**
3. **Check Supabase Dashboard** → Table Editor → user_progress
4. **See your data** saved in real-time!

### Console Logs:

Watch browser console for save confirmations:
- `💾 Saving to Supabase for user: {id}`
- `✅ Successfully saved to Supabase`
- `📖 Loading data from Supabase`

## ✓ Migration from Anonymous → Logged In

**Automatic!** When a user:
1. Plays anonymously (saves to localStorage)
2. Creates account or logs in
3. All localStorage data → automatically migrated to Supabase
4. localStorage cleared
5. Future saves → directly to Supabase

## ✓ Data Persistence Flow

```
┌─────────────────┐
│ User Not Logged │ → saves to localStorage
└────────┬────────┘
         │ logs in
         ↓
┌─────────────────┐
│ Migrate to DB   │ → localStorage → Supabase
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ User Logged In  │ → saves to Supabase directly
└─────────────────┘
```

## ✓ Troubleshooting

### Data Not Saving?

1. **Check Console**: Look for save errors
2. **Verify Database**: Run SUPABASE_SETUP.sql
3. **Check RLS**: Ensure policies are enabled
4. **Test Auth**: Confirm user is logged in (check user object)

### Data Not Loading?

1. **Check Console**: Look for load errors
2. **Verify user_id**: Must match auth.users(id)
3. **Check Permissions**: RLS policies must allow SELECT

## ✓ Summary

**Everything is already implemented!** The login system:
- ✅ Saves all game data to Supabase
- ✅ Loads data when user logs in
- ✅ Migrates anonymous data automatically
- ✅ Has proper security (RLS)
- ✅ Auto-saves on every state change
- ✅ Includes comprehensive logging

**Just run the SQL setup and it works!**
