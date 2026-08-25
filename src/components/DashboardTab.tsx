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
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* 1. Clean Top Profile & Sync Hero Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 overflow-hidden shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name || user.login} className="w-full h-full object-cover" />
            ) : (
              <FolderGit2 className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{user.name || 'Alex Rivera'}</h2>
              <span className="text-xs font-mono text-zinc-500">@{user.login}</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Target Role: <strong className="text-zinc-200">{resume.targetRole || 'Senior Full-Stack Engineer'}</strong>
            </p>
          </div>
        </div>

        {/* GitHub Fast Sync Input */}
        <form onSubmit={handleSyncSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="GitHub username..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="px-3.5 py-2 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs outline-none w-full md:w-48 transition"
          />
          <button
            type="submit"
            disabled={isSyncing || !usernameInput.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5"
          >
            {isSyncing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Sync Repos</span>
            )}
          </button>
        </form>
      </div>

      {/* 2. Key Metrics Row (3 Clean High-Contrast Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: ATS Score */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-zinc-400">ATS Resume Score</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold font-mono">
              88/100
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
              <div className="bg-emerald-500 h-full w-[88%]" />
            </div>
            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>Keywords: <strong className="text-zinc-200">92%</strong></span>
              <span>Impact: <strong className="text-zinc-200">85%</strong></span>
              <span>Format: <strong className="text-zinc-200">100%</strong></span>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('ats-scanner')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Scan against Job Description</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metric 2: GitHub Footprint */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-zinc-400">GitHub Repositories</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-xs font-bold font-mono">
              {repos.length} Synced
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {/* Simple Clean Language Distribution */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="px-2 py-1 rounded bg-zinc-950 text-indigo-300 border border-zinc-800 font-mono text-[11px]">
                TypeScript (64%)
              </span>
              <span className="px-2 py-1 rounded bg-zinc-950 text-cyan-300 border border-zinc-800 font-mono text-[11px]">
                Go (22%)
              </span>
              <span className="px-2 py-1 rounded bg-zinc-950 text-emerald-300 border border-zinc-800 font-mono text-[11px]">
                Python (14%)
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('repositories')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Curate Projects for Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Metric 3: Target Role Alignment */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-zinc-400">Role Match</span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono">
              88% Match
            </span>
          </div>

          <div className="space-y-1.5 mb-4">
            <p className="text-xs text-zinc-400">Missing Key Skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {['Kubernetes', 'GraphQL', 'System Architecture'].map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded text-[11px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectTab('resume-builder')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Update Resume Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 3. Core Modules Navigation Grid (4 Clean Interactive Cards) */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Career Tools
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tool 1 */}
          <div
            onClick={() => onSelectTab('resume-builder')}
            className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl cursor-pointer transition flex flex-col justify-between space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ATS Resume Builder</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Edit contact, experience bullets, and export clean 1-Page PDF.
              </p>
            </div>
            <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1 pt-1">
              Open Builder &rarr;
            </span>
          </div>

          {/* Tool 2 */}
          <div
            onClick={() => onSelectTab('ats-scanner')}
            className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl cursor-pointer transition flex flex-col justify-between space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ATS Scanner</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Paste any job description to audit keyword matches & skill gaps.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 pt-1">
              Run Scanner &rarr;
            </span>
          </div>

          {/* Tool 3 */}
          <div
            onClick={() => onSelectTab('interview-simulator')}
            className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl cursor-pointer transition flex flex-col justify-between space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Interview Simulator</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Practice 5 technical interview questions with STAR answers & AI critique.
              </p>
            </div>
            <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 pt-1">
              Start Practice &rarr;
            </span>
          </div>

          {/* Tool 4 */}
          <div
            onClick={() => onSelectTab('portfolio')}
            className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl cursor-pointer transition flex flex-col justify-between space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Portfolio Website</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Choose from 4 developer themes and preview your live website.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1 pt-1">
              View Themes &rarr;
            </span>
          </div>

        </div>
      </div>

      {/* LinkedIn Import Helper */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0077b5]/10 border border-[#0077b5]/30 text-[#0077b5] flex items-center justify-center shrink-0">
            <Linkedin className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Import from LinkedIn</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Upload your LinkedIn profile PDF to auto-populate experience and skills.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLinkedInImportOpen(true)}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold transition shrink-0"
        >
          Open Importer
        </button>
      </div>

      {/* LinkedIn Modals */}
      <LinkedInExtractionHelpModal
        isOpen={isLinkedInHelpOpen}
        onClose={() => setIsLinkedInHelpOpen(false)}
        onOpenImporter={() => setIsLinkedInImportOpen(true)}
      />

      <LinkedInImportModal
        isOpen={isLinkedInImportOpen}
        onClose={() => setIsLinkedInImportOpen(false)}
        onApplyData={handleApplyLinkedInData}
      />

    </div>
  );
};
