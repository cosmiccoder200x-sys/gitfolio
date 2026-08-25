import React, { useState } from 'react';
import { SHOWCASE_ITEMS } from '../../data/mockSaasData';
import { Star, ExternalLink, ArrowRight } from 'lucide-react';

interface CommunityShowcaseProps {
  onViewShowcaseProfile: (username: string) => void;
}

export const CommunityShowcase: React.FC<CommunityShowcaseProps> = ({
  onViewShowcaseProfile,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'ALL PORTFOLIOS' },
    { id: 'web', label: 'FULL-STACK WEB' },
    { id: 'ai', label: 'AI / ML' },
    { id: 'data', label: 'DATA SYSTEMS' },
    { id: 'opensource', label: 'OPEN SOURCE' },
    { id: 'student', label: 'STUDENTS' },
    { id: 'designer', label: 'DESIGN ENGINEERS' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? SHOWCASE_ITEMS 
    : SHOWCASE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="showcase" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 bg-[#0b0b0b]">
      
      {/* APEX Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="eyebrow-label">
          <span>COMMUNITY SHOWCASE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl headline-editorial text-white tracking-tight">
          Built by Engineers Worldwide
        </h2>
        <p className="text-xs sm:text-sm text-[#9A9A9A]">
          Explore live developer portfolios deployed on gitfolio.dev across technical specialties.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-900 font-bold shadow-lux'
                  : 'bg-[#12131a] text-zinc-400 hover:text-white border border-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* APEX Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onViewShowcaseProfile(item.username)}
            className="glass-panel card-lux rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between group"
          >
            {/* Image Container with APEX Grayscale -> Color Hover */}
            <div className="relative h-44 overflow-hidden bg-zinc-950">
              <img 
                src={item.previewUrl} 
                alt={item.name} 
                className="w-full h-full object-cover img-editorial opacity-90 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-black/80 text-indigo-300 border border-white/10 uppercase">
                  {item.template}
                </span>
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-white/10">
                  <Star className="w-3 h-3 fill-current" />
                  {item.stars}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full border border-indigo-500/30 object-cover" 
                />
                <div>
                  <h4 className="font-bold text-white text-sm font-display group-hover:text-indigo-400 transition">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#9A9A9A] font-mono">
                    gitfolio.dev/{item.username}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-medium">
                {item.role}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                {item.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-white/[0.06]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-indigo-400 font-bold font-mono">
              <span>VIEW PORTFOLIO</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
