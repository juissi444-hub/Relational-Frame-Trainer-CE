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
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.error('Session loading timeout - forcing app to load');
      setLoading(false);
    }, 5000);

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
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
        }
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.error('Exception getting session:', err);
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const username = session.user.user_metadata?.username ||
                        session.user.email?.split('@')[0] ||
                        'User';
        setUser({ id: session.user.id, username });
        setLoading(false);
      } else {
        setUser(null);
      }
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
