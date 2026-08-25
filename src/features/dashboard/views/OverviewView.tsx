import React, { useState } from 'react';
import { SaaSUser, PortfolioConfig, DashboardTabId } from '../../../types/saas';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  FolderGit2, 
  Globe, 
  BarChart3, 
  Layers,
  ArrowRight,
  TrendingUp,
  Eye,
  MousePointer,
  Clock
} from 'lucide-react';

interface OverviewViewProps {
  user: SaaSUser;
  portfolio: PortfolioConfig;
  onNavigateTab: (tab: DashboardTabId) => void;
  onViewPublic: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  user,
  portfolio,
  onNavigateTab,
  onViewPublic,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    const url = portfolio.customDomain
      ? `https://${portfolio.customDomain}`
      : `https://gitfolio.dev/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto animate-fadeIn font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight font-display">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Here is an overview of your portfolio status, traffic metrics, and workspace configuration.
        </p>
      </div>

      {/* Portfolio Primary Status Card */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                {portfolio.isPublished ? 'Published' : 'Draft Mode'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-100 font-display">
              {portfolio.title}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">
              gitfolio.dev/{portfolio.slug}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 border border-[#27272a] rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('builder')}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Edit Portfolio</span>
            </button>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#27272a] text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 font-mono block">Active Template</span>
            <span className="font-semibold text-zinc-200 capitalize">{portfolio.templateId}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 font-mono block">Custom Domain</span>
            <span className="font-semibold text-zinc-200">
              {portfolio.customDomain || 'Not configured'}
            </span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 font-mono block">Last Updated</span>
            <span className="font-semibold text-zinc-200">Just now</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase text-zinc-500 font-semibold tracking-wider">
          Performance & Interactions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Pageviews</span>
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-100 font-mono">{portfolio.views.toLocaleString()}</div>
            <span className="text-[10px] text-emerald-400 font-mono">+18% this week</span>
          </div>

          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Unique Visitors</span>
              <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-100 font-mono">1,842</div>
            <span className="text-[10px] text-zinc-400 font-mono">Direct & GitHub</span>
          </div>

          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Project Clicks</span>
              <MousePointer className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-100 font-mono">612</div>
            <span className="text-[10px] text-zinc-400 font-mono">To GitHub & Demos</span>
          </div>

          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>Avg. Duration</span>
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-100 font-mono">2m 45s</div>
            <span className="text-[10px] text-zinc-400 font-mono">High Engagement</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid (3-4 concise actions) */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase text-zinc-500 font-semibold tracking-wider">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button
            onClick={() => onNavigateTab('builder')}
            className="p-4 bg-[#121215] hover:bg-[#18181b] border border-[#27272a] hover:border-zinc-700 rounded-xl text-left transition group cursor-pointer space-y-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h4 className="font-semibold text-zinc-100 text-xs group-hover:text-white transition">Visual Builder</h4>
            <p className="text-[11px] text-zinc-400">Customize sections, typography, and theme.</p>
          </button>

          <button
            onClick={() => onNavigateTab('projects')}
            className="p-4 bg-[#121215] hover:bg-[#18181b] border border-[#27272a] hover:border-zinc-700 rounded-xl text-left transition group cursor-pointer space-y-2"
          >
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-zinc-100 text-xs group-hover:text-white transition">Manage Projects</h4>
            <p className="text-[11px] text-zinc-400">Curate featured repos and bullet points.</p>
          </button>

          <button
            onClick={() => onNavigateTab('domains')}
            className="p-4 bg-[#121215] hover:bg-[#18181b] border border-[#27272a] hover:border-zinc-700 rounded-xl text-left transition group cursor-pointer space-y-2"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <h4 className="font-semibold text-zinc-100 text-xs group-hover:text-white transition">Custom Domain</h4>
            <p className="text-[11px] text-zinc-400">Connect your custom apex domain.</p>
          </button>

          <button
            onClick={() => onNavigateTab('analytics')}
            className="p-4 bg-[#121215] hover:bg-[#18181b] border border-[#27272a] hover:border-zinc-700 rounded-xl text-left transition group cursor-pointer space-y-2"
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <h4 className="font-semibold text-zinc-100 text-xs group-hover:text-white transition">View Analytics</h4>
            <p className="text-[11px] text-zinc-400">Check traffic channels and referrers.</p>
          </button>

        </div>
      </div>

    </div>
  );
};
