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
    <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-semibold">
          Platform Infrastructure
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineered for Developers
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-normal">
          Minimal friction. Maximum impact for software engineers and technical creators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div 
              key={idx}
              className="bg-[#12131a] border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-xl transition group hover:-translate-y-0.5 duration-200"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600/20 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500">
                <span>Production Standard</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
