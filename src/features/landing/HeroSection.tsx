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
    <section id="hero" className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden bg-[#0b0b0b]">
      
      {/* APEX Ambient Glow Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-glow -z-10" />

      {/* APEX Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* APEX Luxury Editorial Copy Block */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* APEX Eyebrow Motif */}
          <div className="eyebrow-label animate-fadeIn">
            <span>GITFOLIO 2.0 • LUXURY EDITORIAL ARCHITECTURE</span>
          </div>

          {/* APEX Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl headline-editorial text-white tracking-tight">
            Your GitHub Profile, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Elevated to Luxury.
            </span>
          </h1>

          {/* APEX Minimal Subtext */}
          <p className="text-base sm:text-lg text-[#9A9A9A] max-w-2xl mx-auto font-normal leading-relaxed">
            Instantly transform your GitHub repositories, contributions, and bio into a high-converting developer portfolio. Engineered with razor-sharp editorial typography.
          </p>

          {/* APEX Fast Generator Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Github className="w-4 h-4 text-zinc-400" />
                <span className="ml-1 text-xs font-mono text-zinc-400">github.com/</span>
              </div>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-28 pr-4 py-3 bg-[#12131a] border border-white/[0.08] focus:border-indigo-500 rounded-xl text-white placeholder-zinc-600 text-xs font-mono outline-none shadow-lux transition"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-glow-sm transition flex items-center justify-center gap-2 shrink-0 cursor-pointer uppercase tracking-wider font-mono"
            >
              <span>Build Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* APEX Minimal Feature Signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#9A9A9A] font-mono pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Sub-second Edge Deploy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Automated GitHub Sync
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
