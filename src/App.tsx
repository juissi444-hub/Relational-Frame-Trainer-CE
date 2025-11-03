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

    // Check if we're returning from OAuth (has hash in URL)
    const hasOAuthHash = window.location.hash.includes('access_token');
    if (hasOAuthHash) {
      console.log('OAuth callback detected in URL - giving Supabase time to process');
    }

    // Set timeout based on whether we're processing OAuth
    // OAuth needs more time (10s), normal page load is quick (2s)
    const timeoutDuration = hasOAuthHash ? 10000 : 2000;
    const timeout = setTimeout(() => {
      console.warn('Session loading timeout - forcing app to load');
      setLoading(false);
    }, timeoutDuration);

    // Listen for auth changes FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      // Handle SIGNED_OUT first (before checking session)
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
        return;
      }

      // Handle any event that results in a valid session
      if (session?.user) {
        console.log('User session detected, event:', event);
        clearTimeout(timeout);
        const username = session.user.user_metadata?.username ||
                        session.user.user_metadata?.full_name ||
                        session.user.email?.split('@')[0] ||
                        'User';
        setUser({ id: session.user.id, username });
        setLoading(false);

        // Clean up URL hash after successful auth
        setTimeout(() => {
          if (window.location.hash) {
            console.log('Cleaning up OAuth hash from URL');
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 100);
      }
    });

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        console.log('getSession result:', { hasSession: !!session, error });
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
          setUser({ id: session.user.id, username });
          console.log('Session loaded, user:', username);
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

    return () => {
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logout successful');
      }
      // Don't set user here - let onAuthStateChange handle it
    } catch (err) {
      console.error('Logout exception:', err);
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
