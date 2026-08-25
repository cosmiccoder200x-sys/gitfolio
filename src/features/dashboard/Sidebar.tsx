import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  FolderGit2, 
  Layers, 
  BarChart3, 
  Globe, 
  Settings, 
  ShieldAlert, 
  ExternalLink,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { SaaSUser } from '../../types/saas';

export type DashboardTabId = 
  | 'overview' 
  | 'builder' 
  | 'projects' 
  | 'templates' 
  | 'analytics' 
  | 'domains' 
  | 'settings' 
  | 'admin';

interface SidebarProps {
  activeTab: DashboardTabId;
  onSelectTab: (tab: DashboardTabId) => void;
  user: SaaSUser;
  onLogout: () => void;
  onViewPublicPortfolio: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  onLogout,
  onViewPublicPortfolio,
}) => {
  const navItems = [
    { id: 'overview' as DashboardTabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'builder' as DashboardTabId, label: 'Portfolio Builder', icon: Sparkles, badge: 'Live' },
    { id: 'projects' as DashboardTabId, label: 'Projects', icon: FolderGit2 },
    { id: 'templates' as DashboardTabId, label: 'Templates', icon: Layers },
    { id: 'analytics' as DashboardTabId, label: 'Analytics', icon: BarChart3 },
    { id: 'domains' as DashboardTabId, label: 'Custom Domains', icon: Globe },
    { id: 'settings' as DashboardTabId, label: 'Settings & SEO', icon: Settings },
  ];

  if (user.isAdmin) {
    navItems.push({ id: 'admin' as DashboardTabId, label: 'Admin Metrics', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-[#0e1017] border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight">Gitfolio</span>
            <span className="text-[10px] font-mono text-zinc-500 block">Workspace</span>
          </div>
        </div>

        {/* Live Published Subdomain Link */}
        <div 
          onClick={onViewPublicPortfolio}
          className="mt-4 p-2.5 bg-black/40 hover:bg-black/60 border border-white/[0.06] rounded-xl flex items-center justify-between cursor-pointer transition group"
        >
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live URL
            </span>
            <p className="text-xs font-mono text-zinc-300 truncate">
              gitfolio.dev/{user.username}
            </p>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition shrink-0" />
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-9 h-9 rounded-full border border-indigo-500/40 object-cover"
          />
          <div className="flex-1 overflow-hidden">
            <h4 className="font-bold text-white text-xs truncate">{user.name}</h4>
            <span className="text-[10px] font-mono text-zinc-400 capitalize">
              {user.plan} Plan
            </span>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
};
