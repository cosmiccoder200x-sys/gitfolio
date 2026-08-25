import React, { useState } from 'react';
import { PortfolioConfig } from '../../../types/saas';
import { Settings, User, Search, Shield, Save, Check, RefreshCw, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  portfolio: PortfolioConfig;
  onUpdatePortfolio: (updated: Partial<PortfolioConfig>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [slug, setSlug] = useState(portfolio.slug);
  const [seoTitle, setSeoTitle] = useState(portfolio.seoTitle);
  const [seoDescription, setSeoDescription] = useState(portfolio.seoDescription);
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
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Portfolio & SEO Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure search engine indexing, social meta tags, slug handles, and integrations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* URL Handle / Slug */}
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Public URL Slug</span>
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-zinc-400">gitfolio.dev Username Handle</label>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-mono text-zinc-400">
              <span>gitfolio.dev/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 bg-transparent text-white focus:outline-none font-bold text-sm"
              />
            </div>
            <p className="text-[11px] text-zinc-500">
              Only alphanumeric characters and hyphens allowed. Changing this will redirect existing links.
            </p>
          </div>
        </div>

        {/* SEO Meta Tags */}
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Search Engine Optimization (SEO) & OpenGraph</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">Meta Title Tag</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">Meta Description Tag</label>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs outline-none resize-none"
              />
            </div>

            {/* Google Search Result Mockup */}
            <div className="pt-2">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-2">Google Search Result Preview</span>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1 text-xs">
                <div className="text-zinc-400 text-[11px] font-mono">https://gitfolio.dev › {slug}</div>
                <div className="text-indigo-400 font-semibold text-sm hover:underline cursor-pointer truncate">
                  {seoTitle || 'Developer Portfolio'}
                </div>
                <div className="text-zinc-400 text-xs line-clamp-2">
                  {seoDescription || 'Full-stack software developer portfolio built with Gitfolio.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Party Analytics */}
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Third-Party Analytics</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-300 font-medium">Google Analytics 4 Measurement ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white text-xs font-mono outline-none"
            />
            <p className="text-[11px] text-zinc-500">
              Optional. We already track cookie-less visitor stats natively in Gitfolio.
            </p>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.35)] transition flex items-center gap-2 cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
