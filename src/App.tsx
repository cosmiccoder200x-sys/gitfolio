import React, { useState, useEffect } from 'react';
import { 
  GitHubUser, 
  GitHubRepo, 
  ResumeData, 
  ATSAnalysisResult, 
  TabType, 
  ProjectItem 
} from './types';
import { 
  DEFAULT_SAMPLE_USER, 
  DEFAULT_SAMPLE_REPOS, 
  DEFAULT_SAMPLE_RESUME, 
  MOCK_PROFILES, 
  DEFAULT_ATS_RESULT 
} from './data/mockProfiles';
import { Header } from './components/Header';
import { DashboardTab } from './components/DashboardTab';
import { RepositoriesTab } from './components/RepositoriesTab';
import { ResumeBuilderTab } from './components/ResumeBuilderTab';
import { ATSScannerTab } from './components/ATSScannerTab';
import { InterviewSimulatorTab } from './components/InterviewSimulatorTab';
import { PortfolioGeneratorTab } from './components/PortfolioGeneratorTab';
import { AIAssistantTab } from './components/AIAssistantTab';

import { exportResumeToPdf } from './lib/exportUtils';

const LOCAL_STORAGE_KEY = 'gitfolio_ats_state_v1';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return true; // Default to Bento Grid dark theme
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [currentProfileId, setCurrentProfileId] = useState<string>('alex-rivera');

  // Core State
  const [user, setUser] = useState<GitHubUser>(DEFAULT_SAMPLE_USER);
  const [repos, setRepos] = useState<GitHubRepo[]>(DEFAULT_SAMPLE_REPOS);
  const [resume, setResume] = useState<ResumeData>(DEFAULT_SAMPLE_RESUME);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult>(DEFAULT_ATS_RESULT);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync Dark Mode to DOM HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) setUser(parsed.user);
        if (parsed.repos) setRepos(parsed.repos);
        if (parsed.resume) setResume(parsed.resume);
        if (parsed.atsResult) setAtsResult(parsed.atsResult);
      }
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    }
  }, []);

  // Save to LocalStorage when states change
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ user, repos, resume, atsResult })
      );
    } catch (e) {
      console.warn('Failed to save to local storage:', e);
    }
  }, [user, repos, resume, atsResult]);

  // Handle Preset Profile Switching
  const handleSelectDemoProfile = (profileId: string) => {
    const profile = MOCK_PROFILES[profileId];
    if (profile) {
      setCurrentProfileId(profileId);
      setUser(profile.user);
      setRepos(profile.repos);
      setResume(profile.resume);
      setAtsResult(DEFAULT_ATS_RESULT);
    }
  };

  // Sync featured repositories to Resume Projects
  const handleUpdateRepos = (updatedRepos: GitHubRepo[]) => {
    setRepos(updatedRepos);

    // Build project list for resume from selected repos
    const selectedRepos = updatedRepos.filter((r) => r.selectedForResume);
    const resumeProjects: ProjectItem[] = selectedRepos.map((r) => ({
      id: `proj-${r.id}`,
      name: r.customTitle || r.name,
      description: r.description || undefined,
      bullets: r.customBullets && r.customBullets.length > 0 
        ? r.customBullets 
        : [r.description || `Built with ${r.language || 'modern technologies'}`],
      techStack: r.topics && r.topics.length > 0 ? r.topics : (r.language ? [r.language] : []),
      githubUrl: r.html_url,
      liveUrl: r.homepage || undefined,
      role: 'Lead Architect & Creator',
    }));

    setResume((prev) => ({
      ...prev,
      projects: resumeProjects,
    }));
  };

  const handleSyncWithResumeProjects = (projects: ProjectItem[]) => {
    setResume((prev) => ({
      ...prev,
      projects,
    }));
  };

  const handleQuickPdfDownload = () => {
    exportResumeToPdf('clean-ats-printable-canvas', `${resume.personal.fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        selectedProfileId={currentProfileId}
        onSelectProfile={handleSelectDemoProfile}
        atsScore={atsResult.overallScore}
        onQuickPdfDownload={handleQuickPdfDownload}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {activeTab === 'dashboard' && (
          <DashboardTab
            user={user}
            repos={repos}
            resume={resume}
            atsResult={atsResult}
            onSelectTab={setActiveTab}
            isSyncing={isSyncing}
            setIsSyncing={setIsSyncing}
            onUpdateResume={setResume}
            onUpdateUserData={(newUser, newRepos) => {
              setUser(newUser);
              handleUpdateRepos(newRepos);
            }}
          />
        )}

        {activeTab === 'repositories' && (
          <RepositoriesTab
            repos={repos}
            onUpdateRepos={handleUpdateRepos}
            targetRole={resume.targetRole}
            onSyncWithResumeProjects={handleSyncWithResumeProjects}
          />
        )}

        {activeTab === 'resume-builder' && (
          <ResumeBuilderTab
            resume={resume}
            onUpdateResume={setResume}
            atsScore={atsResult.overallScore}
            onNavigateToScanner={() => setActiveTab('ats-scanner')}
          />
        )}

        {activeTab === 'ats-scanner' && (
          <ATSScannerTab
            resume={resume}
            onUpdateResume={setResume}
            atsResult={atsResult}
            setAtsResult={setAtsResult}
            repos={repos}
          />
        )}

        {activeTab === 'interview-simulator' && (
          <InterviewSimulatorTab
            resume={resume}
            onUpdateResume={setResume}
            repos={repos}
          />
        )}

        {activeTab === 'portfolio' && (

          <PortfolioGeneratorTab
            user={user}
            repos={repos}
            resume={resume}
          />
        )}

        {activeTab === 'ai-assistant' && (
          <AIAssistantTab
            resume={resume}
            repos={repos}
          />
        )}

      </main>

      {/* Bento Grid Footer */}
      <footer className="px-6 py-3 bg-zinc-900/60 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] font-medium text-zinc-500 uppercase tracking-widest backdrop-blur-md">
        <span>Draft saved to localStorage • LIVE SYNC READY</span>
        <div className="flex gap-6 items-center">
          <span>Build 1.2.4-stable</span>
          <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping inline-block" />
            Gemini 3.7 Pro Active
          </span>
        </div>
      </footer>

    </div>
  );
}
