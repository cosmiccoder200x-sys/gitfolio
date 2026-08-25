import React, { useState } from 'react';
import { 
  PortfolioConfig, 
  PortfolioSection, 
  PortfolioThemeConfig 
} from '../../../types/saas';
import { TemplateRenderer } from '../../templates/TemplateRenderer';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Sliders, 
  Check, 
  Monitor, 
  Tablet, 
  Smartphone,
  Save,
  RotateCcw,
  Palette,
  Type,
  Layout,
  Layers
} from 'lucide-react';

interface BuilderViewProps {
  portfolio: PortfolioConfig;
  onUpdatePortfolio: (newConfig: PortfolioConfig) => void;
  onPublish: () => void;
}

export const BuilderView: React.FC<BuilderViewProps> = ({
  portfolio,
  onUpdatePortfolio,
  onPublish,
}) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'content' | 'theme'>('sections');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedSection, setSelectedSection] = useState<string>('hero');

  // Toggle Section Visibility
  const handleToggleSection = (sectionId: string) => {
    const updatedSections = portfolio.sections.map(s => 
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    onUpdatePortfolio({ ...portfolio, sections: updatedSections });
  };

  // Reorder Sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...portfolio.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // update order numbers
    newSections.forEach((s, idx) => { s.order = idx; });
    onUpdatePortfolio({ ...portfolio, sections: newSections });
  };

  // Update Theme Config
  const handleUpdateTheme = (key: keyof PortfolioThemeConfig, value: any) => {
    onUpdatePortfolio({
      ...portfolio,
      theme: {
        ...portfolio.theme,
        [key]: value,
      },
    });
  };

  const getViewportWidthClass = () => {
    switch (viewportMode) {
      case 'mobile': return 'max-w-[390px]';
      case 'tablet': return 'max-w-[768px]';
      case 'desktop':
      default: return 'w-full';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden select-none bg-[#0a0a0c]">
      
      {/* ========================================================================= */}
      {/* LEFT PANE: Editor Controls (320px) */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-80 bg-[#0e1017] border-r border-white/[0.08] flex flex-col justify-between shrink-0 overflow-y-auto">
        
        {/* Navigation Subtabs */}
        <div className="p-3 border-b border-white/[0.08] flex items-center gap-1 bg-black/30">
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'sections' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sections</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'content' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Content</span>
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'theme' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme</span>
          </button>
        </div>

        {/* Tab 1: Section Structure & Reordering */}
        {activeTab === 'sections' && (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Layout Structure</h3>
              <p className="text-[11px] text-zinc-500">Toggle or reorder portfolio sections</p>
            </div>

            <div className="space-y-2">
              {portfolio.sections.map((sec, idx) => (
                <div 
                  key={sec.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                    sec.enabled 
                      ? 'bg-[#141620] border-white/[0.08] text-white' 
                      : 'bg-black/30 border-white/[0.04] text-zinc-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-600">0{idx + 1}</span>
                    <span className="text-xs font-semibold">{sec.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Reorder Buttons */}
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === portfolio.sections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move down"
                    >
                      ▼
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => handleToggleSection(sec.id)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        sec.enabled ? 'text-indigo-400 hover:bg-indigo-500/20' : 'text-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Bio & Content Form Fields */}
        {activeTab === 'content' && (
          <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs text-zinc-300">
            <div className="space-y-1">
              <h3 className="font-bold uppercase tracking-wider text-zinc-400">Headlines & Bio</h3>
              <p className="text-[11px] text-zinc-500">Edit primary profile text</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Main Title</label>
                <input
                  type="text"
                  value={portfolio.title}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Tagline</label>
                <input
                  type="text"
                  value={portfolio.tagline}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-400">About & Bio</label>
                <textarea
                  rows={4}
                  value={portfolio.aboutText}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, aboutText: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-zinc-400">Contact Email</label>
                <input
                  type="email"
                  value={portfolio.socialLinks.email || ''}
                  onChange={(e) => onUpdatePortfolio({
                    ...portfolio,
                    socialLinks: { ...portfolio.socialLinks, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Visual Theme Customization */}
        {activeTab === 'theme' && (
          <div className="p-4 space-y-5 flex-1 overflow-y-auto text-xs text-zinc-300">
            <div className="space-y-1">
              <h3 className="font-bold uppercase tracking-wider text-zinc-400">Theme Styling</h3>
              <p className="text-[11px] text-zinc-500">Fine-tune fonts, palettes, and shapes</p>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="block font-semibold text-zinc-400">Typography Scale</label>
              <div className="grid grid-cols-1 gap-1.5">
                {(['Inter', 'Geist', 'JetBrains Mono', 'Playfair Display', 'Plus Jakarta Sans'] as const).map((font) => (
                  <button
                    key={font}
                    onClick={() => handleUpdateTheme('fontFamily', font)}
                    className={`px-3 py-2 rounded-xl text-left font-medium transition cursor-pointer flex items-center justify-between ${
                      portfolio.theme.fontFamily === font 
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40' 
                        : 'bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span style={{ fontFamily: font }}>{font}</span>
                    {portfolio.theme.fontFamily === font && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div className="space-y-2">
              <label className="block font-semibold text-zinc-400">Primary Accent</label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Indigo', hex: '#6366f1' },
                  { name: 'Emerald', hex: '#10b981' },
                  { name: 'Cyan', hex: '#06b6d4' },
                  { name: 'Amber', hex: '#f59e0b' },
                  { name: 'Rose', hex: '#f43f5e' },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleUpdateTheme('primaryColor', c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition cursor-pointer ${
                      portfolio.theme.primaryColor === c.hex ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <label className="block font-semibold text-zinc-400">Card Rounding</label>
              <div className="grid grid-cols-4 gap-1">
                {(['sm', 'md', 'lg', 'full'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleUpdateTheme('borderRadius', r)}
                    className={`py-1.5 rounded-lg font-mono uppercase text-[10px] transition cursor-pointer text-center ${
                      portfolio.theme.borderRadius === r 
                        ? 'bg-zinc-800 text-white font-bold border border-zinc-700' 
                        : 'bg-zinc-950 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </aside>

      {/* ========================================================================= */}
      {/* CENTER PANE: Live Interactive Portfolio Viewport */}
      {/* ========================================================================= */}
      <main className="flex-1 bg-[#07080b] flex flex-col justify-between overflow-hidden">
        
        {/* Device Switcher Header */}
        <div className="h-11 border-b border-white/[0.06] bg-[#0c0e14]/80 px-4 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-zinc-500">Viewport:</span>
            <span className="font-bold text-zinc-300 capitalize">{viewportMode}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/[0.06]">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewportMode === 'desktop' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('tablet')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewportMode === 'tablet' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-md transition cursor-pointer ${
                viewportMode === 'mobile' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Render Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div className={`${getViewportWidthClass()} transition-all duration-300 bg-[#0a0a0c] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden min-h-[600px]`}>
            <TemplateRenderer portfolio={portfolio} isLivePreview={true} />
          </div>
        </div>

      </main>

    </div>
  );
};
