import React from 'react';
import { PortfolioConfig } from '../../types/saas';
import { 
  Github, 
  ExternalLink, 
  MapPin, 
  Star, 
  GitFork, 
  Code2, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Activity,
  Briefcase,
  Mail,
  Twitter,
  Linkedin
} from 'lucide-react';

interface TemplateProps {
  portfolio: PortfolioConfig;
  isLivePreview?: boolean;
}

export const BentoTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  const { theme, projects, skills, experiences, socialLinks } = portfolio;

  return (
    <div 
      className="min-h-full w-full py-12 px-4 sm:px-8 max-w-6xl mx-auto text-zinc-200 font-sans"
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Bento Grid Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Bento Cell 1: Hero Identity (8 cols) */}
        <div className="md:col-span-8 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for high-impact opportunities</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {portfolio.title}
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-2xl font-normal">
              {portfolio.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6 mt-6 border-t border-white/[0.06]">
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-2 transition">
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            )}
            {socialLinks.email && (
              <a href={`mailto:${socialLinks.email}`} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition">
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </a>
            )}
          </div>
        </div>

        {/* Bento Cell 2: Quick Stats & Avatar Widget (4 cols) */}
        <div className="md:col-span-4 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-black text-2xl text-indigo-400">
                {portfolio.slug.charAt(0).toUpperCase()}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-black/40 px-2 py-1 rounded-md border border-white/[0.06]">
                Developer Matrix
              </span>
            </div>

            <div>
              <p className="text-xs text-zinc-500 uppercase font-mono font-semibold">Username</p>
              <p className="text-lg font-bold text-white font-mono">@{portfolio.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.06]">
            <div className="bg-[#181a24] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] uppercase text-zinc-500 font-mono font-bold block">Projects</span>
              <span className="text-xl font-black text-white font-mono">{projects.length}</span>
            </div>
            <div className="bg-[#181a24] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] uppercase text-zinc-500 font-mono font-bold block">Stars</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {projects.reduce((acc, p) => acc + p.stars, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Bento Cell 3: Technical Skills Matrix (4 cols) */}
        <div className="md:col-span-4 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-4">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Core Tech Stack</span>
            </h2>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-zinc-500 font-mono block mb-1.5">Languages</span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.languages.map(l => (
                    <span key={l} className="px-2.5 py-1 rounded-lg bg-[#181a24] border border-white/[0.06] text-xs font-mono text-indigo-300">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-zinc-500 font-mono block mb-1.5">Frameworks & Infrastructure</span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.frameworks.concat(skills.tools.slice(0, 4)).map(f => (
                    <span key={f} className="px-2.5 py-1 rounded-lg bg-[#181a24] border border-white/[0.06] text-xs font-mono text-zinc-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Cell 4: Top Featured Project Showcase (8 cols) */}
        {projects[0] && (
          <div className="md:col-span-8 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl group hover:border-indigo-500/40 transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-bold">
                  ★ Highlighted Project
                </span>
                <div className="flex items-center gap-3 text-xs font-mono text-amber-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {projects[0].stars}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-400 transition">
                {projects[0].displayName || projects[0].name}
              </h2>

              <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                {projects[0].customDescription || projects[0].description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {projects[0].tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-black/40 text-xs font-mono text-emerald-400 border border-emerald-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-white/[0.06]">
              {projects[0].githubUrl && (
                <a href={projects[0].githubUrl} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono">
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              )}
              {projects[0].liveUrl && (
                <a href={projects[0].liveUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-mono font-semibold ml-auto">
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Bento Cell 5: Additional Project Cards (Grid 6 + 6 cols) */}
        {projects.slice(1, 3).map((proj) => (
          <div key={proj.id} className="md:col-span-6 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">
                  {proj.displayName || proj.name}
                </h3>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400" />
                  {proj.stars}
                </span>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {proj.customDescription || proj.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {proj.tags.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 bg-black/40 rounded border border-white/[0.06] text-zinc-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/[0.06] text-xs font-mono">
              <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white">Code</a>
              {proj.liveUrl && (
                <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                  <span>Live</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}

        {/* Bento Cell 6: Experience Timeline (12 cols) */}
        <div className="md:col-span-12 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Career Experience</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">{experiences.length} Positions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-2 p-4 bg-[#181a24] rounded-xl border border-white/[0.04]">
                <span className="text-[11px] font-mono text-indigo-400 font-semibold block">
                  {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                </span>
                <h3 className="font-bold text-white text-sm">{exp.role}</h3>
                <p className="text-xs text-zinc-400 font-medium">@{exp.company}</p>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 pt-1">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500 font-mono">
        <span>© {new Date().getFullYear()} {portfolio.slug}</span>
        <span className="text-indigo-400">Built with Gitfolio.dev</span>
      </footer>
    </div>
  );
};
