import React, { useState } from 'react';
import { PortfolioConfig, SaaSUser, TemplateId, ViewportMode } from '../../types/saas';
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

interface DashboardLayoutProps {
  user: SaaSUser;
  portfolio: PortfolioConfig;
  activeTab: string;
  onSelectTab: (tab: any) => void;
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSyncGitHub = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onUpdatePortfolio({
        updatedAt: new Date().toISOString(),
      });
    }, 1500);
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    onUpdatePortfolio({ templateId });
  };

  const handleUpdateDomain = (customDomain: string) => {
    onUpdatePortfolio({ customDomain, isDomainVerified: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Top Bar Header */}
      <TopBar
        portfolio={portfolio}
        user={user}
        viewportMode={viewportMode}
        onViewportChange={setViewportMode}
        onSyncGitHub={handleSyncGitHub}
        isSyncing={isSyncing}
        onPublish={onViewPublicPortfolio}
      />

      {/* Main Container */}
      <div className="flex flex-1 pt-14 min-h-[calc(100vh-3.5rem)] relative">
        
        {/* Persistent Dark Sidebar */}
        <Sidebar
          user={user}
          portfolio={portfolio}
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onNavigateHome={onNavigateHome}
          onViewPublicPortfolio={onViewPublicPortfolio}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content Area */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'} min-w-0 bg-[#0a0a0c]`}>
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
        </main>
      </div>

    </div>
  );
};
