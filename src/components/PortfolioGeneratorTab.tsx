import React, { useState } from 'react';
import { 
  Globe, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Code, 
  Eye, 
  Terminal, 
  Sparkles, 
  Palette, 
  Settings,
  Layers
} from 'lucide-react';
import { GitHubUser, GitHubRepo, ResumeData, PortfolioTheme, PortfolioSettings } from '../types';
import { generateStandalonePortfolioHtml } from '../lib/exportUtils';

interface PortfolioGeneratorTabProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  resume: ResumeData;
}

export const PortfolioGeneratorTab: React.FC<PortfolioGeneratorTabProps> = ({
  user,
  repos,
  resume,
}) => {
  const [theme, setTheme] = useState<PortfolioTheme>('professional');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [copiedHtml, setCopiedHtml] = useState(false);

  const [settings, setSettings] = useState<PortfolioSettings>({
    theme: 'professional',
    accentColor: '#3b82f6',
    showLanguageStats: true,
    showStarCount: true,
    showWorkExperience: true,
    showRecentActivity: true,
    customTagline: resume.personal.title || 'Senior Software Engineer & Distributed Systems Architect',
    contactEmail: resume.personal.email,
  });

  const generatedHtml = generateStandalonePortfolioHtml(user, repos, resume, theme, settings);

  const handleDownloadIndexHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generatedHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(generatedHtml);
      newWindow.document.close();
    }
  };

  const themes: {
    id: PortfolioTheme;
    name: string;
    tagline: string;
    desc: string;
    icon: string;
    previewBadge: string;
    colors: { bg: string; card: string; accent: string; text: string };
    font: string;
  }[] = [
    {
      id: 'minimalist',
      name: 'Minimalist',
      tagline: 'Clean Typographic Serenity',
      desc: 'Generous whitespace, editorial serif hierarchy, refined monochrome palette, and distraction-free portfolio aesthetics.',
      icon: '🪶',
      previewBadge: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700',
      colors: { bg: '#FAF9F6', card: '#FFFFFF', accent: '#18181B', text: '#09090B' },
      font: 'Playfair Display + Sans',
    },
    {
      id: 'professional',
      name: 'Professional',
      tagline: 'Enterprise Tech Executive',
      desc: 'Sleek dark slate frosted glass cards, vibrant cobalt accents, metric chips, and polished engineering leadership framing.',
      icon: '💼',
      previewBadge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      colors: { bg: '#0B0F19', card: '#111827', accent: '#3B82F6', text: '#F1F5F9' },
      font: 'Inter / Plus Jakarta',
    },
    {
      id: 'creative',
      name: 'Creative',
      tagline: 'Cyber Mesh & Gradient Glow',
      desc: 'Vibrant neon purple to pink-cyan gradient mesh, glowing interactive cards, bold geometric headings, and animated flair.',
      icon: '🎨',
      previewBadge: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      colors: { bg: '#090614', card: '#120D26', accent: '#A855F7', text: '#F5F3FF' },
      font: 'Space Grotesk Modern',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Action Bento Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
        
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="w-4 h-4" />
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Live Responsive Portfolio Generator
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time multi-theme portfolio generator with 1-click standalone HTML deployment for GitHub Pages & Vercel.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-800/60 border border-zinc-700/50 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'preview' ? 'bg-zinc-700 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live View</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition ${
                viewMode === 'code' ? 'bg-zinc-700 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </button>
          </div>

          <button
            onClick={handleOpenInNewTab}
            className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            title="Open preview in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Tab</span>
          </button>

          <button
            onClick={handleCopyHtml}
            className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHtml ? 'Copied HTML!' : 'Copy HTML'}</span>
          </button>

          <button
            onClick={handleDownloadIndexHtml}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download index.html</span>
          </button>
        </div>
      </div>

      {/* Visual Theme Picker Header & Bento Cards */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Select Visual Portfolio Style
            </h2>
            <span className="text-[11px] text-zinc-500 font-mono">
              (3 Distinct Layouts)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Active Style:</span>
            <span className="font-bold text-indigo-400 capitalize">{theme}</span>
          </div>
        </div>

        {/* 3 Theme Picker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {themes.map((t) => {
            const isSelected = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setSettings((prev) => ({
                    ...prev,
                    theme: t.id,
                    accentColor: t.colors.accent,
                  }));
                }}
                className={`group relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 backdrop-blur-sm flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-500/90 bg-zinc-900/95 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-2 ring-indigo-500/60 -translate-y-0.5'
                    : 'border-zinc-800/90 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/80'
                }`}
              >
                {/* Active Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div>
                  {/* Top Bar: Icon, Name, Badge */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${
                      isSelected ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-zinc-800/80 border-zinc-700/60'
                    }`}>
                      {t.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <span>{t.name}</span>
                      </h3>
                      <p className="text-[11px] font-medium text-indigo-400/90">{t.tagline}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {t.desc}
                  </p>
                </div>

                {/* Bottom Bar: Palette Swatches & Typography */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 font-medium">Palette:</span>
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-700/80 shadow-xs"
                        style={{ backgroundColor: t.colors.bg }}
                        title={`Background: ${t.colors.bg}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-700/80 shadow-xs"
                        style={{ backgroundColor: t.colors.card }}
                        title={`Card: ${t.colors.card}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-700/80 shadow-xs"
                        style={{ backgroundColor: t.colors.accent }}
                        title={`Accent: ${t.colors.accent}`}
                      />
                    </div>
                  </div>

                  <span className="text-zinc-500 font-mono text-[10px] bg-zinc-800/70 px-2 py-0.5 rounded border border-zinc-700/50">
                    {t.font}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Preview / Code View Container */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        
        {/* Device Frame Controls Bar (if in preview mode) */}
        <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-xs">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">Viewport:</span>
            <div className="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/40">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-md ${viewport === 'desktop' ? 'bg-zinc-700 text-indigo-400 shadow-xs' : 'text-zinc-400'}`}
                title="Desktop view"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-md ${viewport === 'tablet' ? 'bg-zinc-700 text-indigo-400 shadow-xs' : 'text-zinc-400'}`}
                title="Tablet view (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-md ${viewport === 'mobile' ? 'bg-zinc-700 text-indigo-400 shadow-xs' : 'text-zinc-400'}`}
                title="Mobile view (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-zinc-400 font-mono text-[11px] hidden sm:block">
            {viewport === 'desktop' ? '100% Full Width' : viewport === 'tablet' ? '768px Tablet' : '390px Mobile'}
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="bg-zinc-950 p-4 sm:p-6 flex justify-center min-h-[700px] overflow-x-auto">
          {viewMode === 'preview' ? (
            <div
              className={`transition-all duration-300 bg-white shadow-2xl rounded-xl overflow-hidden border border-zinc-800 ${
                viewport === 'desktop'
                  ? 'w-full'
                  : viewport === 'tablet'
                  ? 'w-[768px]'
                  : 'w-[390px] h-[780px]'
              }`}
            >
              <iframe
                title="Portfolio Live Preview"
                srcDoc={generatedHtml}
                className="w-full h-[750px] border-0"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            /* Code View */
            <div className="w-full bg-zinc-900 rounded-xl p-4 overflow-x-auto text-xs font-mono text-zinc-300 border border-zinc-800 max-h-[750px]">
              <pre>
                <code>{generatedHtml}</code>
              </pre>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
