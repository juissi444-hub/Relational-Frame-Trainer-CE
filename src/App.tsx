import React, { useState, useEffect } from 'react';
import RelationalFrameTrainer from './RelationalFrameTrainer';
import AuthModal from './AuthModal';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount and listen to auth changes
  useEffect(() => {
    console.log('App mounting, checking auth...');
    console.log('Current URL:', window.location.href);
    console.log('URL hash:', window.location.hash);

    // Check if we're returning from OAuth (has hash in URL)
    const hasOAuthHash = window.location.hash.includes('access_token') ||
                         window.location.hash.includes('error');
    if (hasOAuthHash) {
      console.log('OAuth callback detected in URL hash');
      console.log('Full hash:', window.location.hash);
    }

    // Set timeout based on whether we're processing OAuth
    // OAuth needs more time (15s), normal page load is quick (2s)
    const timeoutDuration = hasOAuthHash ? 15000 : 2000;
    console.log('Setting timeout duration:', timeoutDuration, 'ms');

    const timeout = setTimeout(() => {
      console.warn('Session loading timeout - forcing app to load');
      console.log('User state at timeout:', user);
      setLoading(false);
    }, timeoutDuration);

    // Listen for auth changes FIRST (before getSession)
    console.log('Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('=== AUTH STATE CHANGE ===');
      console.log('Event:', event);
      console.log('Session exists:', !!session);
      console.log('User email:', session?.user?.email);
      console.log('User metadata:', session?.user?.user_metadata);

      // Handle SIGNED_OUT first (before checking session)
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        setLoading(false);
        return;
      }

      // Handle any event that results in a valid session
      if (session?.user) {
        console.log('Processing user session...');
        clearTimeout(timeout);
        const username = session.user.user_metadata?.username ||
                        session.user.user_metadata?.full_name ||
                        session.user.email?.split('@')[0] ||
                        'User';
        console.log('Setting user:', { id: session.user.id, username });
        setUser({ id: session.user.id, username });
        setLoading(false);

        // Close auth modal if it's open (e.g., after OAuth redirect)
        setShowAuthModal(false);

        // Clean up URL hash after successful auth
        setTimeout(() => {
          if (window.location.hash) {
            console.log('Cleaning up OAuth hash from URL');
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 100);
      }
    });

    // Get initial session - delay if OAuth callback to let Supabase process the hash
    const getSessionDelay = hasOAuthHash ? 1000 : 0;
    console.log('Will check session in', getSessionDelay, 'ms');

    setTimeout(() => {
      console.log('Calling getSession...');
      supabase.auth.getSession()
        .then(({ data: { session }, error }) => {
          console.log('=== GET SESSION RESULT ===');
          console.log('Has session:', !!session);
          console.log('Error:', error);
          console.log('User:', session?.user?.email);

          clearTimeout(timeout);

          if (error) {
            console.error('Error getting session:', error);
            setLoading(false);
            return;
          }

          if (session?.user) {
            const username = session.user.user_metadata?.username ||
                            session.user.user_metadata?.full_name ||
                            session.user.email?.split('@')[0] ||
                            'User';
            console.log('Setting user from getSession:', { id: session.user.id, username });
            setUser({ id: session.user.id, username });
          } else {
            console.log('No existing session found');
          }
          setLoading(false);
        })
        .catch((err) => {
          clearTimeout(timeout);
          console.error('Exception getting session:', err);
          setLoading(false);
        });
    }, getSessionDelay);

    return () => {
      console.log('Cleaning up auth listeners');
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = (userId: string, username: string) => {
    const userData = { id: userId, username };
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      // Set user to null immediately for instant UI feedback
      setUser(null);

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        // If logout fails, you might want to restore the user state
        // but we'll leave it null since the user clicked logout
      } else {
        console.log('Logout successful');
      }
    } catch (err) {
      console.error('Logout exception:', err);
      // Keep user as null even if there's an exception
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RelationalFrameTrainer
        user={user}
        onShowLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </>
  );
}

export default App;
