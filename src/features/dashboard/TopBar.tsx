import React, { useState } from 'react';
import { 
  ExternalLink, 
  Check, 
  Eye, 
  RotateCw, 
  Monitor, 
  Tablet, 
  Smartphone,
  ChevronRight,
  Share2
} from 'lucide-react';
import { PortfolioConfig, SaaSUser, DashboardTabId } from '../../types/saas';

interface TopBarProps {
  portfolio: PortfolioConfig;
  user: SaaSUser;
  activeTab: DashboardTabId;
  onPublish: () => void;
  isPublishing: boolean;
  onViewPublicPortfolio: () => void;
  onSyncGitHub: () => void;
  isSyncing: boolean;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
  onSetViewportMode?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  showViewportControls?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  portfolio,
  user,
  activeTab,
  onPublish,
  isPublishing,
  onViewPublicPortfolio,
  onSyncGitHub,
  isSyncing,
  viewportMode = 'desktop',
  onSetViewportMode,
  showViewportControls = false,
}) => {
  const [showPublishedToast, setShowPublishedToast] = useState(false);

  const formatTabTitle = (tab: DashboardTabId) => {
    switch (tab) {
      case 'overview': return 'Overview';
      case 'builder': return 'Portfolio Builder';
      case 'projects': return 'Projects';
      case 'templates': return 'Templates';
      case 'analytics': return 'Analytics';
      case 'domains': return 'Custom Domains';
      case 'settings': return 'Settings & SEO';
      case 'admin': return 'Admin Governance';
      case 'resume': return 'Resume Builder';
      case 'ats': return 'ATS Scanner';
      case 'ai-assistant': return 'AI Assistant';
      case 'interview-simulator': return 'Interview Simulator';
      default: return 'Workspace';
    }
  };

  const handlePublishClick = () => {
    onPublish();
    setShowPublishedToast(true);
    setTimeout(() => setShowPublishedToast(false), 4000);
  };

  return (
    <header className="h-14 border-b border-[#27272a] bg-[#121215] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 font-sans">
      
      {/* Left: Contextual Breadcrumb & Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
          <span className="text-zinc-300 font-semibold">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-100 font-medium">{formatTabTitle(activeTab)}</span>
        </div>

        {/* Quiet Draft Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-[11px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{portfolio.isPublished ? 'Live' : 'Draft saved'}</span>
        </div>
      </div>

      {/* Center: Device Viewport Controls (Visible on Builder view) */}
      {showViewportControls && onSetViewportMode && (
        <div className="hidden md:flex items-center gap-1 bg-[#18181b] p-0.5 rounded-lg border border-[#27272a]">
          <button
            onClick={() => onSetViewportMode('desktop')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewportMode === 'desktop' ? 'bg-[#27272a] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Desktop view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetViewportMode('tablet')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewportMode === 'tablet' ? 'bg-[#27272a] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Tablet view"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSetViewportMode('mobile')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewportMode === 'mobile' ? 'bg-[#27272a] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        
        {/* GitHub Sync Utility */}
        <button
          onClick={onSyncGitHub}
          disabled={isSyncing}
          className="px-2.5 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 border border-[#27272a] rounded-lg text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-zinc-100' : 'text-zinc-400'}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
        </button>

        {/* Secondary: Preview */}
        <button
          onClick={onViewPublicPortfolio}
          className="px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border border-[#27272a] rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-zinc-400" />
          <span>Preview</span>
        </button>

        {/* Primary: Publish */}
        <button
          onClick={handlePublishClick}
          disabled={isPublishing}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <span>Publish</span>
          )}
        </button>

      </div>

      {/* Clean Publish Toast Feedback */}
      {showPublishedToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#18181b] border border-[#27272a] rounded-lg p-3 shadow-2xl flex items-center gap-3 animate-fadeIn text-xs text-zinc-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <p className="font-semibold text-zinc-100">Portfolio Published</p>
            <p className="text-[11px] text-zinc-400 font-mono">gitfolio.dev/{portfolio.slug}</p>
          </div>
          <button
            onClick={onViewPublicPortfolio}
            className="px-2.5 py-1 bg-[#27272a] hover:bg-zinc-700 text-zinc-100 rounded text-[11px] font-medium transition cursor-pointer ml-2"
          >
            View
          </button>
        </div>
      )}

    </header>
  );
};
