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
      console.log('OAuth callback detected in URL');
    }

    // Set a shorter timeout to prevent infinite loading (2 seconds)
    const timeout = setTimeout(() => {
      console.warn('Session loading timeout - forcing app to load');
      // Clean up URL hash if present
      if (window.location.hash) {
        console.log('Cleaning up URL hash');
        window.history.replaceState(null, '', window.location.pathname);
      }
      setLoading(false);
    }, 2000);

    // Listen for auth changes FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (session?.user) {
        clearTimeout(timeout);
        const username = session.user.user_metadata?.username ||
                        session.user.email?.split('@')[0] ||
                        'User';
        setUser({ id: session.user.id, username });
        setLoading(false);

        // Clean up URL hash after successful auth
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
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
                          session.user.email?.split('@')[0] ||
                          'User';
          setUser({ id: session.user.id, username });

          // Clean up URL hash after successful session retrieval
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
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
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
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
