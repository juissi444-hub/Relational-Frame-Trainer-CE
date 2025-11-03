import React, { useState, useEffect } from 'react';
import RelationalFrameTrainer from './RelationalFrameTrainer';
import AuthModal from './AuthModal';
import { LogIn, LogOut, User } from 'lucide-react';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount and listen to auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const username = session.user.user_metadata?.username ||
                        session.user.email?.split('@')[0] ||
                        'User';
        setUser({ id: session.user.id, username });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const username = session.user.user_metadata?.username ||
                        session.user.email?.split('@')[0] ||
                        'User';
        setUser({ id: session.user.id, username });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Relational Frame Trainer</h1>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={20} />
                  <span className="font-medium">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <LogIn size={20} />
                Login
              </button>
            )}
          </div>
        </div>

        {user ? (
          <RelationalFrameTrainer userId={user.id} username={user.username} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Relational Frame Trainer</h2>
            <p className="text-gray-600 mb-6">
              Please log in or register to start training and save your progress.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg"
            >
              Get Started
            </button>
          </div>
        )}

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default App;
