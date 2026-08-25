import React, { useState } from 'react';
import { TEMPLATES } from '../../../data/mockSaasData';
import { TemplateId } from '../../../types/saas';
import { Check, Eye, ArrowRight, Sparkles } from 'lucide-react';

interface TemplatesViewProps {
  currentTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onPreviewTemplate: (templateId: TemplateId) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  currentTemplateId,
  onSelectTemplate,
  onPreviewTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'Clean', label: 'Minimal' },
    { id: 'Technical', label: 'Developer' },
    { id: 'Editorial', label: 'Editorial' },
    { id: 'Modern', label: 'Creative' },
    { id: 'Vibrant', label: 'Professional' },
    { id: 'Open Source', label: 'Dark' },
  ];

  const filteredTemplates = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight font-display">
          Portfolio Templates
        </h1>
        <p className="text-xs text-zinc-400">
          Select from 6 genuinely distinct layout architectures. Switch anytime without losing content.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-900 font-semibold shadow-sm'
                  : 'bg-[#18181b] text-zinc-400 hover:text-zinc-200 border border-[#27272a]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tmpl) => {
          const isSelected = currentTemplateId === tmpl.id;

          return (
            <div 
              key={tmpl.id}
              className={`bg-[#121215] rounded-xl overflow-hidden flex flex-col justify-between transition duration-200 border ${
                isSelected 
                  ? 'border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40' 
                  : 'border-[#27272a] hover:border-zinc-700'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative h-44 overflow-hidden bg-zinc-950">
                <img 
                  src={tmpl.thumbnail} 
                  alt={tmpl.name} 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition duration-300" 
                />
                
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-black/80 text-zinc-300 border border-zinc-700 uppercase">
                    {tmpl.category}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-white flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                )}
              </div>

              {/* Template Details */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-zinc-100 font-display">{tmpl.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{tmpl.description}</p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#27272a] flex items-center gap-2">
                  <button
                    onClick={() => onPreviewTemplate(tmpl.id)}
                    className="flex-1 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 border border-[#27272a] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => onSelectTemplate(tmpl.id)}
                    disabled={isSelected}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    <span>{isSelected ? 'Active' : 'Use Template'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
