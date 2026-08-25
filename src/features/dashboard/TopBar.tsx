import React from 'react';
import { 
  ExternalLink, 
  Sparkles, 
  Check, 
  Eye, 
  RotateCw, 
  Monitor, 
  Tablet, 
  Smartphone,
  Globe
} from 'lucide-react';
import { PortfolioConfig, SaaSUser } from '../../types/saas';

interface TopBarProps {
  portfolio: PortfolioConfig;
  user: SaaSUser;
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
  onPublish,
  isPublishing,
  onViewPublicPortfolio,
  onSyncGitHub,
  isSyncing,
  viewportMode = 'desktop',
  onSetViewportMode,
  showViewportControls = false,
}) => {
  return (
    <header className="h-16 border-b border-white/[0.08] bg-[#0c0e14]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      
      {/* Left: Status & Published URL */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-zinc-400 font-medium">Status:</span>
          <span className="text-white font-bold font-mono">
            {portfolio.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <button
          onClick={onViewPublicPortfolio}
          className="hidden sm:flex items-center gap-1 text-xs font-mono text-indigo-400 hover:text-indigo-300 font-semibold transition"
        >
          <span>gitfolio.dev/{portfolio.slug}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Device Viewport Controls (Visible on Builder view) */}
      {showViewportControls && onSetViewportMode && (
        <div className="hidden md:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => onSetViewportMode('desktop')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewportMode === 'desktop' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Desktop view"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSetViewportMode('tablet')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewportMode === 'tablet' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Tablet view"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSetViewportMode('mobile')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewportMode === 'mobile' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        
        {/* GitHub Sync Button */}
        <button
          onClick={onSyncGitHub}
          disabled={isSyncing}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
          <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync GitHub'}</span>
        </button>

        {/* Live Preview Button */}
        <button
          onClick={onViewPublicPortfolio}
          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>

        {/* Publish Changes Primary Button */}
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.35)] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Publish</span>
            </>
          )}
        </button>

      </div>
    </header>
  );
};
