import React, { useState } from 'react';
import { PortfolioConfig, SaaSUser, TemplateId, ViewportMode, DashboardTabId } from '../../types/saas';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { OverviewView } from './views/OverviewView';
import { BuilderView } from './views/BuilderView';
import { ProjectsView } from './views/ProjectsView';
import { TemplatesView } from './views/TemplatesView';
import { AnalyticsView } from './views/AnalyticsView';
import { DomainsView } from './views/DomainsView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';

// Career Tools Tabs
import { ResumeBuilderTab } from '../../components/ResumeBuilderTab';
import { ATSScannerTab } from '../../components/ATSScannerTab';
import { AIAssistantTab } from '../../components/AIAssistantTab';
import { InterviewSimulatorTab } from '../../components/InterviewSimulatorTab';
import { DEFAULT_SAMPLE_RESUME, DEFAULT_ATS_RESULT, DEFAULT_SAMPLE_REPOS } from '../../data/mockProfiles';

interface DashboardLayoutProps {
  user: SaaSUser;
  portfolio: PortfolioConfig;
  activeTab: DashboardTabId;
  onSelectTab: (tab: DashboardTabId) => void;
  onUpdatePortfolio: (updated: Partial<PortfolioConfig>) => void;
  onNavigateHome: () => void;
  onViewPublicPortfolio: () => void;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  portfolio,
  activeTab,
  onSelectTab,
  onUpdatePortfolio,
  onNavigateHome,
  onViewPublicPortfolio,
  onLogout,
}) => {
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [resume, setResume] = useState(DEFAULT_SAMPLE_RESUME);
  const [atsResult, setAtsResult] = useState(DEFAULT_ATS_RESULT);

  const handleSyncGitHub = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onUpdatePortfolio({
        updatedAt: new Date().toISOString(),
      });
    }, 1200);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      onUpdatePortfolio({
        isPublished: true,
        lastPublishedAt: new Date().toISOString(),
      });
    }, 1000);
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    onUpdatePortfolio({ templateId, template: templateId });
  };

  const handleUpdateDomain = (customDomain: string) => {
    onUpdatePortfolio({ customDomain, isDomainVerified: true });
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Bar Header */}
      <TopBar
        portfolio={portfolio}
        user={user}
        activeTab={activeTab}
        viewportMode={viewportMode}
        onSetViewportMode={setViewportMode}
        showViewportControls={activeTab === 'builder'}
        onSyncGitHub={handleSyncGitHub}
        isSyncing={isSyncing}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        onViewPublicPortfolio={onViewPublicPortfolio}
      />

      {/* Main Layout Container */}
      <div className="flex flex-1 min-h-[calc(100vh-3.5rem)] relative">
        
        {/* Sidebar */}
        <Sidebar
          user={user}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onViewPublicPortfolio={onViewPublicPortfolio}
          onLogout={onLogout}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-[#09090b] overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewView
              user={user}
              portfolio={portfolio}
              onNavigateTab={onSelectTab}
              onViewPublic={onViewPublicPortfolio}
            />
          )}

          {activeTab === 'builder' && (
            <BuilderView
              portfolio={portfolio}
              onUpdatePortfolio={onUpdatePortfolio}
              viewportMode={viewportMode}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              portfolio={portfolio}
              onUpdatePortfolio={onUpdatePortfolio}
            />
          )}

          {activeTab === 'templates' && (
            <TemplatesView
              currentTemplateId={portfolio.templateId}
              onSelectTemplate={handleSelectTemplate}
              onPreviewTemplate={(tid) => {
                handleSelectTemplate(tid);
                onSelectTab('builder');
              }}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView portfolio={portfolio} />
          )}

          {activeTab === 'domains' && (
            <DomainsView
              portfolio={portfolio}
              onUpdateDomain={handleUpdateDomain}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              portfolio={portfolio}
              onUpdatePortfolio={onUpdatePortfolio}
            />
          )}

          {activeTab === 'admin' && (
            <AdminView />
          )}

          {/* Career Tools Views */}
          {activeTab === 'resume' && (
            <div className="p-6 max-w-7xl mx-auto">
              <ResumeBuilderTab
                resume={resume}
                onUpdateResume={setResume}
                atsScore={atsResult.overallScore}
                onNavigateToScanner={() => onSelectTab('ats')}
              />
            </div>
          )}

          {activeTab === 'ats' && (
            <div className="p-6 max-w-7xl mx-auto">
              <ATSScannerTab
                resume={resume}
                onUpdateResume={setResume}
                atsResult={atsResult}
                setAtsResult={setAtsResult}
                repos={DEFAULT_SAMPLE_REPOS}
              />
            </div>
          )}

          {activeTab === 'ai-assistant' && (
            <div className="p-6 max-w-7xl mx-auto">
              <AIAssistantTab
                resume={resume}
                repos={DEFAULT_SAMPLE_REPOS}
              />
            </div>
          )}

          {activeTab === 'interview-simulator' && (
            <div className="p-6 max-w-7xl mx-auto">
              <InterviewSimulatorTab
                resume={resume}
                onUpdateResume={setResume}
                repos={DEFAULT_SAMPLE_REPOS}
              />
            </div>
          )}
        </main>
      </div>

    </div>
  );
};
