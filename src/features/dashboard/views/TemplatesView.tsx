import React from 'react';
import { TEMPLATES } from '../../../data/mockSaasData';
import { PortfolioConfig, TemplateId } from '../../../types/saas';
import { Check, Sparkles, Layers, ArrowRight } from 'lucide-react';

interface TemplatesViewProps {
  portfolio: PortfolioConfig;
  onSelectTemplate: (templateId: TemplateId) => void;
  onNavigateToBuilder: () => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  portfolio,
  onSelectTemplate,
  onNavigateToBuilder,
}) => {
  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Template Architecture Gallery
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Switch your portfolio layout instantly with 1-click. All your content, projects, and bio are preserved.
          </p>
        </div>

        <button
          onClick={onNavigateToBuilder}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.35)]"
        >
          <span>Open Live Builder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => {
          const isActive = portfolio.template === tmpl.id;

          return (
            <div 
              key={tmpl.id}
              className={`bg-[#12131a] rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl transition duration-300 ${
                isActive 
                  ? 'border-2 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)]' 
                  : 'border border-white/[0.08] hover:border-zinc-700'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-zinc-950">
                <img 
                  src={tmpl.thumbnail} 
                  alt={tmpl.name} 
                  className="w-full h-full object-cover opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-black/40" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/70 text-white border border-white/10">
                    {tmpl.category}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-black border border-emerald-400">
                      CURRENT ACTIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{tmpl.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{tmpl.description}</p>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  {isActive ? (
                    <div className="w-full py-2.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Active on gitfolio.dev/{portfolio.slug}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onSelectTemplate(tmpl.id)}
                      className="w-full py-2.5 bg-zinc-800 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                      <span>Apply {tmpl.name} Template</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
