import React from 'react';
import { Users, FolderGit2, Globe, ShieldCheck, Terminal, Cpu, Database, Cloud } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Portfolios Created', value: '14,280+', icon: Globe, subtext: 'Deployed across 120+ countries' },
    { label: 'Active Engineers', value: '52,410+', icon: Users, subtext: 'Staff, Open-Source & AI Leads' },
    { label: 'Repositories Index', value: '184,000+', icon: FolderGit2, subtext: 'Deep commit & star analytics' },
    { label: 'Edge Uptime SLA', value: '99.99%', icon: ShieldCheck, subtext: 'Zero-latency global CDN' },
  ];

  const partners = [
    'GITHUB OAUTH', 'VERCEL EDGE', 'SUPABASE', 'TYPESCRIPT', 'GO RAFTS', 
    'DOCKER', 'KUBERNETES', 'OPENAI', 'CLOUDFLARE', 'TAILWIND CSS', 'REACT 19'
  ];

  return (
    <section className="py-16 border-y border-white/[0.08] bg-[#0b0b0b] space-y-12">
      
      {/* Stat Counter Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1.5 p-4 rounded-2xl bg-[#12131a] border border-white/[0.06]">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-zinc-200">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#9A9A9A] font-mono">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APEX Marquee Track (Infinite Loop) */}
      <div className="overflow-hidden border-t border-white/[0.04] pt-8">
        <div className="eyebrow-label justify-center w-full mb-6">
          <span>POWERING TOP ENGINEER PORTFOLIOS WORLDWIDE</span>
        </div>

        <div className="flex w-[200%] animate-marquee select-none pointer-events-none">
          <div className="flex justify-around w-1/2 shrink-0 items-center gap-12 font-mono text-xs text-zinc-400 font-bold tracking-widest uppercase">
            {partners.map((p, i) => (
              <span key={i} className="flex items-center gap-2 hover:text-indigo-400 transition">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {p}
              </span>
            ))}
          </div>
          <div className="flex justify-around w-1/2 shrink-0 items-center gap-12 font-mono text-xs text-zinc-400 font-bold tracking-widest uppercase">
            {partners.map((p, i) => (
              <span key={`dup-${i}`} className="flex items-center gap-2 hover:text-indigo-400 transition">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};
