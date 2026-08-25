export type TemplateId = 'minimal' | 'terminal' | 'bento' | 'editorial' | 'gradient' | 'opensource';

export interface SaaSUser {
  id: string;
  githubId: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  followers: number;
  following: number;
  publicReposCount: number;
  totalStars: number;
  totalCommits: number;
  createdAt: string;
  plan: 'free' | 'pro' | 'developer';
  isAdmin?: boolean;
}

export interface SaaSProject {
  id: string;
  repoId?: number;
  name: string;
  displayName: string;
  description: string;
  customDescription?: string;
  language: string;
  stars: number;
  forks: number;
  githubUrl: string;
  liveUrl?: string;
  image?: string;
  tags: string[];
  featured: boolean;
  isAiRecommended?: boolean;
  updatedAt: string;
}

export interface PortfolioSection {
  id: 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'github_activity' | 'achievements' | 'contact';
  name: string;
  enabled: boolean;
  order: number;
}

export interface PortfolioThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: 'Inter' | 'Geist' | 'JetBrains Mono' | 'Playfair Display' | 'Plus Jakarta Sans';
  borderRadius: 'sm' | 'md' | 'lg' | 'full';
  showBadges: boolean;
  showGithubStats: boolean;
  showContactForm: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  graduationYear: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface PortfolioConfig {
  id: string;
  userId: string;
  slug: string;
  title: string;
  tagline: string;
  aboutText: string;
  template: TemplateId;
  templateId: TemplateId;
  theme: PortfolioThemeConfig;
  sections: PortfolioSection[];
  projects: SaaSProject[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  experiences: ExperienceItem[];
  education: EducationItem[];
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
    website?: string;
  };
  customDomain?: string;
  isDomainVerified?: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  views: number;
  lastPublishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsVisitor {
  id: string;
  timestamp: string;
  referrer: string;
  country: string;
  city: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  pageViewed: string;
  durationSeconds: number;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: 'Clean' | 'Technical' | 'Modern' | 'Editorial' | 'Vibrant' | 'Open Source';
  description: string;
  thumbnail: string;
  features: string[];
  isPremium?: boolean;
}

export interface ShowcasePortfolio {
  id: string;
  name: string;
  username: string;
  role: string;
  template: TemplateId;
  avatar: string;
  stars: number;
  previewUrl: string;
  tags: string[];
  category: 'web' | 'ai' | 'data' | 'opensource' | 'student' | 'designer';
}

export interface PricingTier {
  id: 'free' | 'pro' | 'developer';
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  popular?: boolean;
  features: string[];
  cta: string;
}
