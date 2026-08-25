import React from 'react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { StatsSection } from './StatsSection';
import { HowItWorks } from './HowItWorks';
import { FeatureGrid } from './FeatureGrid';
import { TemplateShowcase } from './TemplateShowcase';
import { CommunityShowcase } from './CommunityShowcase';
import { PricingSection } from './PricingSection';
import { Footer } from './Footer';
import { TemplateId } from '../../types/saas';

interface LandingPageProps {
  onOpenAuth: () => void;
  onFastGenerate: (username: string) => void;
  onNavigateToDashboard: () => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  onViewShowcaseProfile: (username: string) => void;
  isAuthenticated: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onFastGenerate,
  onNavigateToDashboard,
  onSelectTemplate,
  onViewShowcaseProfile,
  isAuthenticated,
}) => {
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Sticky Navbar */}
      <Navbar
        onOpenAuth={onOpenAuth}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateSection={handleScrollToSection}
        isAuthenticated={isAuthenticated}
      />

      <main>
        {/* 2. Hero Section with Live Portfolio Preview */}
        <HeroSection
          onFastGenerate={onFastGenerate}
          onExploreExamples={() => handleScrollToSection('showcase')}
        />

        {/* 3. Platform Stats Bar */}
        <StatsSection />

        {/* 4. Simple 3-Step Process */}
        <HowItWorks onGetStarted={onOpenAuth} />

        {/* 5. Full Feature Grid */}
        <FeatureGrid />

        {/* 6. 6 Unique Templates Showcase */}
        <TemplateShowcase
          onSelectTemplate={onSelectTemplate}
          onPreviewTemplate={onSelectTemplate}
        />

        {/* 7. Community Portfolios Showcase */}
        <CommunityShowcase
          onViewShowcaseProfile={onViewShowcaseProfile}
        />

        {/* 8. Pricing Plans */}
        <PricingSection
          onSelectTier={() => onOpenAuth()}
        />
      </main>

      {/* 9. SaaS Footer */}
      <Footer />

    </div>
  );
};
