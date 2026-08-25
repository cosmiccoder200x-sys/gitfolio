import React, { useState } from 'react';
import { PortfolioConfig } from '../../types/saas';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { Sparkles, ArrowLeft, Share2, Check, ExternalLink } from 'lucide-react';

interface PublicPortfolioPageProps {
  portfolio: PortfolioConfig;
  onBackToDashboard: () => void;
}

export const PublicPortfolioPage: React.FC<PublicPortfolioPageProps> = ({
  portfolio,
  onBackToDashboard,
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = portfolio.customDomain
      ? `https://${portfolio.customDomain}`
      : `https://gitfolio.dev/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      
      {/* Floating Control Bar for Owner / Visitor */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#12131a]/90 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-2xl animate-fadeIn">
        <button
          onClick={onBackToDashboard}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full text-xs font-semibold flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={handleShare}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition shadow-[0_0_15px_rgba(99,102,241,0.4)] cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Link!' : 'Share'}</span>
        </button>
      </div>

      {/* Actual Rendered Portfolio Template */}
      <TemplateRenderer portfolio={portfolio} />

      {/* Floating "Powered by Gitfolio" Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="https://github.com/cosmiccoder200x-sys/gitfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-full bg-[#12131a]/95 backdrop-blur-md border border-white/10 text-[11px] text-zinc-400 hover:text-white font-mono flex items-center gap-2 shadow-2xl transition group hover:border-indigo-500/50"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span>Built with <strong className="text-white">Gitfolio SaaS</strong></span>
        </a>
      </div>

    </div>
  );
};
