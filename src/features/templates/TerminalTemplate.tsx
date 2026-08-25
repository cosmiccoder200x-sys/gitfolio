import React, { useState } from 'react';
import { PortfolioConfig } from '../../types/saas';
import { 
  Terminal as TerminalIcon, 
  Github, 
  ExternalLink, 
  Star, 
  GitFork, 
  Folder, 
  FileCode, 
  Check, 
  Command,
  Play
} from 'lucide-react';

interface TemplateProps {
  portfolio: PortfolioConfig;
  isLivePreview?: boolean;
}

export const TerminalTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  const { theme, projects, skills, experiences, socialLinks } = portfolio;
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'history'>('profile');
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>(['gitfolio --version 2.4.0', 'whoami -> ' + portfolio.slug]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;
    const cmd = cliInput.trim().toLowerCase();
    let response = `Command not recognized: '${cmd}'. Try 'help', 'projects', 'skills', 'contact', 'clear'`;

    if (cmd === 'help') {
      response = 'Available commands: about, projects, skills, experience, contact, clear';
    } else if (cmd === 'about' || cmd === 'profile') {
      setActiveTab('profile');
      response = `Navigating to Profile. Bio: ${portfolio.aboutText.slice(0, 100)}...`;
    } else if (cmd === 'projects') {
      setActiveTab('projects');
      response = `Loaded ${projects.length} featured repositories.`;
    } else if (cmd === 'skills') {
      setActiveTab('skills');
      response = `Skills loaded: ${skills.languages.join(', ')}`;
    } else if (cmd === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    }

    setCliHistory(prev => [...prev, `$ ${cliInput}`, response]);
    setCliInput('');
  };

  return (
    <div 
      className="min-h-full w-full py-8 px-4 sm:px-8 max-w-5xl mx-auto font-mono text-emerald-400 bg-[#0c0d12] transition-colors"
      style={{ fontFamily: '"JetBrains Mono", monospace, monospace' }}
    >
      {/* Terminal Window Container */}
      <div className="bg-[#10121a] border border-emerald-500/30 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Terminal Title Bar */}
        <div className="bg-[#171924] px-4 py-3 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-zinc-400 font-semibold ml-2 flex items-center gap-1">
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              {portfolio.slug}@gitfolio: ~
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-emerald-500/20 text-xs">
            {(['profile', 'projects', 'skills', 'history'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded transition capitalize text-[11px] ${
                  activeTab === tab 
                    ? 'bg-emerald-500 text-black font-bold' 
                    : 'text-zinc-400 hover:text-emerald-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 space-y-6 text-xs sm:text-sm text-zinc-300">
          
          {/* CLI History Box */}
          <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 space-y-1 text-xs font-mono max-h-36 overflow-y-auto">
            {cliHistory.map((item, idx) => (
              <div key={idx} className={item.startsWith('$') ? 'text-amber-400 font-bold' : 'text-zinc-400'}>
                {item}
              </div>
            ))}
            <form onSubmit={handleRunCommand} className="flex items-center gap-2 text-emerald-400 pt-1">
              <span>{portfolio.slug}@dev:~$</span>
              <input
                type="text"
                placeholder="type 'help', 'projects', 'skills'..."
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                className="bg-transparent text-white outline-none flex-1 font-mono text-xs"
              />
            </form>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-2 border-b border-zinc-800 pb-4">
                <span className="text-amber-400 text-xs">// 01. DEVELOPER IDENTIFIER</span>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  const engineer = "{portfolio.title.split('—')[0].trim()}";
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {portfolio.tagline}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-amber-400 text-xs">// 02. SYSTEM ARCHITECTURE SUMMARY</span>
                <p className="text-zinc-300 leading-relaxed bg-black/40 p-4 rounded-lg border border-zinc-800">
                  {portfolio.aboutText}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 uppercase font-bold block mb-2">Network Endpoints</span>
                  <div className="space-y-1 text-xs">
                    {socialLinks.github && (
                      <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" />
                        <span>github.com/{portfolio.slug}</span>
                      </a>
                    )}
                    {socialLinks.email && (
                      <span className="text-zinc-300 block">mail: {socialLinks.email}</span>
                    )}
                    {socialLinks.website && (
                      <span className="text-zinc-300 block">web: {socialLinks.website}</span>
                    )}
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-zinc-800">
                  <span className="text-xs text-zinc-500 uppercase font-bold block mb-2">Runtime Environment</span>
                  <div className="space-y-1 text-xs text-zinc-400">
                    <div>Status: <span className="text-emerald-400 font-bold">READY_TO_DEPLOY</span></div>
                    <div>Location: {portfolio.theme.fontFamily} / UTF-8</div>
                    <div>Public Port: 443 (TLS v1.3 Verified)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-amber-400 text-xs">// 03. INDEXED REPOSITORIES ({projects.length})</span>
                <span className="text-[10px] text-zinc-500">git status -s</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-black/40 rounded-lg border border-zinc-800 hover:border-emerald-500/50 transition space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Folder className="w-3.5 h-3.5 text-emerald-400" />
                        {proj.displayName || proj.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3" />
                          {proj.stars}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <GitFork className="w-3 h-3" />
                          {proj.forks}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {proj.customDescription || proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-emerald-400">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
                          <Github className="w-3 h-3" />
                          <span>Code</span>
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 ml-auto">
                          <span>Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-4 animate-fadeIn">
              <span className="text-amber-400 text-xs">// 04. PACKAGE DEPENDENCIES & CORE STACK</span>
              
              <div className="bg-black/50 p-4 rounded-lg border border-zinc-800 font-mono text-xs space-y-3">
                <div>
                  <span className="text-zinc-500">const languages = </span>
                  <span className="text-emerald-300">[{skills.languages.map(l => `"${l}"`).join(', ')}];</span>
                </div>
                <div>
                  <span className="text-zinc-500">const frameworks = </span>
                  <span className="text-cyan-300">[{skills.frameworks.map(f => `"${f}"`).join(', ')}];</span>
                </div>
                <div>
                  <span className="text-zinc-500">const infrastructure = </span>
                  <span className="text-amber-300">[{skills.tools.map(t => `"${t}"`).join(', ')}];</span>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-fadeIn">
              <span className="text-amber-400 text-xs">// 05. GIT COMMIT TIMELINE & WORK LOG</span>
              <div className="space-y-3">
                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="p-3 bg-black/40 rounded-lg border border-zinc-800 font-mono text-xs space-y-1">
                    <div className="flex justify-between text-zinc-400">
                      <span className="text-emerald-400 font-bold">commit 0{idx + 1}a89f ({exp.company})</span>
                      <span>{exp.startDate} - {exp.isCurrent ? 'HEAD' : exp.endDate}</span>
                    </div>
                    <p className="text-zinc-200 font-bold">{exp.role}</p>
                    <p className="text-zinc-400 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Terminal Footer */}
        <div className="bg-[#171924] px-4 py-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-zinc-500">
          <span>STATUS: 200 OK • gitfolio.dev/{portfolio.slug}</span>
          <span className="text-emerald-400">⚡ UTF-8 Powered</span>
        </div>
      </div>
    </div>
  );
};
