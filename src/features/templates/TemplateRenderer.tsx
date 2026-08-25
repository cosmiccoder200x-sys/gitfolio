import React from 'react';
import { PortfolioConfig } from '../../types/saas';
import { MinimalTemplate } from './MinimalTemplate';
import { TerminalTemplate } from './TerminalTemplate';
import { BentoTemplate } from './BentoTemplate';
import { EditorialTemplate } from './EditorialTemplate';
import { GradientTemplate } from './GradientTemplate';
import { OpenSourceTemplate } from './OpenSourceTemplate';

interface TemplateRendererProps {
  portfolio: PortfolioConfig;
  isLivePreview?: boolean;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ portfolio, isLivePreview = false }) => {
  switch (portfolio.template) {
    case 'minimal':
      return <MinimalTemplate portfolio={portfolio} isLivePreview={isLivePreview} />;
    case 'terminal':
      return <TerminalTemplate portfolio={portfolio} isLivePreview={isLivePreview} />;
    case 'editorial':
      return <EditorialTemplate portfolio={portfolio} isLivePreview={isLivePreview} />;
    case 'gradient':
      return <GradientTemplate portfolio={portfolio} isLivePreview={isLivePreview} />;
    case 'opensource':
      return <OpenSourceTemplate portfolio={portfolio} isLivePreview={isLivePreview} />;
    case 'bento':
    default:
      return <BentoTemplate portfolio={portfolio} isLivePreview={isLivePreview} />;
  }
};
