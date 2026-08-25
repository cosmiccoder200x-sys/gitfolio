import React from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  FileText, 
  Globe, 
  Bot, 
  RefreshCw, 
  Sun, 
  Moon, 
  Download, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle,
  MessageSquareCode
} from 'lucide-react';
import { ActiveTab, TabType } from '../types';
import { SAMPLE_PROFILES } from '../data/mockProfiles';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: ActiveTab | TabType;
  onSelectTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  selectedProfileId: string;
  onSelectProfile: (profileId: string) => void;
  atsScore: number;
  onQuickPdfDownload?: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  selectedProfileId,
  onSelectProfile,
  atsScore,
  onQuickPdfDownload,
  isSyncing = false,
}) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: FolderGit2 },
    { id: 'repositories' as ActiveTab, label: 'Repositories', icon: RefreshCw },
    { id: 'resume-builder' as ActiveTab, label: 'ATS Resume', icon: FileText },
    { id: 'ats-scanner' as ActiveTab, label: 'ATS Scanner', icon: Sparkles, badge: `${atsScore}%` },
    { id: 'interview-simulator' as ActiveTab, label: 'Interview Prep', icon: MessageSquareCode },
    { id: 'portfolio' as ActiveTab, label: 'Portfolio', icon: Globe },
    { id: 'ai-assistant' as ActiveTab, label: 'AI Advisor', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-[#0a0a0c]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => onSelectTab('dashboard')}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight">GitFolio</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                PRO
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/80'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500'} ${tab.id === 'repositories' && isSyncing ? 'animate-spin' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            
            {/* Profile Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-800">
              <span className="text-zinc-500">Profile:</span>
              <select
                className="bg-transparent font-medium text-zinc-200 outline-none cursor-pointer text-xs"
                onChange={(e) => onSelectProfile(e.target.value)}
                value={selectedProfileId}
              >
                {SAMPLE_PROFILES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-200">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Export PDF Button */}
            {onQuickPdfDownload && (
              <button
                onClick={onQuickPdfDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition border border-zinc-800"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex lg:hidden space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-zinc-800/80 text-xs font-medium">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-indigo-400 border border-zinc-700 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
