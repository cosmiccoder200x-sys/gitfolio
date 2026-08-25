import React from 'react';
import { Users, FolderGit2, Globe, ShieldCheck } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    { label: 'Portfolios Created', value: '10,000+', icon: Globe, subtext: 'Worldwide across 120+ countries' },
    { label: 'Active Developers', value: '50,000+', icon: Users, subtext: 'Students, Staff & Freelancers' },
    { label: 'Repositories Analyzed', value: '100,000+', icon: FolderGit2, subtext: 'Deep AST & star analytics' },
    { label: 'Edge Uptime SLA', value: '99.99%', icon: ShieldCheck, subtext: 'Global Cloudflare CDN' },
  ];

  return (
    <section className="py-12 border-y border-white/[0.08] bg-[#0c0d12]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="space-y-1 p-3">
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight font-mono">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-300">
                  {stat.label}
                </div>
                <div className="text-[11px] text-zinc-500 hidden sm:block">
                  {stat.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
