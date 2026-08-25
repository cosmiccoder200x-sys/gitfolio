import React from 'react';
import { TEMPLATES } from '../../data/mockSaasData';
import { TemplateId } from '../../types/saas';
import { Sparkles, ArrowRight, Eye, Check } from 'lucide-react';

interface TemplateShowcaseProps {
  onSelectTemplate: (templateId: TemplateId) => void;
  onPreviewTemplate: (templateId: TemplateId) => void;
}

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({
  onSelectTemplate,
  onPreviewTemplate,
}) => {
  return (
    <section id="templates" className="py-28 bg-[#0b0b0b] border-y border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* APEX Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="eyebrow-label">
            <span>CURATED LAYOUT SYSTEMS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl headline-editorial text-white tracking-tight">
            6 Distinct Architectures
          </h2>
          <p className="text-xs sm:text-sm text-[#9A9A9A]">
            No cookie-cutter themes. Each template features a completely unique layout, typographic scale, and structural paradigm.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div 
              key={tmpl.id}
              className="glass-panel hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lux transition duration-300 group"
            >
              {/* Thumbnail Container */}
              <div className="relative h-48 overflow-hidden bg-zinc-950">
                <img 
                  src={tmpl.thumbnail} 
                  alt={tmpl.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-black/30" />
                
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/70 text-white border border-white/10 backdrop-blur-md uppercase tracking-wider">
                    {tmpl.category}
                  </span>
                </div>

                {tmpl.isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-600 text-white border border-indigo-400/40 backdrop-blur-md uppercase tracking-wider">
                      PRO TIER
                    </span>
                  </div>
                )}
              </div>

              {/* Template Meta */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white font-display tracking-tight flex items-center justify-between">
                    <span>{tmpl.name}</span>
                  </h3>
                  <p className="text-xs text-[#9A9A9A] leading-relaxed">
                    {tmpl.description}
                  </p>
                  <ul className="space-y-1.5 pt-2">
                    {tmpl.features.map((f, i) => (
                      <li key={i} className="text-[11px] text-[#9A9A9A] flex items-center gap-1.5 font-mono">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2">
                  <button
                    onClick={() => onPreviewTemplate(tmpl.id)}
                    className="flex-1 py-2.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/[0.06]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>PREVIEW</span>
                  </button>
                  <button
                    onClick={() => onSelectTemplate(tmpl.id)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 shadow-glow-sm transition cursor-pointer"
                  >
                    <span>USE TEMPLATE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
