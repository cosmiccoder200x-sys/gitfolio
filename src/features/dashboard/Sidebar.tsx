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
  FileText,
  Search,
  Bot,
  MessageSquare
} from 'lucide-react';
import { SaaSUser, DashboardTabId } from '../../types/saas';

interface SidebarProps {
  activeTab: DashboardTabId;
  onSelectTab: (tab: DashboardTabId) => void;
  user: SaaSUser;
  onLogout: () => void;
  onViewPublicPortfolio: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  user,
  onLogout,
  onViewPublicPortfolio,
}) => {
  const mainNav = [
    { id: 'overview' as DashboardTabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'builder' as DashboardTabId, label: 'Portfolio Builder', icon: Sparkles },
    { id: 'projects' as DashboardTabId, label: 'Projects', icon: FolderGit2 },
    { id: 'templates' as DashboardTabId, label: 'Templates', icon: Layers },
    { id: 'analytics' as DashboardTabId, label: 'Analytics', icon: BarChart3 },
  ];

  const manageNav = [
    { id: 'domains' as DashboardTabId, label: 'Custom Domains', icon: Globe },
    { id: 'settings' as DashboardTabId, label: 'Settings & SEO', icon: Settings },
  ];

  const toolsNav = [
    { id: 'resume' as DashboardTabId, label: 'Resume Builder', icon: FileText },
    { id: 'ats' as DashboardTabId, label: 'ATS Scanner', icon: Search },
    { id: 'ai-assistant' as DashboardTabId, label: 'AI Assistant', icon: Bot },
    { id: 'interview-simulator' as DashboardTabId, label: 'Interview Simulator', icon: MessageSquare },
  ];

  return (
    <aside className="w-60 bg-[#121215] border-r border-[#27272a] flex flex-col justify-between shrink-0 select-none">
      
      {/* Quiet Brand Header */}
      <div className="p-4 border-b border-[#27272a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <FolderGit2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-zinc-100 text-sm tracking-tight font-display">Gitfolio</span>
          </div>

          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">v2.4</span>
        </div>

        {/* Live URL Link */}
        <div 
          onClick={onViewPublicPortfolio}
          className="mt-3.5 p-2 bg-[#18181b] hover:bg-zinc-800/80 border border-[#27272a] rounded-lg flex items-center justify-between cursor-pointer transition group"
        >
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[10px] uppercase font-mono text-zinc-400 block font-medium">
              Live URL
            </span>
            <p className="text-xs font-mono text-zinc-200 truncate">
              gitfolio.dev/{user.username}
            </p>
          </div>
          <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition shrink-0" />
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="p-3 space-y-5 flex-1 overflow-y-auto no-scrollbar">
        
        {/* MAIN Group */}
        <div className="space-y-1">
          <span className="px-2 text-[10px] font-mono font-semibold uppercase text-zinc-500 tracking-wider block">
            MAIN
          </span>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#27272a] text-zinc-50 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* MANAGE Group */}
        <div className="space-y-1">
          <span className="px-2 text-[10px] font-mono font-semibold uppercase text-zinc-500 tracking-wider block">
            MANAGE
          </span>
          {manageNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#27272a] text-zinc-50 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* TOOLS Group (Career Tools) */}
        <div className="space-y-1">
          <span className="px-2 text-[10px] font-mono font-semibold uppercase text-zinc-500 tracking-wider block">
            TOOLS
          </span>
          {toolsNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#27272a] text-zinc-50 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Admin Group (Restricted) */}
        {user.isAdmin && (
          <div className="space-y-1 pt-2 border-t border-[#27272a]">
            <span className="px-2 text-[10px] font-mono font-semibold uppercase text-zinc-500 tracking-wider block">
              SYSTEM
            </span>
            <button
              onClick={() => onSelectTab('admin')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#27272a] text-rose-300 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin Metrics</span>
            </button>
          </div>
        )}

      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-[#27272a]">
        <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#18181b] border border-[#27272a]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-md object-cover border border-zinc-700"
            />
            <div className="overflow-hidden">
              <h4 className="font-semibold text-zinc-100 text-xs truncate">{user.name}</h4>
              <span className="text-[10px] font-mono text-zinc-400 capitalize block truncate">
                @{user.username}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Log out"
            className="p-1 text-zinc-400 hover:text-zinc-100 rounded transition cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
};
