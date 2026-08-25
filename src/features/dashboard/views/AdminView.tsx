import React from 'react';
import { 
  ShieldAlert, 
  DollarSign, 
  Users, 
  Layers, 
  TrendingUp, 
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const users = [
    { name: 'Sreerang', username: 'sreerang', plan: 'Pro', status: 'Active', portfolios: 2, mrr: '$9/mo' },
    { name: 'Alex Rivera', username: 'arivera', plan: 'Developer', status: 'Active', portfolios: 5, mrr: '$19/mo' },
    { name: 'Sarah Chen', username: 'schen', plan: 'Pro', status: 'Active', portfolios: 1, mrr: '$9/mo' },
    { name: 'David Kim', username: 'dkim-dev', plan: 'Free', status: 'Active', portfolios: 1, mrr: '$0' },
    { name: 'Elena Rostova', username: 'erostova', plan: 'Developer', status: 'Active', portfolios: 8, mrr: '$19/mo' },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono font-bold uppercase">
              Super Admin Mode
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Governance
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Global metrics, SaaS subscription MRR, user moderation, and deployment nodes.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Monthly Recurring Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </span>
          <div className="text-3xl font-black text-white font-mono">$48,290</div>
          <span className="text-[11px] text-emerald-400 font-mono">+18% Net New Growth</span>
        </div>

        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Active Platform Portfolios</span>
            <Globe className="w-4 h-4 text-indigo-400" />
          </span>
          <div className="text-3xl font-black text-white font-mono">14,280</div>
          <span className="text-[11px] text-indigo-400 font-mono">99.99% Edge Uptime</span>
        </div>

        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Registered Developers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </span>
          <div className="text-3xl font-black text-white font-mono">52,410</div>
          <span className="text-[11px] text-zinc-400 font-mono">68% GitHub OAuth Auth</span>
        </div>

        <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-xs font-semibold text-zinc-400 flex items-center justify-between">
            <span>Template Usage Distribution</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </span>
          <div className="text-3xl font-black text-white font-mono">Bento (38%)</div>
          <span className="text-[11px] text-zinc-400 font-mono">Terminal #2 (24%)</span>
        </div>

      </div>

      {/* User Moderation Table */}
      <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
          Recent User Accounts & Subscriptions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] text-zinc-500 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-2.5">User</th>
                <th className="py-2.5">GitHub Handle</th>
                <th className="py-2.5">SaaS Plan</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5">Portfolios</th>
                <th className="py-2.5">MRR Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300 font-mono">
              {users.map((u) => (
                <tr key={u.username} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3 font-semibold text-white">{u.name}</td>
                  <td className="py-3 text-indigo-400">@{u.username}</td>
                  <td className="py-3 font-bold text-zinc-200">{u.plan}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3">{u.portfolios} live</td>
                  <td className="py-3 text-emerald-400 font-bold">{u.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
