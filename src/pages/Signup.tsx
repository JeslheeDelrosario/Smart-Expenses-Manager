// src/pages/Signup.tsx
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react';


export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Signup attempt:', { 
        fullName: formData.fullName, 
        email: formData.email, 
        password: formData.password 
      });

      setSuccess('Account created successfully! Redirecting to login...');
      
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Optional: Redirect to login after success
      // setTimeout(() => navigate('/login'), 2000);
      
    } catch {
      setError('Signup failed. Please try again.');
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
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-8">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      {/* Main signup container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Signup card */}
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-white/60 text-sm">
              Start managing your expenses today
            </p>
          </motion.div>

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name input field */}
            <motion.div
              custom={1}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Email input field */}
            <motion.div
              custom={2}
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </motion.div>

            {/* Password input field */}
            <motion.div
              custom={3}
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-white/40">
                Must be at least 8 characters
              </p>
            </motion.div>

            {/* Confirm Password input field */}
            <motion.div
              custom={4}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
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

            {/* Success message display */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm"
              >
                {success}
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              custom={5}
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white font-medium rounded-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Footer links */}
          <motion.div
            custom={6}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 text-center"
          >
            <p className="text-sm text-white/60">
              Already have an account?{" "}
              <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </p>
          </motion.div>

          {/* Terms agreement note */}
          <motion.p
            custom={7}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            className="mt-4 text-xs text-center text-white/40"
          >
            By creating an account, you agree to our{" "}
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              Privacy Policy
            </button>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}