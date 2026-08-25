import React, { useState } from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  Users, 
  Star, 
  MapPin, 
  Building, 
  Link as LinkIcon, 
  Code2, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Key,
  Globe,
  FileText,
  Clock,
  Layers,
  Zap,
  Target,
  FileCheck,
  ExternalLink,
  ChevronRight,
  MessageSquareCode,
  Linkedin,
  HelpCircle,
  BookOpen
} from 'lucide-react';

import { GitHubUser, GitHubRepo, ResumeData, ActiveTab, ATSAnalysisResult } from '../types';
import { fetchGitHubData } from '../lib/geminiApi';
import { LinkedInExtractionHelpModal } from './LinkedInExtractionHelpModal';
import { LinkedInImportModal } from './LinkedInImportModal';

interface DashboardTabProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  resume: ResumeData;
  atsResult?: ATSAnalysisResult;
  languages?: Record<string, number>;
  onSelectTab: (tab: ActiveTab) => void;
  isSyncing: boolean;
  setIsSyncing?: (val: boolean) => void;
  onUpdateResume?: (resume: ResumeData) => void;
  onUpdateUserData?: (newUser: GitHubUser, newRepos: GitHubRepo[]) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  user,
  repos,
  resume,
  atsResult,
  languages,
  onSelectTab,
  isSyncing,
  setIsSyncing,
  onUpdateResume,
  onUpdateUserData,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isLinkedInHelpOpen, setIsLinkedInHelpOpen] = useState(false);
  const [isLinkedInImportOpen, setIsLinkedInImportOpen] = useState(false);

  const handleApplyLinkedInData = (extracted: Partial<ResumeData>) => {
    if (onUpdateResume) {
      onUpdateResume({
        ...resume,
        personal: { ...resume.personal, ...(extracted.personal || {}) },
        experience: extracted.experience && extracted.experience.length > 0 ? extracted.experience : resume.experience,
        skills: extracted.skills ? { ...resume.skills, ...extracted.skills } : resume.skills,
        education: extracted.education && extracted.education.length > 0 ? extracted.education : resume.education,
        certifications: extracted.certifications && extracted.certifications.length > 0 ? extracted.certifications : resume.certifications,
      });
    }
  };

  const handleSyncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    if (setIsSyncing) setIsSyncing(true);
    setSyncError(null);

    try {
      const data = await fetchGitHubData(usernameInput.trim(), tokenInput.trim() || undefined);
      if (onUpdateUserData) {
        onUpdateUserData(data.user, data.repos);
      }
      setUsernameInput('');
    } catch (err: any) {
      console.error('GitHub fetch failed:', err);
      setSyncError(err.message || 'Failed to fetch GitHub profile. Check username or token rate limits.');
    } finally {
      if (setIsSyncing) setIsSyncing(false);
    }
  };

  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const selectedResumeRepos = repos.filter((r) => r.selectedForResume);
  const selectedPortfolioRepos = repos.filter((r) => r.selectedForPortfolio);

  // Compute language distribution dynamically
  const computedLanguages: Record<string, number> = languages || repos.reduce((acc, r) => {
    if (r.language) {
      acc[r.language] = (acc[r.language] || 0) + (r.size || 100);
    }
    return acc;
  }, {} as Record<string, number>);

  const totalLanguageBytes = Object.values(computedLanguages).reduce((a: number, b: number) => a + Number(b), 0) || 1;

  const languageColors: Record<string, string> = {
    TypeScript: 'bg-indigo-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-emerald-500',
    Go: 'bg-cyan-400',
    Rust: 'bg-orange-500',
    Java: 'bg-red-500',
    'C++': 'bg-pink-500',
    C: 'bg-zinc-500',
    HTML: 'bg-amber-500',
    CSS: 'bg-purple-500',
    Shell: 'bg-teal-400',
    Docker: 'bg-sky-500',
  };

  const score = atsResult?.overallScore || 92;
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDash = `${(score / 100) * 100}, 100`;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Bento Grid Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Bento Cell 1: Profile & Identity */}
        <div className="md:col-span-6 lg:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-xl group hover:border-zinc-700/80 transition-colors">
          {/* Subtle Watermark Accent */}
          <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-7xl select-none pointer-events-none text-white">
            GF
          </div>

          <div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name || user.login} className="w-full h-full object-cover" />
                ) : (
                  <FolderGit2 className="w-7 h-7" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white truncate">{user.name || user.login}</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                </div>
                <p className="text-xs text-zinc-500 font-mono">@{user.login}</p>
                {user.location && (
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span>{user.location}</span>
                  </p>
                )}
              </div>
            </div>

            {user.bio && (
              <p className="text-xs text-zinc-400 mt-3 line-clamp-2 leading-relaxed">
                {user.bio}
              </p>
            )}
          </div>

          {/* Mini Stat Bento Boxes */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800/60">
            <div className="bg-zinc-800/40 rounded-xl p-2.5 border border-zinc-700/30">
              <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Repositories</p>
              <p className="text-xl font-bold text-white mt-0.5">{repos.length}</p>
            </div>
            <div className="bg-zinc-800/40 rounded-xl p-2.5 border border-zinc-700/30">
              <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider flex items-center gap-1">
                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span>Stars</span>
              </p>
              <p className="text-xl font-bold text-white mt-0.5">{totalStars.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Bento Cell 2: ATS Optimizer Gauge */}
        <div className="md:col-span-6 lg:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-xl group hover:border-zinc-700/80 transition-colors">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">ATS Optimizer</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              {score >= 85 ? 'Recruiter Ready' : 'Needs Keywords'}
            </span>
          </div>

          {/* Circular Score Gauge */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-zinc-800"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-indigo-500 transition-all duration-1000 ease-out"
                  strokeWidth="3.5"
                  strokeDasharray={strokeDash}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.6))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white tracking-tight">{score}</span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-semibold">Score</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-zinc-400 italic text-center line-clamp-1">
              {atsResult?.roleSummaryTip || '"Add \'Kubernetes\' and \'Microservices\' to reach 95%"'}
            </p>
            <button
              onClick={() => onSelectTab('ats-scanner')}
              className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audit Resume Keywords</span>
            </button>
          </div>
        </div>

        {/* Bento Cell 3: GitHub Live Sync & Rate Limit Controller */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-xl group hover:border-zinc-700/80 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Live GitHub Sync</span>
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">@{user.login}</span>
            </div>
            <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
              Sync any public GitHub profile to extract code repositories, topics, and metrics.
            </p>

            <form onSubmit={handleSyncSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="GitHub username (e.g. torvalds, gaearon)..."
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-3 pr-20 py-2 bg-zinc-800/80 border border-zinc-700/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-xl text-white placeholder-zinc-500 text-xs outline-none transition"
                />
                <button
                  type="submit"
                  disabled={isSyncing || !usernameInput.trim()}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 font-semibold rounded-lg text-white text-[11px] transition flex items-center gap-1"
                >
                  {isSyncing ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Sync</span>
                  )}
                </button>
              </div>

              {/* Personal Access Token Option */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition"
                >
                  <Key className="w-2.5 h-2.5" />
                  <span>{showTokenInput ? 'Hide token field' : '+ Add Personal Access Token (5,000 req/hr)'}</span>
                </button>

                {showTokenInput && (
                  <input
                    type="password"
                    placeholder="Paste GitHub Token (ghp_...)"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    className="mt-1.5 w-full px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/60 rounded-lg text-white placeholder-zinc-500 text-[10px] outline-none"
                  />
                )}
              </div>

              {syncError && (
                <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded-lg text-[10px] text-rose-300 flex items-center gap-1.5 mt-2">
                  <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate">{syncError}</span>
                </div>
              )}
            </form>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-3 border-t border-zinc-800/60 mt-3">
            <button
              type="button"
              onClick={() => setIsLinkedInHelpOpen(true)}
              className="text-zinc-400 hover:text-white flex items-center gap-1 transition"
            >
              <Linkedin className="w-3 h-3 text-[#0077b5] fill-current" />
              <span>LinkedIn extraction guide</span>
            </button>
            <button
              onClick={() => onSelectTab('repositories')}
              className="text-indigo-400 hover:underline font-semibold flex items-center gap-0.5"
            >
              <span>Manage repos</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Bento Grid Middle Section: Language Footprint & Quick Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Bento Cell 4: Language & Tech Footprint */}
        <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Technology & Language Footprint</span>
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Public Codebases</span>
            </div>

            {/* Language distribution bar */}
            <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-zinc-800 mb-4 border border-zinc-700/30">
              {Object.entries(computedLanguages).map(([lang, bytes]) => {
                const pct = Math.round((Number(bytes) / totalLanguageBytes) * 100);
                if (pct < 1) return null;
                const bg = languageColors[lang] || 'bg-zinc-500';
                return (
                  <div
                    key={lang}
                    style={{ width: `${pct}%` }}
                    className={`${bg} h-full transition-all duration-500`}
                    title={`${lang}: ${pct}%`}
                  />
                );
              })}
            </div>

            {/* Language Chips */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(computedLanguages)
                .sort((a, b) => Number(b[1]) - Number(a[1]))
                .slice(0, 8)
                .map(([lang, bytes]) => {
                  const pct = Math.max(1, Math.round((Number(bytes) / totalLanguageBytes) * 100));
                  const bg = languageColors[lang] || 'bg-zinc-400';
                  return (
                    <div
                      key={lang}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-800/40 rounded-lg text-xs font-medium text-zinc-300 border border-zinc-700/30"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${bg}`} />
                      <span>{lang}</span>
                      <span className="text-zinc-500 text-[10px] font-mono">{pct}%</span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500">
            <span>Primary Focus: <strong className="text-zinc-300">{resume.targetRole || 'Full-Stack Engineering'}</strong></span>
            <span className="text-indigo-400 font-mono text-[10px]">ATS Verified</span>
          </div>
        </div>

        {/* Bento Cell 5: Recruiter ATS Resume Snippet Card */}
        <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recruiter ATS Format Spotlight</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsLinkedInHelpOpen(true)}
                className="px-2 py-0.5 rounded bg-[#0077b5]/15 text-[#0077b5] text-[10px] font-semibold border border-[#0077b5]/30 hover:bg-[#0077b5]/25 transition flex items-center gap-1"
              >
                <Linkedin className="w-2.5 h-2.5 fill-current" />
                <span>LinkedIn Help</span>
              </button>
            </div>

            {/* Embedded Resume Mini-Sheet */}
            <div className="bg-white rounded-xl p-4 text-zinc-900 text-xs shadow-md border border-zinc-200/80">
              <div className="border-b border-zinc-200 pb-2 mb-2">
                <h4 className="font-extrabold text-sm tracking-tight text-zinc-950 uppercase">
                  {resume.personal.fullName || user.name || 'Alex Rivera'}
                </h4>
                <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-wider">
                  {resume.personal.title || resume.targetRole || 'Senior Full-Stack Engineer'}
                </p>
              </div>

              {resume.experience && resume.experience.length > 0 && (
                <div>
                  <div className="flex justify-between items-baseline text-[10px]">
                    <span className="font-bold text-zinc-800">{resume.experience[0].role} @ {resume.experience[0].company}</span>
                    <span className="text-zinc-500 text-[9px]">{resume.experience[0].startDate} — {resume.experience[0].endDate}</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1 line-clamp-2">
                    {resume.experience[0].bullets[0] || 'Architected scalable microservices and real-time distributed pipelines.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">Taleo, Greenhouse & Lever parse ready</span>
            <button
              onClick={() => onSelectTab('resume-builder')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(79,70,229,0.3)]"
            >
              <span>Edit Full ATS Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* LinkedIn Manual Extraction & Import Guidance Banner */}
      <div className="bg-gradient-to-r from-[#0077b5]/15 via-zinc-900/90 to-indigo-950/25 border border-[#0077b5]/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#0077b5]/20 border border-[#0077b5]/40 text-[#0077b5] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,119,181,0.2)]">
            <Linkedin className="w-5 h-5 fill-current" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">Manual LinkedIn Data Extraction & AI Importer</h3>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                Official 15s Guide
              </span>
            </div>
            <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
              Because automated scraping is restricted by LinkedIn's API, use our step-by-step instructions to extract your profile PDF or data archive and transform raw roles into recruiter-ready STAR bullet points.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
          <button
            type="button"
            onClick={() => setIsLinkedInHelpOpen(true)}
            className="px-3.5 py-2 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0077b5]" />
            <span>How to Extract</span>
          </button>

          <button
            type="button"
            onClick={() => setIsLinkedInImportOpen(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Open AI Importer</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Bottom Action Cards: 4 Core Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Module 1 */}
        <div 
          onClick={() => onSelectTab('resume-builder')}
          className="bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-lg"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-indigo-500/20 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
              <span>ATS Resume Studio</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Format experiences, AI STAR bullet points, and download recruiter-compliant 1-Page PDFs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[10px] text-indigo-400 font-mono font-medium">
            Open Builder &rarr;
          </div>
        </div>

        {/* Module 2 */}
        <div 
          onClick={() => onSelectTab('interview-simulator')}
          className="bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-lg"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-amber-500/20 transition-transform">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
              <span>Interview Simulator</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Practice 5 role-tailored technical questions with full STAR answers, timer, and AI evaluation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[10px] text-amber-400 font-mono font-medium">
            Start Mock Interview &rarr;
          </div>
        </div>

        {/* Module 3 */}
        <div 
          onClick={() => onSelectTab('portfolio')}
          className="bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-lg"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
              <span>Live Portfolio</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Render 4 developer themes (Terminal, Clean Tech, Editorial) with 1-click HTML export.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[10px] text-emerald-400 font-mono font-medium">
            Preview Portfolio &rarr;
          </div>
        </div>

        {/* Module 4 */}
        <div 
          onClick={() => onSelectTab('ai-assistant')}
          className="bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group shadow-lg"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-purple-500/20 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1 flex items-center justify-between">
              <span>AI Career Advisor</span>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-400 transition-colors" />
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate custom cover letters, system design explanations, and LinkedIn outreach scripts.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-800/40 text-[10px] text-purple-400 font-mono font-medium">
            Ask AI Advisor &rarr;
          </div>
        </div>

      </div>

      {/* LinkedIn Manual Extraction Help Modal */}
      <LinkedInExtractionHelpModal
        isOpen={isLinkedInHelpOpen}
        onClose={() => setIsLinkedInHelpOpen(false)}
        onOpenImporter={() => setIsLinkedInImportOpen(true)}
      />

      {/* LinkedIn AI Importer Modal */}
      <LinkedInImportModal
        isOpen={isLinkedInImportOpen}
        onClose={() => setIsLinkedInImportOpen(false)}
        onApplyData={handleApplyLinkedInData}
      />

    </div>
  );
};
