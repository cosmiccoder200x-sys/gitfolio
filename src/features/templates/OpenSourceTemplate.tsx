import React from 'react';
import { PortfolioConfig } from '../../types/saas';
import { Github, Star, GitFork, GitCommit, GitPullRequest, Flame, CheckCircle, ArrowUpRight } from 'lucide-react';

interface TemplateProps {
  portfolio: PortfolioConfig;
  isLivePreview?: boolean;
}

export const OpenSourceTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  const { theme, projects, skills, experiences, socialLinks } = portfolio;

  // Simulated GitHub commit activity tiles for 52 weeks
  const activityWeeks = Array.from({ length: 24 }).map((_, w) => 
    Array.from({ length: 7 }).map((_, d) => {
      const val = Math.floor(Math.sin(w + d) * 5 + 3);
      return Math.max(0, Math.min(val, 4));
    })
  );

  const getHeatmapColor = (lvl: number) => {
    switch(lvl) {
      case 4: return 'bg-emerald-400';
      case 3: return 'bg-emerald-500/80';
      case 2: return 'bg-emerald-700/60';
      case 1: return 'bg-emerald-900/40';
      default: return 'bg-zinc-800/80';
    }
  };

  return (
    <div 
      className="min-h-full w-full py-12 px-4 sm:px-8 max-w-5xl mx-auto text-zinc-300 font-mono text-xs sm:text-sm"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      {/* GitHub Maintainer Header */}
      <header className="bg-[#10121a] border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center font-bold text-2xl text-emerald-400">
              {portfolio.slug.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{portfolio.title}</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  PRO_MAINTAINER
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                @{portfolio.slug} • {portfolio.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-2 transition">
                <Github className="w-4 h-4" />
                <span>Follow on GitHub</span>
              </a>
            )}
          </div>
        </div>

        {/* GitHub Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800">
          <div className="bg-[#181a24] p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Total Stars</span>
            <span className="text-lg font-bold text-amber-400">
              {projects.reduce((acc, p) => acc + p.stars, 0)} ★
            </span>
          </div>
          <div className="bg-[#181a24] p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Public Repos</span>
            <span className="text-lg font-bold text-white">{projects.length}</span>
          </div>
          <div className="bg-[#181a24] p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Year Commits</span>
            <span className="text-lg font-bold text-emerald-400">1,482</span>
          </div>
          <div className="bg-[#181a24] p-3 rounded-xl border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase block font-bold">Contribution Streak</span>
            <span className="text-lg font-bold text-cyan-400">42 Days 🔥</span>
          </div>
        </div>
      </header>

      {/* Simulated GitHub Contribution Graph */}
      <section className="bg-[#10121a] border border-zinc-800 rounded-2xl p-6 mb-8 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            1,482 contributions in the last year
          </span>
          <span className="text-[10px] text-zinc-500">Continuous Integration</span>
        </div>

        {/* Heatmap Tiles */}
        <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
          {activityWeeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((level, dIdx) => (
                <div 
                  key={dIdx} 
                  className={`w-2.5 h-2.5 rounded-xs ${getHeatmapColor(level)} transition`}
                  title={`Activity Level: ${level}`}
                />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Repositories Showcase */}
      <section className="space-y-4 mb-8">
        <h2 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
          Pinned Repositories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-[#10121a] border border-zinc-800 hover:border-emerald-500/40 p-5 rounded-2xl flex flex-col justify-between space-y-3 transition">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm hover:text-emerald-400 transition cursor-pointer">
                    {proj.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                    Public
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {proj.customDescription || proj.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono pt-1">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {proj.language}
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3" /> {proj.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {proj.forks}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                  View Source &rarr;
                </a>
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
                    <span>Demo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-6 border-t border-zinc-800 text-xs text-zinc-500 flex justify-between items-center">
        <span>© {new Date().getFullYear()} {portfolio.slug}</span>
        <span className="text-emerald-400">gitfolio.dev/{portfolio.slug}</span>
      </footer>
    </div>
  );
};
