import React from 'react';
import { 
  Github, 
  Sparkles, 
  Layers, 
  Sliders, 
  Globe, 
  BarChart3, 
  Search, 
  Smartphone 
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: Github,
      title: 'GitHub Core Indexing',
      desc: 'Synchronizes repositories, stars, commit volume, primary languages, and verified social handles.',
    },
    {
      icon: Sparkles,
      title: 'Algorithmic Repo Curation',
      desc: 'Scores repositories based on star velocity, recency, documentation, and activity.',
    },
    {
      icon: Layers,
      title: '6 Distinct Architectures',
      desc: 'Minimal, Terminal, Bento, Editorial, Gradient, and Open Source structural paradigms.',
    },
    {
      icon: Sliders,
      title: '3-Pane Visual Builder',
      desc: 'Real-time section toggling, reordering, custom color schemes, and font customization.',
    },
    {
      icon: Globe,
      title: 'Custom Domains & SSL',
      desc: 'Connect your personal domain with edge routing and automated SSL certificates.',
    },
    {
      icon: BarChart3,
      title: 'Cookie-Less Analytics',
      desc: 'Monitor pageviews, country breakdown, traffic acquisition channels, and project CTRs.',
    },
    {
      icon: Search,
      title: 'ATS & SEO Optimized',
      desc: 'Generates semantic markup, Open Graph tags, Twitter cards, and structured JSON-LD data.',
    },
    {
      icon: Smartphone,
      title: 'Responsive & Performant',
      desc: 'Optimized layouts for mobile devices, tablets, and high-resolution displays.',
    },
  ];

  return (
    <section id="features" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 bg-[#0b0b0b]">
      
      {/* APEX Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="eyebrow-label">
          <span>PLATFORM CAPABILITIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl headline-editorial text-white tracking-tight">
          Engineered for Developers
        </h2>
        <p className="text-xs sm:text-sm text-[#9A9A9A] font-normal">
          Minimal friction. Maximum impact for software engineers and technical creators.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div 
              key={idx}
              className="glass-panel hover:border-indigo-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-lux transition group hover:-translate-y-1 duration-300"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600/20 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base font-display tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#9A9A9A] leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500 flex items-center justify-between uppercase">
                <span>SYSTEM STD</span>
                <span className="text-indigo-400">0{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
