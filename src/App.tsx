import React, { useState, useEffect } from 'react';
import { SaaSUser, PortfolioConfig, TemplateId } from './types/saas';
import { MOCK_DEFAULT_USER, MOCK_PORTFOLIO_CONFIG } from './data/mockSaasData';

import { LandingPage } from './features/landing/LandingPage';
import { DashboardLayout } from './features/dashboard/DashboardLayout';
import { PublicPortfolioPage } from './features/public/PublicPortfolioPage';
import { AuthModal } from './features/auth/AuthModal';
import { OnboardingPipelineModal } from './features/auth/OnboardingPipelineModal';

const SAAS_STORAGE_KEY_USER = 'gitfolio_saas_user_v2';
const SAAS_STORAGE_KEY_PORTFOLIO = 'gitfolio_saas_portfolio_v2';

export default function App() {
  // Navigation & Routing State
  const [currentRoute, setCurrentRoute] = useState<'landing' | 'dashboard' | 'public-portfolio'>('landing');
  const [activeDashboardTab, setActiveDashboardTab] = useState<
    'overview' | 'builder' | 'projects' | 'templates' | 'analytics' | 'domains' | 'settings' | 'admin'
  >('overview');

  // Core Data Models
  const [user, setUser] = useState<SaaSUser>(() => {
    try {
      const saved = localStorage.getItem(SAAS_STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading user from storage', e);
    }
    return MOCK_DEFAULT_USER;
  });

  const [portfolio, setPortfolio] = useState<PortfolioConfig>(() => {
    try {
      const saved = localStorage.getItem(SAAS_STORAGE_KEY_PORTFOLIO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed loading portfolio from storage', e);
    }
    return MOCK_PORTFOLIO_CONFIG;
  });

  // Modal Flow States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [targetUsername, setTargetUsername] = useState('sreerang');
  const [selectedInitialTemplate, setSelectedInitialTemplate] = useState<TemplateId | undefined>(undefined);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(SAAS_STORAGE_KEY_USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed saving user', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(SAAS_STORAGE_KEY_PORTFOLIO, JSON.stringify(portfolio));
    } catch (e) {
      console.warn('Failed saving portfolio', e);
    }
  }, [portfolio]);

  // Auth & Onboarding Handlers
  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleUsernameSubmitFromLanding = (username: string) => {
    setTargetUsername(username);
    setIsOnboardingOpen(true);
  };

  const handleSelectTemplateFromLanding = (templateId: TemplateId) => {
    setSelectedInitialTemplate(templateId);
    setPortfolio((prev) => ({ ...prev, templateId }));
    setIsOnboardingOpen(true);
  };

  const handleAuthSuccess = (username: string) => {
    setIsAuthModalOpen(false);
    setTargetUsername(username);
    setIsOnboardingOpen(true);
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    setUser((prev) => ({
      ...prev,
      githubUsername: targetUsername,
      name: targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1),
    }));
    setPortfolio((prev) => ({
      ...prev,
      slug: targetUsername,
      title: `${targetUsername.charAt(0).toUpperCase() + targetUsername.slice(1)} - Developer Portfolio`,
      templateId: selectedInitialTemplate || prev.templateId,
    }));
    setCurrentRoute('dashboard');
    setActiveDashboardTab('overview');
  };

  const handleUpdatePortfolio = (updatedFields: Partial<PortfolioConfig>) => {
    setPortfolio((prev) => ({
      ...prev,
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans antialiased">
      
      {/* 1. SaaS Landing Page */}
      {currentRoute === 'landing' && (
        <LandingPage
          onGetStarted={handleOpenAuth}
          onDirectUsernameSubmit={handleUsernameSubmitFromLanding}
          onSelectTemplate={handleSelectTemplateFromLanding}
          onViewLiveDemo={() => setCurrentRoute('public-portfolio')}
        />
      )}

      {/* 2. SaaS Application Dashboard */}
      {currentRoute === 'dashboard' && (
        <DashboardLayout
          user={user}
          portfolio={portfolio}
          activeTab={activeDashboardTab}
          onSelectTab={setActiveDashboardTab}
          onUpdatePortfolio={handleUpdatePortfolio}
          onNavigateHome={() => setCurrentRoute('landing')}
          onViewPublicPortfolio={() => setCurrentRoute('public-portfolio')}
          onLogout={() => {
            setCurrentRoute('landing');
          }}
        />
      )}

      {/* 3. Public Published Portfolio View (gitfolio.dev/:slug) */}
      {currentRoute === 'public-portfolio' && (
        <PublicPortfolioPage
          portfolio={portfolio}
          onBackToDashboard={() => {
            setCurrentRoute('dashboard');
          }}
        />
      )}

      {/* Auth Modal (GitHub Login / Username prompt) */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {/* Onboarding Pipeline Modal (4-step real-time GitHub sync) */}
      {isOnboardingOpen && (
        <OnboardingPipelineModal
          isOpen={isOnboardingOpen}
          githubUsername={targetUsername}
          onComplete={handleOnboardingComplete}
        />
      )}

    </div>
  );
}
