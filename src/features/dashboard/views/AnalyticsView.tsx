import React from 'react';
import { PortfolioConfig } from '../../../types/saas';
import { MOCK_VISITORS } from '../../../data/mockSaasData';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Users, 
  Smartphone, 
  Monitor, 
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';

interface AnalyticsViewProps {
  portfolio: PortfolioConfig;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ portfolio }) => {
  const referrers = [
    { source: 'GitHub Profile README', views: 1240, percentage: 50 },
    { source: 'LinkedIn Resume Links', views: 680, percentage: 27 },
    { source: 'Twitter / X Tech Threads', views: 340, percentage: 14 },
    { source: 'Direct & Bookmark Traffic', views: 221, percentage: 9 },
  ];

  const countries = [
    { country: 'United States', code: 'US', count: 1120, pct: 45 },
    { country: 'United Kingdom', code: 'GB', count: 480, pct: 19 },
    { country: 'Germany', code: 'DE', count: 320, pct: 13 },
    { country: 'Canada', code: 'CA', count: 240, pct: 10 },
    { country: 'India & APAC', code: 'IN', count: 321, pct: 13 },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Visitor & Traffic Analytics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Privacy-friendly, zero-cookie analytics for gitfolio.dev/{portfolio.slug}
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400">Total Pageviews</span>
          <div className="text-3xl font-black text-white font-mono">{portfolio.views.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-400 font-mono">+24% vs last month</span>
        </div>

        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400">Unique Visitors</span>
          <div className="text-3xl font-black text-white font-mono">1,842</div>
          <span className="text-[11px] text-emerald-400 font-mono">74% Direct Engineers</span>
        </div>

        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400">Avg. Session Duration</span>
          <div className="text-3xl font-black text-white font-mono">2m 45s</div>
          <span className="text-[11px] text-zinc-400 font-mono">High Engagement</span>
        </div>

        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400">Project Click-Throughs</span>
          <div className="text-3xl font-black text-indigo-400 font-mono">612 CTR</div>
          <span className="text-[11px] text-zinc-400 font-mono">To GitHub / Live Demos</span>
        </div>

      </div>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Referrers (6 cols) */}
        <div className="lg:col-span-6 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Traffic Acquisition Sources
          </h3>

          <div className="space-y-4 pt-2">
            {referrers.map((ref) => (
              <div key={ref.source} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span className="font-semibold">{ref.source}</span>
                  <span className="font-mono text-zinc-400">{ref.views} views ({ref.percentage}%)</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-indigo-500 h-full rounded-full" 
                    style={{ width: `${ref.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Top Geographic Markets
          </h3>

          <div className="space-y-3 pt-2">
            {countries.map((c) => (
              <div key={c.country} className="flex items-center justify-between p-2.5 bg-[#181a24] rounded-xl border border-white/[0.04] text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 text-zinc-400 border border-white/[0.06]">
                    {c.code}
                  </span>
                  <span className="font-semibold text-white">{c.country}</span>
                </div>
                <div className="text-right font-mono text-zinc-400 text-xs">
                  <span>{c.count} visitors ({c.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Real-time Visitor Stream */}
      <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Visitor Stream</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] text-zinc-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2">Time</th>
                <th className="py-2">Location</th>
                <th className="py-2">Referrer</th>
                <th className="py-2">Device</th>
                <th className="py-2">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300 font-mono">
              {MOCK_VISITORS.map((v) => (
                <tr key={v.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3 text-emerald-400 font-bold">{v.timestamp}</td>
                  <td className="py-3">{v.city}, {v.country}</td>
                  <td className="py-3 text-zinc-400">{v.referrer}</td>
                  <td className="py-3 capitalize text-zinc-400">{v.device} ({v.browser})</td>
                  <td className="py-3">{v.durationSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
