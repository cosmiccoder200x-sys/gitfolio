import React, { useState } from 'react';
import { PortfolioConfig } from '../../../types/saas';
import { Settings, User, Search, Save, Check, Shield, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  portfolio: PortfolioConfig;
  onUpdatePortfolio: (updated: Partial<PortfolioConfig>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [slug, setSlug] = useState(portfolio.slug);
  const [seoTitle, setSeoTitle] = useState(portfolio.seoTitle || portfolio.title);
  const [seoDescription, setSeoDescription] = useState(portfolio.seoDescription || portfolio.tagline);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(portfolio.googleAnalyticsId || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePortfolio({
      slug,
      seoTitle,
      seoDescription,
      googleAnalyticsId,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto animate-fadeIn font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight font-display">
          Settings & SEO
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure portfolio handle, search engine indexing, OpenGraph metadata, and integrations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile & URL Handle */}
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Public URL Handle</span>
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-zinc-300 font-medium">gitfolio.dev Username Handle</label>
            <div className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs font-mono text-zinc-400">
              <span>gitfolio.dev/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 bg-transparent text-zinc-100 focus:outline-none font-bold text-xs"
              />
            </div>
          </div>
        </div>

        {/* SEO Meta Tags */}
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>SEO & OpenGraph Metadata</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Meta Title Tag</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] focus:border-zinc-500 rounded text-zinc-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Meta Description Tag</label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] focus:border-zinc-500 rounded text-zinc-100 outline-none resize-none"
              />
            </div>

            {/* Google Search Result Preview */}
            <div className="pt-2">
              <span className="text-[10px] text-zinc-500 font-mono block mb-1">Search Result Preview</span>
              <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-lg space-y-0.5">
                <div className="text-zinc-400 text-[10px] font-mono">https://gitfolio.dev › {slug}</div>
                <div className="text-indigo-400 font-semibold text-xs truncate">
                  {seoTitle || 'Developer Portfolio'}
                </div>
                <div className="text-zinc-400 text-[11px] line-clamp-2">
                  {seoDescription || 'Full-stack software developer portfolio built with Gitfolio.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Integrations</span>
          </h3>

          <div className="space-y-1 text-xs">
            <label className="text-zinc-300 font-medium">Google Analytics 4 Measurement ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              className="w-full px-3 py-2 bg-[#18181b] border border-[#27272a] focus:border-zinc-500 rounded text-zinc-100 text-xs font-mono outline-none"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#121215] border border-rose-900/30 rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Danger Zone</span>
          </h3>

          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-zinc-200">Unpublish Portfolio</p>
              <p className="text-[11px] text-zinc-500">Temporarily take your portfolio offline.</p>
            </div>
            <button
              type="button"
              onClick={() => onUpdatePortfolio({ isPublished: false })}
              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded text-xs font-semibold transition cursor-pointer"
            >
              Unpublish
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved Changes</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
