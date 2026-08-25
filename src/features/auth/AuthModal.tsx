import React, { useState } from 'react';
import { Github, X, Sparkles, Lock, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState('sreerang');
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<'oauth' | 'email'>('oauth');

  if (!isOpen) return null;

  const handleOAuthLogin = () => {
    onSuccess(username.trim() || 'sreerang');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(username.trim() || 'sreerang');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12131a] border border-white/10 rounded-2xl w-full max-w-md p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
            <Github className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Continue with GitHub
          </h3>
          <p className="text-xs text-zinc-400">
            Sign in to automatically import your GitHub repositories, star analytics, and generate your live portfolio.
          </p>
        </div>

        {/* GitHub 1-Click OAuth Button */}
        <div className="space-y-3">
          <button
            onClick={handleOAuthLogin}
            className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold border border-zinc-700 hover:border-zinc-600 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer group"
          >
            <Github className="w-4 h-4" />
            <span>Continue with GitHub OAuth</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-mono justify-center">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Read-only permissions. We never modify code.</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-white/[0.08] flex-1" />
          <span className="text-[10px] uppercase font-mono text-zinc-500">or enter username</span>
          <div className="h-px bg-white/[0.08] flex-1" />
        </div>

        {/* Fast Username Input */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              GitHub Username
            </label>
            <input
              type="text"
              required
              placeholder="e.g. sreerang"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 text-xs font-mono outline-none focus:border-indigo-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.3)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Generate Portfolio Instant</span>
          </button>
        </form>

        <div className="text-center text-[11px] text-zinc-500">
          By continuing, you agree to Gitfolio's Terms of Service and Privacy Policy.
        </div>

      </div>
    </div>
  );
};
