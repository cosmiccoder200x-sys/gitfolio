import React from 'react';
import { PortfolioConfig } from '../../types/saas';
import { Github, Mail, ArrowUpRight, BookOpen, Quote } from 'lucide-react';

interface TemplateProps {
  portfolio: PortfolioConfig;
  isLivePreview?: boolean;
}

export const EditorialTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  const { theme, projects, skills, experiences, socialLinks } = portfolio;

  return (
    <div 
      className="min-h-full w-full py-16 px-6 sm:px-12 max-w-4xl mx-auto text-zinc-800 dark:text-zinc-200 font-serif leading-relaxed"
      style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
    >
      {/* Editorial Header */}
      <header className="mb-20 pb-12 border-b-2 border-zinc-900 dark:border-zinc-100 space-y-6">
        <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-zinc-500 font-sans">
          <span>PORTFOLIO GAZETTE • ISSUE 2026</span>
          <span>{portfolio.slug}.dev</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
          {portfolio.title}
        </h1>

        <p className="text-xl sm:text-2xl italic text-zinc-600 dark:text-zinc-400 max-w-2xl font-light">
          "{portfolio.tagline}"
        </p>

        <div className="flex items-center gap-6 pt-4 font-sans text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-white transition underline">
              GitHub Works
            </a>
          )}
          {socialLinks.email && (
            <a href={`mailto:${socialLinks.email}`} className="hover:text-zinc-950 dark:hover:text-white transition underline">
              Direct Inquiries
            </a>
          )}
        </div>
      </header>

      {/* Editorial Essay / About */}
      <section className="mb-20 space-y-4">
        <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-zinc-400">
          I. The Architectural Philosophy
        </h2>
        <div className="text-lg sm:text-xl leading-relaxed text-zinc-900 dark:text-zinc-200 space-y-4 first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-3 first-letter:text-zinc-950 dark:first-letter:text-white">
          <p>{portfolio.aboutText}</p>
        </div>
      </section>

      {/* Selected Works / Large Showcases */}
      <section className="mb-20 space-y-12">
        <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-300 dark:border-zinc-800 pb-2">
          II. Selected Software Projects
        </h2>

        <div className="space-y-16">
          {projects.map((proj, idx) => (
            <article key={proj.id} className="space-y-4">
              <div className="flex justify-between items-baseline font-sans">
                <span className="text-xs text-zinc-400 font-mono">0{idx + 1} // CASE STUDY</span>
                <span className="text-xs font-mono text-zinc-500">{proj.language}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white">
                {proj.displayName || proj.name}
              </h3>

              <p className="text-base text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
                {proj.customDescription || proj.description}
              </p>

              <div className="flex items-center gap-4 font-sans text-xs pt-2">
                {proj.githubUrl && (
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="font-bold underline text-zinc-800 dark:text-zinc-200">
                    View Source Repository &rarr;
                  </a>
                )}
                {proj.liveUrl && (
                  <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <span>Live Deployment</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Career History */}
      <section className="mb-20 space-y-6">
        <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-300 dark:border-zinc-800 pb-2">
          III. Proven Trajectory
        </h2>

        <div className="space-y-8 font-sans">
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline text-sm font-bold text-zinc-950 dark:text-white">
                <span>{exp.role} — {exp.company}</span>
                <span className="text-xs font-mono text-zinc-500 font-normal">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Colophon / Footer */}
      <footer className="pt-8 border-t border-zinc-300 dark:border-zinc-800 flex justify-between items-center text-xs font-sans font-mono text-zinc-500">
        <span>© {new Date().getFullYear()} {portfolio.slug}</span>
        <span>TYPESET ON GITFOLIO</span>
      </footer>
    </div>
  );
};
