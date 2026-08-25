import React from 'react';
import { FolderGit2, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateToDashboard: () => void;
  onNavigateSection: (sectionId: string) => void;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateToDashboard,
  onNavigateSection,
  isAuthenticated,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0c]/85 backdrop-blur-md transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigateSection('hero')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600/30 transition shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">Gitfolio</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                SaaS v2.4
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
            <button 
              onClick={() => onNavigateSection('features')} 
              className="hover:text-white transition cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => onNavigateSection('templates')} 
              className="hover:text-white transition cursor-pointer"
            >
              Templates
            </button>
            <button 
              onClick={() => onNavigateSection('showcase')} 
              className="hover:text-white transition cursor-pointer"
            >
              Showcase
            </button>
            <button 
              onClick={() => onNavigateSection('pricing')} 
              className="hover:text-white transition cursor-pointer"
            >
              Pricing
            </button>
            <a 
              href="https://github.com/cosmiccoder200x-sys/gitfolio" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition cursor-pointer"
            >
              Docs
            </a>
          </nav>

          {/* Auth & CTAs */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onNavigateToDashboard}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.35)] transition flex items-center gap-2 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:block text-xs font-semibold text-zinc-300 hover:text-white px-3 py-2 transition cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.35)] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Get Started Free</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
