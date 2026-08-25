import React, { useState } from 'react';
import { 
  PortfolioConfig, 
  PortfolioSection, 
  PortfolioThemeConfig 
} from '../../../types/saas';
import { TemplateRenderer } from '../../templates/TemplateRenderer';
import { 
  Eye, 
  EyeOff, 
  Sparkles, 
  Sliders, 
  Check, 
  Monitor, 
  Tablet, 
  Smartphone,
  RotateCcw,
  Palette,
  Type,
  Layers,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface BuilderViewProps {
  portfolio: PortfolioConfig;
  onUpdatePortfolio: (updatedFields: Partial<PortfolioConfig>) => void;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

export const BuilderView: React.FC<BuilderViewProps> = ({
  portfolio,
  onUpdatePortfolio,
  viewportMode: externalViewportMode = 'desktop',
}) => {
  const [internalViewportMode, setInternalViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const activeViewport = externalViewportMode || internalViewportMode;

  // Toggle Section Visibility
  const handleToggleSection = (sectionId: string) => {
    const updatedSections = portfolio.sections.map(s => 
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    onUpdatePortfolio({ sections: updatedSections });
  };

  // Reorder Sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...portfolio.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((s, idx) => { s.order = idx; });
    onUpdatePortfolio({ sections: newSections });
  };

  // Update Theme Config
  const handleUpdateTheme = (key: keyof PortfolioThemeConfig, value: any) => {
    onUpdatePortfolio({
      theme: {
        ...portfolio.theme,
        [key]: value,
      },
    });
  };

  const getViewportWidthClass = () => {
    switch (activeViewport) {
      case 'mobile': return 'max-w-[390px]';
      case 'tablet': return 'max-w-[768px]';
      case 'desktop':
      default: return 'w-full max-w-[1200px]';
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row overflow-hidden select-none bg-[#09090b] text-zinc-100 font-sans">
      
      {/* ========================================================================= */}
      {/* PANE 1: LEFT - SECTIONS MANAGER (260px) */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-64 bg-[#121215] border-r border-[#27272a] flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Sections</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">{portfolio.sections.filter(s => s.enabled).length} Enabled</span>
          </div>

          {/* Section List */}
          <div className="space-y-1.5">
            {portfolio.sections.map((sec, idx) => (
              <div 
                key={sec.id}
                className={`p-2.5 rounded-lg border transition flex items-center justify-between gap-2 text-xs ${
                  sec.enabled 
                    ? 'bg-[#18181b] border-[#27272a] text-zinc-100' 
                    : 'bg-zinc-950/40 border-zinc-800 text-zinc-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-[10px] font-mono text-zinc-500 w-4">{idx + 1}</span>
                  <span className="font-medium truncate">{sec.name}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveSection(idx, 'up')}
                    className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === portfolio.sections.length - 1}
                    onClick={() => handleMoveSection(idx, 'down')}
                    className="p-1 text-zinc-400 hover:text-zinc-100 disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleSection(sec.id)}
                    className={`p-1 rounded transition cursor-pointer ${
                      sec.enabled ? 'text-indigo-400 hover:bg-indigo-500/20' : 'text-zinc-500 hover:bg-zinc-800'
                    }`}
                    title={sec.enabled ? 'Disable section' : 'Enable section'}
                  >
                    {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </aside>

      {/* ========================================================================= */}
      {/* PANE 2: CENTER - LIVE INTERACTIVE PREVIEW CANVAS */}
      {/* ========================================================================= */}
      <main className="flex-1 bg-[#09090b] flex flex-col justify-between overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
          <div className={`${getViewportWidthClass()} transition-all duration-200 bg-[#09090b] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden min-h-[600px]`}>
            <TemplateRenderer portfolio={portfolio} isLivePreview={true} />
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* PANE 3: RIGHT - CUSTOMIZE CONTROL PANEL (280px) */}
      {/* ========================================================================= */}
      <aside className="w-full lg:w-72 bg-[#121215] border-l border-[#27272a] flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="p-4 space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">Customize</h3>
            </div>
          </div>

          {/* Bio & Title Fields */}
          <div className="space-y-3 text-xs">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Profile Identity</span>
            
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Main Title</label>
              <input
                type="text"
                value={portfolio.title}
                onChange={(e) => onUpdatePortfolio({ title: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#18181b] border border-[#27272a] focus:border-zinc-500 rounded text-zinc-100 text-xs outline-none font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Tagline</label>
              <input
                type="text"
                value={portfolio.tagline}
                onChange={(e) => onUpdatePortfolio({ tagline: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#18181b] border border-[#27272a] focus:border-zinc-500 rounded text-zinc-100 text-xs outline-none font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Bio Text</label>
              <textarea
                rows={3}
                value={portfolio.aboutText}
                onChange={(e) => onUpdatePortfolio({ aboutText: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-[#18181b] border border-[#27272a] focus:border-zinc-500 rounded text-zinc-100 text-xs outline-none font-sans resize-none"
              />
            </div>
          </div>

          {/* Typography Scale */}
          <div className="space-y-2 text-xs pt-3 border-t border-[#27272a]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Typography Scale</span>
            <div className="space-y-1">
              {(['Inter', 'Geist', 'JetBrains Mono', 'Plus Jakarta Sans'] as const).map((font) => (
                <button
                  key={font}
                  onClick={() => handleUpdateTheme('fontFamily', font as any)}
                  className={`w-full px-2.5 py-1.5 rounded text-left transition cursor-pointer flex items-center justify-between text-xs ${
                    portfolio.theme.fontFamily === font
                      ? 'bg-[#27272a] text-zinc-100 font-semibold'
                      : 'bg-[#18181b] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span style={{ fontFamily: font }}>{font}</span>
                  {portfolio.theme.fontFamily === font && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Accent Color */}
          <div className="space-y-2 text-xs pt-3 border-t border-[#27272a]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">Brand Accent Color</span>
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
                  className={`w-6 h-6 rounded-full transition cursor-pointer ${
                    portfolio.theme.primaryColor === c.hex ? 'ring-2 ring-zinc-100 scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
};
