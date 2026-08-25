import React from 'react';
import { PortfolioConfig } from '../../types/saas';
import { 
  Github, 
  ExternalLink, 
  Mail, 
  Twitter, 
  Linkedin, 
  MapPin, 
  Star, 
  GitFork,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface TemplateProps {
  portfolio: PortfolioConfig;
  isLivePreview?: boolean;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  const { theme, projects, skills, experiences, socialLinks } = portfolio;
  const activeSections = portfolio.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div 
      className="min-h-full w-full py-16 px-6 sm:px-12 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-100 font-sans transition-colors"
      style={{ fontFamily: theme.fontFamily }}
    >
      {activeSections.map((section) => {
        switch (section.id) {
          case 'hero':
            return (
              <header key="hero" className="mb-20 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xl text-zinc-800 dark:text-zinc-200">
                    {portfolio.title.charAt(0)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1">
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1">
                        <Twitter className="w-4 h-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {socialLinks.email && (
                      <a href={`mailto:${socialLinks.email}`} className="hover:text-zinc-900 dark:hover:text-white transition flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>Contact</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    {portfolio.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl">
                    {portfolio.tagline}
                  </p>
                </div>
              </header>
            );

          case 'about':
            return (
              <section key="about" className="mb-20 pb-12 border-b border-zinc-200 dark:border-zinc-800/80">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">About</h2>
                <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl">
                  {portfolio.aboutText}
                </p>
              </section>
            );

          case 'projects':
            return (
              <section key="projects" className="mb-20 pb-12 border-b border-zinc-200 dark:border-zinc-800/80">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-8">Selected Projects</h2>
                <div className="space-y-12">
                  {projects.filter(p => p.featured).map((proj) => (
                    <article key={proj.id} className="group flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:text-indigo-500 transition">
                            {proj.displayName || proj.name}
                          </h3>
                          {proj.isAiRecommended && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {proj.customDescription || proj.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {proj.tags.map((tag) => (
                            <span key={tag} className="text-xs font-mono text-zinc-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 pt-1">
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1 text-xs font-semibold">
                            <span>Visit</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );

          case 'skills':
            return (
              <section key="skills" className="mb-20 pb-12 border-b border-zinc-200 dark:border-zinc-800/80">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-6">Technical Capabilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono mb-2">Languages</h3>
                    <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {skills.languages.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono mb-2">Frameworks</h3>
                    <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {skills.frameworks.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono mb-2">Infrastructure</h3>
                    <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {skills.tools.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </section>
            );

          case 'experience':
            return (
              <section key="experience" className="mb-20 pb-12 border-b border-zinc-200 dark:border-zinc-800/80">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-8">Work History</h2>
                <div className="space-y-8">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                          {exp.role} <span className="font-normal text-zinc-500">at {exp.company}</span>
                        </h3>
                        <span className="text-xs font-mono text-zinc-500">
                          {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            );

          case 'contact':
            return (
              <section key="contact" className="mb-12">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">Contact</h2>
                <p className="text-base text-zinc-700 dark:text-zinc-300 mb-6">
                  Available for select consulting engagements, architectural reviews, and full-time senior engineering opportunities.
                </p>
                <a 
                  href={`mailto:${socialLinks.email || 'hello@example.com'}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold rounded-xl text-sm transition hover:opacity-90"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reach Out &rarr;</span>
                </a>
              </section>
            );

          default:
            return null;
        }
      })}

      <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-400 font-mono flex justify-between items-center">
        <span>© {new Date().getFullYear()} {portfolio.title.split('—')[0]}</span>
        <span className="hover:text-indigo-400 transition cursor-pointer">Built with Gitfolio</span>
      </footer>
    </div>
  );
};
