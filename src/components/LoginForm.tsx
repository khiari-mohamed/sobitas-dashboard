'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    remember: false
  });
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/admin/login', {
        identifier: formData.identifier,
        password: formData.password
      });
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_username', response.data.adminUsername);
        localStorage.setItem('admin_role', response.data.adminRole);
        router.push('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/admin/register', {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        role: 'admin' // <-- Add this line
      });

      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_username', response.data.adminUsername);
        localStorage.setItem('admin_role', response.data.adminRole);
        router.push('/');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Background Image */}
      <div 
        className="hidden lg:flex lg:w-3/5 relative bg-cover bg-center"
        style={{
          backgroundImage: "url('/soitas.webp')"
        }}
      >
        {/* Bottom Left Branding */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">SOBITAS</h2>
            <p className="text-white text-sm opacity-90">Bienvenue dans l'espace administration</p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center px-8 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-xl">SOBITAS</h2>
              <p className="text-gray-600 text-sm">Administration</p>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-6">
              {isSignup ? 'CREATE ADMIN ACCOUNT:' : 'ADMIN LOGIN:'}
            </h3>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Login/Signup Form */}
          {!isSignup ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div>
                <input
                  type="text"
                  name="identifier"
                  placeholder="Username or Email"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  id="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-sky-500 border-gray-300 rounded focus:ring-sky-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SIGNING IN...' : 'LOGIN'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              {/* Username Input */}
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-sky-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CREATING ADMIN...' : 'SIGN UP'}
              </button>
            </form>
          )}

          {/* Toggle between Login/Signup */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sky-500 hover:text-sky-600 text-sm font-medium"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an admin account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}