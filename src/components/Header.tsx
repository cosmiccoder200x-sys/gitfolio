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
    { id: 'ats-scanner' as ActiveTab, label: 'ATS Optimizer', icon: Sparkles, badge: `${atsScore}%` },
    { id: 'interview-simulator' as ActiveTab, label: 'Interview Prep', icon: MessageSquareCode },
    { id: 'portfolio' as ActiveTab, label: 'Portfolio', icon: Globe },
    { id: 'ai-assistant' as ActiveTab, label: 'AI Advisor', icon: Bot },
  ];


  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0a0a0c]/90 dark:bg-[#0a0a0c]/90 bg-white/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.25)] border border-sky-500/30 flex items-center justify-center bg-[#090D16]">
              <Logo size={36} showBackground={false} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent font-bold">GitFolio</span>
                <span className="text-zinc-500 font-normal text-sm sm:text-base">Architect</span>
              </h1>
            </div>
          </div>

          {/* Pill Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 dark:bg-zinc-900/60 bg-slate-100 p-1 rounded-full border border-zinc-800/60 dark:border-zinc-800/60 border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-zinc-800 text-white dark:text-indigo-400 dark:bg-zinc-800 shadow-[0_0_12px_rgba(79,70,229,0.25)] border border-zinc-700/60 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500'} ${tab.id === 'repositories' && isSyncing ? 'animate-spin' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-zinc-900/80 dark:bg-zinc-900/80 bg-slate-100 rounded-lg border border-zinc-800 dark:border-zinc-800 border-slate-200">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                {isSyncing ? 'Syncing...' : 'API Connected'}
              </span>
            </div>

            {/* Profile Demo Selector */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900/60 dark:bg-zinc-900/60 bg-slate-100 px-2.5 py-1 rounded-lg border border-zinc-800 dark:border-zinc-800 border-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <select
                className="bg-transparent font-medium text-slate-900 dark:text-zinc-200 outline-none cursor-pointer text-xs"
                onChange={(e) => onSelectProfile(e.target.value)}
                value={selectedProfileId}
              >
                {SAMPLE_PROFILES.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-200">
                    {p.name.split(' ')[0]} ({p.role.split('&')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* ATS Score Indicator */}
            <button
              onClick={() => onSelectTab('ats-scanner')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-900/80 dark:bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/40 text-emerald-400 transition"
              title="View ATS Score & Recommendations"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              <span className="text-[11px] font-mono text-zinc-300">ATS {atsScore}%</span>
            </button>

            {/* Quick PDF button if handler available */}
            {onQuickPdfDownload && (
              <button
                onClick={onQuickPdfDownload}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-[0_0_12px_rgba(79,70,229,0.3)] transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <nav className="flex md:hidden space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-zinc-800/60 text-xs font-medium">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/60 font-semibold shadow-[0_0_10px_rgba(79,70,229,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-bold px-1 rounded bg-emerald-500/20 text-emerald-400">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
