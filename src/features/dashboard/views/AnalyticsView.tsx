import React from 'react';
import { PortfolioConfig } from '../../../types/saas';
import { MOCK_VISITORS } from '../../../data/mockSaasData';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Users, 
  Eye, 
  MousePointer, 
  Clock 
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
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto animate-fadeIn font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight font-display">
          Analytics & Traffic
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Privacy-friendly, zero-cookie visitor analytics for gitfolio.dev/{portfolio.slug}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Total Pageviews</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono">{portfolio.views.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-400 font-mono">+24% vs last month</span>
        </div>

        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Unique Visitors</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono">1,842</div>
          <span className="text-[10px] text-zinc-400 font-mono">74% Direct Engineers</span>
        </div>

        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Avg. Session Duration</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono">2m 45s</div>
          <span className="text-[10px] text-zinc-400 font-mono">High Engagement</span>
        </div>

        <div className="bg-[#121215] border border-[#27272a] rounded-xl p-4 space-y-1">
          <span className="text-xs text-zinc-400 font-medium">Project Click-Throughs</span>
          <div className="text-2xl font-bold text-indigo-400 font-mono">612 CTR</div>
          <span className="text-[10px] text-zinc-400 font-mono">To GitHub / Live Demos</span>
        </div>

      </div>

      {/* Breakdowns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Referrers */}
        <div className="lg:col-span-6 bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400 tracking-wider">
            Traffic Channels
          </h3>

          <div className="space-y-3 pt-1">
            {referrers.map((ref) => (
              <div key={ref.source} className="space-y-1 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>{ref.source}</span>
                  <span className="font-mono text-zinc-400">{ref.views} ({ref.percentage}%)</span>
                </div>
                <div className="w-full bg-[#18181b] h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="bg-indigo-500 h-full rounded-full" 
                    style={{ width: `${ref.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="lg:col-span-6 bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400 tracking-wider">
            Top Markets
          </h3>

          <div className="space-y-2.5 pt-1">
            {countries.map((c) => (
              <div key={c.country} className="flex items-center justify-between p-2 bg-[#18181b] rounded-lg border border-[#27272a] text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {c.code}
                  </span>
                  <span className="font-medium text-zinc-200">{c.country}</span>
                </div>
                <span className="font-mono text-zinc-400 text-xs">{c.count} ({c.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Visitor Stream */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Recent Visitor Events</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-[#27272a] text-zinc-500 uppercase text-[10px]">
              <tr>
                <th className="py-2">Time</th>
                <th className="py-2">Location</th>
                <th className="py-2">Referrer</th>
                <th className="py-2">Device</th>
                <th className="py-2">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] text-zinc-300">
              {MOCK_VISITORS.map((v) => (
                <tr key={v.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-2.5 text-zinc-400">{v.timestamp}</td>
                  <td className="py-2.5">{v.city}, {v.country}</td>
                  <td className="py-2.5 text-zinc-400">{v.referrer}</td>
                  <td className="py-2.5 capitalize text-zinc-400">{v.device} ({v.browser})</td>
                  <td className="py-2.5">{v.durationSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
