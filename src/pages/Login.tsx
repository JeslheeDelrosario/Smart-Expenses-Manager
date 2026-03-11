// src/pages/Login.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Mail, Lock, LogIn, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const DEMO_CREDENTIALS = {
    email: "demo@example.com",
    password: "demo12345",
  };

  // Add this function inside your component
  const handleDemoLogin = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    // Optional: Auto-submit after a brief delay
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    }, 500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login attempt:', { email, password });
      
      setEmail('');
      setPassword('');
      
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1
      }
    })
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Main login container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Login card */}
        <div className="bg-white/[0.03] backdrop-blur-lg rounded-2xl border border-white/[0.08] p-8 shadow-2xl">
          {/* Header section */}
          <motion.div
            custom={0}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-8"
          >
            {/* Logo/Icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/60 text-sm">
              Sign in to access your expense manager
            </p>
          </motion.div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input field */}
            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Password input field */}
            <motion.div
              custom={2}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Error message display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 bg-white/10 border border-white/20 text-white/80 text-sm rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              👋 Try Demo Account
            </motion.button>

            {/* Submit button */}
            <motion.button
              custom={3}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              {isLoading ? (
                // Loading state
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                // Normal state
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Footer links */}
          <motion.div
            custom={4}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 text-center space-y-2"
          >
            <p className="text-sm text-white/60">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </p>
            <p className="text-sm text-white/60">
              Forgot your password?{" "}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                onClick={() => console.log("Navigate to forgot password")}
              >
                Reset it
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}