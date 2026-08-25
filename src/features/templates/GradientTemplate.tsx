import React from 'react';
import { PortfolioConfig } from '../../types/saas';
import { Github, ExternalLink, Sparkles, Star, GitFork, Mail, Twitter, ArrowUpRight } from 'lucide-react';

interface TemplateProps {
  portfolio: PortfolioConfig;
  isLivePreview?: boolean;
}

export const GradientTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  const { theme, projects, skills, experiences, socialLinks } = portfolio;

  return (
    <div 
      className="min-h-full w-full py-16 px-4 sm:px-8 max-w-5xl mx-auto text-zinc-100 font-sans relative overflow-hidden"
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Background Ambient Mesh Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <header className="text-center mb-24 space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-emerald-500/20 border border-white/10 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Full-Stack Developer & Technical Creator</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          {portfolio.title}
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed font-normal">
          {portfolio.tagline}
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 font-semibold text-xs transition flex items-center gap-2 backdrop-blur-md">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
          {socialLinks.email && (
            <a href={`mailto:${socialLinks.email}`} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-90 font-semibold text-xs text-white shadow-lg transition flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Let's Build</span>
            </a>
          )}
        </div>
      </header>

      {/* Featured Projects with Glassmorphism */}
      <section className="mb-24 space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Engineered Works
          </h2>
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
            Selected Open-Source & Enterprise Systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className="bg-zinc-900/60 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-2xl transition duration-300 group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                    {proj.language}
                  </span>
                  <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    {proj.stars}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition">
                  {proj.displayName || proj.name}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {proj.customDescription || proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/[0.06] text-xs">
                <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1 font-semibold">
                  <Github className="w-3.5 h-3.5" />
                  <span>Code</span>
                </a>
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Pill Clouds */}
      <section className="mb-24 bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-cyan-950/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Technical Mastery</h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {skills.languages.concat(skills.frameworks, skills.tools).map((skill) => (
            <span 
              key={skill}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-white/10 text-xs text-zinc-500 font-mono">
        <span>© {new Date().getFullYear()} {portfolio.slug} • Built with Gitfolio</span>
      </footer>
    </div>
  );
};
