import React, { useState } from 'react';
import { Shield, Lock, Mail, KeyRound, Eye, EyeOff, Sparkles, ArrowLeft, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useNotifications } from '../context/NotificationContext.js';

interface AdminLoginGatewayProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminLoginGateway({ onSuccess, onCancel }: AdminLoginGatewayProps) {
  const { adminLogin } = useAuth();
  const { showToast } = useNotifications();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('7788');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutofill = () => {
    setEmail('admin@imovies.cinema');
    setPassword('Admin@123');
    setPin('7788');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await adminLogin(email, password, pin);
      showToast('Executive Clearance Verified. Welcome, Administrator!', 'success');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Specular Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[520px] h-[520px] rounded-full bg-purple-600/20 blur-[130px] -translate-y-12" />
        <div className="w-[420px] h-[420px] rounded-full bg-pink-500/15 blur-[120px] translate-x-32 translate-y-24" />
      </div>

      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl p-6 sm:p-10 shadow-2xl border border-[var(--glass-border-highlight)]">
        {/* Specular Highlight Strip */}
        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

        {/* Back Link */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Movie Showcase</span>
        </button>

        {/* Executive Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-yellow-400 p-[2px] shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-950 flex items-center justify-center">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-300 animate-pulse" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-yellow-400 text-slate-950 rounded-full shadow-sm">
              <KeyRound className="w-3 h-3" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill-purple text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Fingerprint className="w-3 h-3 text-purple-500" />
            <span>Tier-1 Executive Gateway</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black text-[var(--text-primary)] tracking-tight">
            Administrator Authentication
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-sm mx-auto">
            Authorized cinema personnel only. Manage auditoriums, showtime scheduling, pricing engines, and ticketing analytics.
          </p>
        </div>

        {/* 1-Click Quick Demo Autofill Banner */}
        <div className="mb-6 p-3.5 glass-panel-subtle rounded-2xl border border-[var(--glass-border-light)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg glass-pill-yellow flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-[var(--text-primary)]">Evaluation Quick Access</p>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">admin@imovies.cinema</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutofill}
            className="px-3 py-1.5 glass-btn-primary rounded-xl text-xs font-bold text-white transition-all cursor-pointer hover:scale-105 shrink-0"
          >
            ⚡ Autofill Credentials
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-rose-500 text-xs backdrop-blur-md flex items-center gap-2.5 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Executive Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500/70" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@imovies.cinema"
                className="w-full pl-10 pr-3.5 py-3 glass-input rounded-2xl text-xs sm:text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 glass-input rounded-2xl text-xs sm:text-sm focus:outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                Security Authorization PIN
              </label>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                Default: <span className="font-bold text-pink-500">7788</span>
              </span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-500/80" />
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="7788"
                className="w-full pl-10 pr-3.5 py-3 glass-input rounded-2xl text-xs sm:text-sm focus:outline-none transition-all font-mono tracking-widest"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 glass-btn-primary font-bold text-sm text-white rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 group"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Security Clearance...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Authorize & Unlock Executive Console</span>
              </>
            )}
          </button>
        </form>

        {/* Security Disclaimers / Badges */}
        <div className="mt-8 pt-6 border-t border-[var(--glass-border-light)] grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mb-1" />
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">256-Bit JWT</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="w-3.5 h-3.5 text-purple-500 mb-1" />
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">RBAC Tier 1</span>
          </div>
          <div className="flex flex-col items-center">
            <Fingerprint className="w-3.5 h-3.5 text-pink-500 mb-1" />
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Audit Logged</span>
          </div>
        </div>
      </div>
    </div>
  );
}
