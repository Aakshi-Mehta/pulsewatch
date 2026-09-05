import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, ShieldCheck, Sparkles, ArrowRight, Lock, Mail, User } from 'lucide-react';

export const AuthPage = () => {
  const { login, register, demoLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoClick = async () => {
    setError('');
    setSubmitting(true);
    try {
      await demoLogin();
    } catch (err) {
      setError('Access failed. Starting fresh...');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      
      {/* Background Lighting Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200 shadow-xl relative z-10 bg-white">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-accent p-0.5 mx-auto mb-4 shadow-xl shadow-brand-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Activity className="w-7 h-7 text-brand-600 animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            PulseWatch
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Know what changed. Know what matters.
          </p>
        </div>

        {/* Quick Instant Preview Button */}
        <div className="mb-6">
          <button
            onClick={handleDemoClick}
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition border border-brand-500"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>1-Click Instant Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="text-center text-[10px] text-slate-400 mt-1.5 font-mono font-medium">
            Instant access to live market briefing & watchlist state
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Or Sign In Manually
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Trader Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="trader@pulsewatch.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-md"
          >
            {submitting ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-brand-600 font-semibold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register Now'}
          </button>
        </div>

      </div>
    </div>
  );
};
