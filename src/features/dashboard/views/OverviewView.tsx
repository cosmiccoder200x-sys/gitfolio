import React from 'react';
import { 
  Globe, 
  Eye, 
  FolderGit2, 
  Star, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  BarChart3,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react';
import { PortfolioConfig, SaaSUser } from '../../../types/saas';
import { MOCK_VISITORS } from '../../../data/mockSaasData';

interface OverviewViewProps {
  portfolio: PortfolioConfig;
  user: SaaSUser;
  onNavigateTab: (tab: any) => void;
  onViewPublicPortfolio: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  portfolio,
  user,
  onNavigateTab,
  onViewPublicPortfolio,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://gitfolio.dev/${portfolio.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Your portfolio is live and accepting visitor traffic at <strong className="text-indigo-400">gitfolio.dev/{portfolio.slug}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
          </button>

          <button
            onClick={onViewPublicPortfolio}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.35)] transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row (4 High-Contrast Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Published URL & Status */}
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Portfolio Status</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="my-2">
            <span className="text-xs font-mono text-emerald-400 font-bold block">● Published to Edge</span>
            <span className="text-sm font-mono font-bold text-white truncate block">
              gitfolio.dev/{portfolio.slug}
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">SSL Encrypted • 99.9% Uptime</span>
        </div>

        {/* Card 2: Total Page Views */}
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Total Views</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-white font-mono">{portfolio.views.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">+18% this week</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">From GitHub, LinkedIn & Direct</span>
        </div>

        {/* Card 3: Featured Projects */}
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Featured Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-white font-mono">
              {portfolio.projects.filter(p => p.featured).length} / {portfolio.projects.length}
            </span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">
              Total Stars: <strong className="text-amber-400 font-mono">{portfolio.projects.reduce((acc, p) => acc + p.stars, 0)}</strong>
            </span>
          </div>
          <button 
            onClick={() => onNavigateTab('projects')}
            className="text-[11px] text-indigo-400 hover:underline font-semibold text-left"
          >
            Manage Projects &rarr;
          </button>
        </div>

        {/* Card 4: Active Template */}
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400">Active Layout</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-white capitalize">{portfolio.template}</span>
            <span className="text-[11px] text-zinc-400 block mt-0.5">Font: {portfolio.theme.fontFamily}</span>
          </div>
          <button 
            onClick={() => onNavigateTab('templates')}
            className="text-[11px] text-cyan-400 hover:underline font-semibold text-left"
          >
            Switch Template &rarr;
          </button>
        </div>

      </div>

      {/* 3. Middle Section: Quick Actions & Live Visitor Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Quick Actions (7 cols) */}
        <div className="lg:col-span-7 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Quick Customization Actions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div 
              onClick={() => onNavigateTab('builder')}
              className="p-4 bg-[#181a24] hover:bg-zinc-800/80 border border-white/[0.06] rounded-xl cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Visual Live Builder</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Reorder sections, update bio, tweak theme colors and typography.
              </p>
            </div>

            <div 
              onClick={() => onNavigateTab('projects')}
              className="p-4 bg-[#181a24] hover:bg-zinc-800/80 border border-white/[0.06] rounded-xl cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Curate Projects</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Feature top repositories, add custom demo links and image banners.
              </p>
            </div>

            <div 
              onClick={() => onNavigateTab('domains')}
              className="p-4 bg-[#181a24] hover:bg-zinc-800/80 border border-white/[0.06] rounded-xl cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Connect Custom Domain</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Use your own domain like <strong className="text-zinc-300">sreerang.dev</strong> with free SSL.
              </p>
            </div>

            <div 
              onClick={() => onNavigateTab('settings')}
              className="p-4 bg-[#181a24] hover:bg-zinc-800/80 border border-white/[0.06] rounded-xl cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">SEO & Social Meta</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Configure Open Graph preview images and Google search metadata.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Recent Visitors Feed (5 cols) */}
        <div className="lg:col-span-5 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Recent Visitors</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('analytics')}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              All Stats &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {MOCK_VISITORS.slice(0, 4).map((vis) => (
              <div key={vis.id} className="p-3 bg-[#181a24] rounded-xl border border-white/[0.04] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-semibold text-zinc-200">{vis.city}, {vis.country}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Via {vis.referrer}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 block">{vis.timestamp}</span>
                  <span className="text-[9px] text-zinc-500 font-mono capitalize">{vis.device}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
