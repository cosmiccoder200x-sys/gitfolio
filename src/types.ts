export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  readmeSummary?: string;
  languagesBreakdown?: Record<string, number>;
  selectedForResume?: boolean;
  selectedForPortfolio?: boolean;
  customTitle?: string;
  customBullets?: string[];
  demoUrl?: string;
}

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
  techStack?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  gpa?: string;
  honors?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  description?: string;
  bullets: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
  isFeatured?: boolean;
}

export interface SkillCategory {
  languages: string[];
  frameworks: string[];
  cloudAndDevOps: string[];
  databasesAndTools: string[];
  concepts: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  githubUrl: string;
  linkedinUrl: string;
  summary: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  targetRole: string;
  customJobDescription?: string;
  experience: WorkExperience[];
  projects: ProjectItem[];
  skills: SkillCategory;
  education: EducationItem[];
  certifications: CertificationItem[];
}

export interface ATSAnalysisResult {
  overallScore: number;
  matchGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  breakdown: {
    keywordMatch: number;
    actionVerbStrength: number;
    quantifiedMetrics: number;
    atsFormatReadiness: number;
    brevityAndImpact: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  criticalFixes: {
    issue: string;
    suggestion: string;
    targetSection: 'summary' | 'experience' | 'projects' | 'skills';
    type: 'critical' | 'warning' | 'info';
  }[];
  bulletEnhancements: {
    original: string;
    improved: string;
    reason: string;
  }[];
  roleSummaryTip: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'System Design' | 'Frontend Architecture' | 'Backend & Data' | 'DevOps & Cloud' | 'Core CS / Algorithms' | 'Behavioral & Leadership';
  difficulty: 'Medium' | 'Hard' | 'Senior/Lead';
  contextInResume: string;
  jobRequirementTarget: string;
  keyEvaluationCriteria: string[];
  starAnswerModel: {
    situation: string;
    task: string;
    action: string;
    result: string;
    conciseScript: string;
  };
  commonPitfalls: string[];
  followUpQuestions: string[];
}

export interface InterviewSimulatorResult {
  role: string;
  readinessScore: number;
  roleFocusSummary: string;
  questions: InterviewQuestion[];
}

export interface AnswerEvaluationResult {
  score: number;
  grade: 'Exceptional' | 'Strong' | 'Needs Improvement' | 'Unprepared';
  strengths: string[];
  missingPoints: string[];
  improvedAnswer: string;
  deliveryTip: string;
}

export type PortfolioTheme = 'minimalist' | 'professional' | 'creative' | 'terminal' | 'clean' | 'editorial' | 'neobrutalist';

export interface PortfolioSettings {
  theme: PortfolioTheme;
  accentColor: string;
  showLanguageStats: boolean;
  showStarCount: boolean;
  showWorkExperience: boolean;
  showRecentActivity: boolean;
  customHeading?: string;
  customTagline?: string;
  contactEmail?: string;
  ctaText?: string;
  fontPairing?: string;
}

export type ActiveTab = 'dashboard' | 'repositories' | 'resume-builder' | 'ats-scanner' | 'interview-simulator' | 'portfolio' | 'ai-assistant';
export type TabType = ActiveTab;

