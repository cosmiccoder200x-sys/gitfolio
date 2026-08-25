import React from 'react';
import { Github, Sliders, Rocket, Check, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStarted }) => {
  const steps = [
    {
      num: '01',
      title: 'Connect GitHub',
      description: 'Connect your GitHub account or enter your username. We automatically index repos, stars, commit activity, and primary languages.',
      icon: Github,
      tag: '1-Click Sync',
    },
    {
      num: '02',
      title: 'Customize in Live Builder',
      description: 'Select from 6 distinct developer templates. Reorder sections, feature key projects, tweak colors, typography, and experience timelines.',
      icon: Sliders,
      tag: 'Real-Time Editor',
    },
    {
      num: '03',
      title: 'Publish & Share',
      description: 'Deploy instantly to gitfolio.dev/yourname or your custom domain (e.g. yourname.dev) with automatic SSL and sub-second CDN speeds.',
      icon: Rocket,
      tag: 'Global Edge Deploy',
    },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-bold">
          Simple 3-Step Process
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How Gitfolio Works
        </h2>
        <p className="text-sm text-zinc-400">
          From raw GitHub repositories to a stunning live developer portfolio in under 2 minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div 
              key={step.num}
              className="bg-[#12131a] border border-white/[0.08] hover:border-indigo-500/40 rounded-2xl p-8 flex flex-col justify-between relative shadow-xl transition group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-zinc-600 group-hover:text-indigo-400 transition">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {step.tag}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600/20 transition">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.06] text-xs font-semibold text-indigo-400 flex items-center gap-1">
                <span>Step {step.num} Ready</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onGetStarted}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(99,102,241,0.35)] transition inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Start Building Your Portfolio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
