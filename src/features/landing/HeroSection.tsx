import React, { useState } from 'react';
import { Sparkles, ArrowRight, Github, CheckCircle2 } from 'lucide-react';
import { LiveHeroPreview } from './LiveHeroPreview';

interface HeroSectionProps {
  onFastGenerate: (username: string) => void;
  onExploreExamples: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFastGenerate,
  onExploreExamples,
}) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onFastGenerate(username.trim());
    } else {
      onFastGenerate('sreerang');
    }
  };

  return (
    <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      
      {/* Background Decorative Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Hero Copy */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Minimal Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono tracking-wide animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gitfolio Architecture — Zero-Config Developer SaaS</span>
          </div>

          {/* Premium Modern Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Your GitHub profile, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              elevated.
            </span>
          </h1>

          {/* Minimal Subtext */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Instantly transform your GitHub repositories, contributions, and bio into a high-converting developer portfolio. Engineered for modern engineers.
          </p>

          {/* Fast Generator Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Github className="w-4 h-4" />
                <span className="ml-1 text-xs font-mono text-zinc-400">github.com/</span>
              </div>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-28 pr-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-600 text-xs font-mono outline-none shadow-xl transition"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(99,102,241,0.35)] transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Build Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Minimal Feature Signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-zinc-400 font-mono pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Instant Edge Deploy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Automated Repo Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Custom Domains & SSL
            </span>
          </div>

        </div>

        {/* Live Interactive Hero Portfolio Preview */}
        <div className="pt-2">
          <LiveHeroPreview />
        </div>

      </div>
    </section>
  );
};
