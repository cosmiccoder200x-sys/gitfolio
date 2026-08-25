import { 
  ResumeData, 
  ATSAnalysisResult, 
  GitHubUser, 
  GitHubRepo,
  InterviewSimulatorResult,
  AnswerEvaluationResult
} from '../types';

export async function syncGithub(username: string, token?: string): Promise<{
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: Record<string, number>;
}> {
  const response = await fetch('/api/github/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, token }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to sync GitHub data (${response.status})`);
  }

  return response.json();
}

export const fetchGitHubData = syncGithub;

export async function generateProjectBullets(params: {
  projectName: string;
  description?: string;
  language?: string;
  topics?: string[];
  targetRole?: string;
  stars?: number;
}): Promise<{
  bullets: string[];
  suggestedRole: string;
  techStack: string[];
}> {
  const response = await fetch('/api/gemini/generate-bullets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate STAR bullets via AI');
  }

  return response.json();
}

export async function parseLinkedInUrl(profileUrl: string, targetRole?: string): Promise<Partial<ResumeData>> {
  const response = await fetch('/api/gemini/parse-linkedin-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileUrl, targetRole }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to scrape and parse LinkedIn profile URL via Gemini');
  }

  return response.json();
}

export async function parseLinkedInText(rawText: string): Promise<Partial<ResumeData>> {
  const response = await fetch('/api/gemini/parse-linkedin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to parse LinkedIn text via AI');
  }

  return response.json();
}

export async function runAtsScan(params: {
  resumeData: ResumeData;
  targetRole: string;
  customJobDescription?: string;
}): Promise<ATSAnalysisResult> {
  const response = await fetch('/api/gemini/ats-scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to run ATS scanner via AI');
  }

  return response.json();
}

export async function sendAiChat(params: {
  message: string;
  history?: any[];
  resumeContext?: any;
}): Promise<{ reply: string }> {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get response from AI Assistant');
  }

  return response.json();
}

export async function generateInterviewPrep(params: {
  resumeData: ResumeData;
  targetRole?: string;
  customJobDescription?: string;
  interviewFocus?: string;
}): Promise<InterviewSimulatorResult> {
  const response = await fetch('/api/gemini/generate-interview-prep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate interview simulator questions');
  }

  return response.json();
}

export async function evaluateInterviewAnswer(params: {
  question: string;
  candidateAnswer: string;
  keyCriteria?: string[];
  starAnswerModel?: any;
  targetRole?: string;
}): Promise<AnswerEvaluationResult> {
  const response = await fetch('/api/gemini/evaluate-interview-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to evaluate interview answer');
  }

  return response.json();
}

