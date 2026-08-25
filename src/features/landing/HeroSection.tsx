import React, { useState } from 'react';
import { ArrowRight, Github, Check } from 'lucide-react';
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
    <section id="hero" className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 bg-[#09090b]">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Copy Block */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold px-3 py-1 rounded bg-[#18181b] border border-[#27272a] inline-block">
            GitHub to Developer Portfolio
          </span>

          <h1 className="text-4xl sm:text-6xl font-bold text-zinc-100 tracking-tight font-display leading-[1.08]">
            Build a portfolio from the work <br className="hidden sm:inline" />
            you already have.
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Turn your GitHub repositories, star activity, and bio into a high-converting, recruiter-ready developer portfolio. No design skills required.
          </p>

          {/* Generator Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                <Github className="w-4 h-4 text-zinc-400" />
                <span className="ml-1 text-xs font-mono text-zinc-400">github.com/</span>
              </div>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-28 pr-4 py-2.5 bg-[#121215] border border-[#27272a] focus:border-zinc-500 rounded-lg text-zinc-100 placeholder-zinc-500 text-xs font-mono outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
            >
              <span>Create your portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Secondary Action & Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 pt-2 font-mono">
            <button
              onClick={onExploreExamples}
              className="text-zinc-300 hover:text-white underline cursor-pointer"
            >
              View examples &rarr;
            </button>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Free Subdomain
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Custom Domains & SSL
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
