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
    { id: 'all', label: 'All Portfolios' },
    { id: 'web', label: 'Web Developer' },
    { id: 'ai', label: 'AI / ML' },
    { id: 'data', label: 'Data Science' },
    { id: 'opensource', label: 'Open Source' },
    { id: 'student', label: 'Student' },
    { id: 'designer', label: 'Designer / Dev' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? SHOWCASE_ITEMS 
    : SHOWCASE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="showcase" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-bold">
          Community Showcase
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Built by Top Engineers Worldwide
        </h2>
        <p className="text-sm text-zinc-400">
          Explore live developer portfolios deployed on gitfolio.dev across diverse technical specialties.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-zinc-100 text-zinc-900 font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onViewShowcaseProfile(item.username)}
            className="bg-[#12131a] border border-white/[0.08] hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer transition duration-300 group shadow-xl flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden bg-zinc-950">
              <img 
                src={item.previewUrl} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12131a] via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-indigo-300 border border-white/10 uppercase">
                  {item.template}
                </span>
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded border border-white/10">
                  <Star className="w-3 h-3 fill-current" />
                  {item.stars}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full border border-indigo-500/30 object-cover" 
                />
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    gitfolio.dev/{item.username}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-medium">
                {item.role}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-indigo-400 font-semibold font-mono">
              <span>View Live Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
