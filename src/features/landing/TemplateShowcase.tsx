import React, { useState } from 'react';
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
    <section id="templates" className="py-24 bg-[#0c0d12]/70 border-y border-white/[0.08] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 font-bold">
            Curated Layout Systems
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            6 Genuinely Distinct Template Architectures
          </h2>
          <p className="text-sm text-zinc-400">
            No cookie-cutter themes. Each template features a completely unique layout, typographic scale, and structural paradigm.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tmpl) => (
            <div 
              key={tmpl.id}
              className="bg-[#12131a] border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl transition duration-300 group"
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
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/70 text-white border border-white/10 backdrop-blur-md">
                    {tmpl.category}
                  </span>
                </div>

                {tmpl.isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/80 text-white border border-indigo-400/40 backdrop-blur-md">
                      PRO TIER
                    </span>
                  </div>
                )}
              </div>

              {/* Template Meta */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-between">
                    <span>{tmpl.name}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tmpl.description}
                  </p>
                  <ul className="space-y-1 pt-2">
                    {tmpl.features.map((f, i) => (
                      <li key={i} className="text-[11px] text-zinc-400 flex items-center gap-1.5 font-mono">
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
                    className="flex-1 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => onSelectTemplate(tmpl.id)}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(99,102,241,0.3)] transition cursor-pointer"
                  >
                    <span>Use Template</span>
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
