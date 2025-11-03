import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: (userId: string, username: string) => void;
}

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase
          .from('users')
          .select('id, username, password')
          .eq('username', username)
          .single();

        if (error || !data) {
          setError('Invalid username or password');
          setLoading(false);
          return;
        }

        if (data.password !== password) {
          setError('Invalid username or password');
          setLoading(false);
          return;
        }

        onAuthSuccess(data.id, data.username);
      } else {
        // Register
        // Check if username already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('username', username)
          .single();

        if (existingUser) {
          setError('Username already exists');
          setLoading(false);
          return;
        }

        // Create new user
        const { data, error } = await supabase
          .from('users')
          .insert([{ username, password }])
          .select()
          .single();

        if (error) {
          setError('Failed to create account: ' + error.message);
          setLoading(false);
          return;
        }

        onAuthSuccess(data.id, data.username);
      }
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
