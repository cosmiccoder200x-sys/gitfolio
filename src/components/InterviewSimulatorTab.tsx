import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Send, 
  ChevronRight, 
  Award, 
  BookOpen, 
  Code2, 
  Layers, 
  Database, 
  Cloud, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  FileSearch, 
  RefreshCw, 
  ExternalLink,
  HelpCircle,
  FolderGit2,
  Sliders,
  Flame,
  CheckCheck
} from 'lucide-react';
import { 
  ResumeData, 
  InterviewQuestion, 
  InterviewSimulatorResult, 
  AnswerEvaluationResult, 
  GitHubRepo 
} from '../types';
import { generateInterviewPrep, evaluateInterviewAnswer } from '../lib/geminiApi';

interface InterviewSimulatorTabProps {
  resume: ResumeData;
  onUpdateResume?: (resume: ResumeData) => void;
  repos?: GitHubRepo[];
}

const COMMON_TECH_ROLES = [
  'Senior Full-Stack Engineer',
  'Senior Frontend Engineer (React/TypeScript)',
  'Senior Backend & Distributed Systems Engineer (Go/Rust/Node)',
  'DevOps, SRE & Cloud Architect (Kubernetes/AWS)',
  'AI / Machine Learning Engineer (LLMs & RAG)',
  'Mobile Engineer (React Native / iOS / Android)',
  'Staff / Principal Software Engineer',
];

const SAMPLE_JOB_DESCRIPTIONS: Record<string, string> = {
  'Senior Full-Stack Engineer': `We are seeking a Senior Full-Stack Software Engineer to architect and scale mission-critical cloud applications.
Requirements:
- 5+ years of experience with TypeScript, React, Next.js, and Node.js.
- Strong backend experience with PostgreSQL, Redis caching, and RESTful/GraphQL APIs.
- Experience with Docker, Kubernetes, and AWS cloud services (ECS, S3, Lambda, SQS).
- Hands-on expertise in CI/CD automation, microservices architecture, and unit/integration testing (Jest, Playwright).
- Track record of optimizing high-throughput distributed systems and p99 query latencies.`,

  'Senior Frontend Engineer (React/TypeScript)': `Looking for a Senior Frontend Engineer to build high-performance web applications with exceptional UX.
Requirements:
- Deep expertise in modern TypeScript, React 18/19, Next.js, and state management (Redux Toolkit / Zustand).
- Mastery of responsive styling with TailwindCSS, CSS Modules, and modern browser APIs.
- Strong knowledge of frontend performance optimization, Web Vitals, SSR, WebSockets, and bundle size reduction.
- Experience writing comprehensive end-to-end and unit tests with Jest, React Testing Library, and Playwright.
- Collaboration with backend engineers using GraphQL and RESTful APIs.`,

  'Senior Backend & Distributed Systems Engineer (Go/Rust/Node)': `Join our Infrastructure team building resilient, low-latency distributed systems processing millions of events per second.
Requirements:
- 4+ years of backend engineering in Go (Golang), Rust, or Node.js.
- Deep expertise with distributed databases (PostgreSQL, Cassandra) and in-memory caches (Redis).
- Hands-on experience with event streaming (Apache Kafka, RabbitMQ) and gRPC/Protobuf protocols.
- Production experience containerizing services with Docker and deploying to Kubernetes on AWS/GCP.
- Strong grasp of System Design, concurrency, distributed consensus, and observability (Prometheus, Grafana).`,

  'DevOps, SRE & Cloud Architect (Kubernetes/AWS)': `Seeking a Cloud Platform / SRE Lead to architect zero-downtime multi-region cloud infrastructure.
Requirements:
- Production mastery of Kubernetes, Helm, Docker, and service mesh architectures.
- Infrastructure as Code (IaC) with Terraform, CloudFormation, and GitOps workflows (ArgoCD).
- Deep experience across AWS core services (EKS, VPC, IAM, RDS, CloudWatch, SQS).
- Setting up robust CI/CD pipelines via GitHub Actions and automated security scanning.
- Implementation of comprehensive monitoring, distributed tracing (Prometheus, Grafana, OpenTelemetry), and SLO/SLA management.`,

  'AI / Machine Learning Engineer (LLMs & RAG)': `We are building enterprise GenAI systems and require an AI/ML Software Engineer with hands-on LLM deployment experience.
Requirements:
- Strong proficiency in Python, FastAPI, and asynchronous backend systems.
- Production experience with LLM orchestration (LangChain, LlamaIndex, OpenAI / Gemini APIs, Anthropic).
- Knowledge of Retrieval-Augmented Generation (RAG), vector databases (Pinecone, pgvector, Qdrant, Milvus), and embedding models.
- Experience containerizing AI workflows with Docker and deploying on Kubernetes with GPU acceleration.
- Familiarity with prompt evaluation frameworks, fine-tuning, and model latency optimization.`,

  'Mobile Engineer (React Native / iOS / Android)': `Looking for a Senior Mobile Engineer to deliver 5-star cross-platform mobile experiences.
Requirements:
- 4+ years shipping production apps with React Native, TypeScript, and native mobile bridges (iOS/Android).
- Strong state management (Redux, React Query, Zustand) and offline-first data synchronization.
- Experience integrating push notifications, deep linking, background tasks, and native camera/biometrics APIs.
- Automated mobile CI/CD pipelines (Fastlane, Expo Application Services, GitHub Actions).
- End-to-end testing with Detox, Jest, and performance profiling on real devices.`,

  'Staff / Principal Software Engineer': `Seeking a Staff Software Engineer to set architectural direction across multiple product squads.
Requirements:
- 8+ years designing scalable, fault-tolerant distributed systems across microservices and cloud infrastructure.
- Mastery of TypeScript, Go, or Java with deep database tuning in PostgreSQL, Redis, and Kafka.
- Strategic technical leadership, cross-functional system design, and engineering mentorship.
- Experience with high-availability cloud architecture on AWS/GCP, Kubernetes, and zero-trust security.
- Driving engineering excellence, technical RFCs, and SLA/SLO uptime guarantees.`,
};

export const InterviewSimulatorTab: React.FC<InterviewSimulatorTabProps> = ({
  resume,
  onUpdateResume,
  repos = [],
}) => {
  const [selectedRole, setSelectedRole] = useState(resume.targetRole || 'Senior Full-Stack Engineer');
  const [jobDescription, setJobDescription] = useState(
    resume.customJobDescription || SAMPLE_JOB_DESCRIPTIONS[resume.targetRole] || SAMPLE_JOB_DESCRIPTIONS['Senior Full-Stack Engineer']
  );
  const [interviewFocus, setInterviewFocus] = useState<'mixed' | 'system-design' | 'architecture' | 'behavioral'>('mixed');
  
  // Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [prepResult, setPrepResult] = useState<InterviewSimulatorResult | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  
  // Practice Interactive State
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evaluationResults, setEvaluationResults] = useState<Record<string, AnswerEvaluationResult>>({});
  const [isEvaluating, setIsEvaluating] = useState<Record<string, boolean>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<string, 'unseen' | 'needs-practice' | 'mastered'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Practice Timer State (Stopwatch / Countdown)
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Tab View Mode
  const [activeViewMode, setActiveViewMode] = useState<'cards' | 'simulator' | 'cheatsheet'>('simulator');

  // Trigger initial generation on mount if empty
  useEffect(() => {
    if (!prepResult && !isGenerating) {
      handleGenerateQuestions();
    }
  }, []);

  // Timer interval handling
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const result = await generateInterviewPrep({
        resumeData: resume,
        targetRole: selectedRole,
        customJobDescription: jobDescription,
        interviewFocus,
      });
      setPrepResult(result);
      setActiveQuestionIndex(0);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      
      // Initialize status
      const initialStatus: Record<string, 'unseen' | 'needs-practice' | 'mastered'> = {};
      result.questions.forEach((q, idx) => {
        initialStatus[q.id || `q-${idx}`] = idx === 0 ? 'needs-practice' : 'unseen';
      });
      setQuestionStatus(initialStatus);
    } catch (err) {
      console.error('Failed to generate interview prep:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async (question: InterviewQuestion) => {
    const qId = question.id;
    const answer = userAnswers[qId];
    if (!answer || answer.trim().length < 15) {
      return;
    }

    setIsEvaluating((prev) => ({ ...prev, [qId]: true }));
    try {
      const feedback = await evaluateInterviewAnswer({
        question: question.question,
        candidateAnswer: answer,
        keyCriteria: question.keyEvaluationCriteria,
        starAnswerModel: question.starAnswerModel,
        targetRole: selectedRole,
      });

      setEvaluationResults((prev) => ({ ...prev, [qId]: feedback }));
      if (feedback.score >= 85) {
        setQuestionStatus((prev) => ({ ...prev, [qId]: 'mastered' }));
      } else {
        setQuestionStatus((prev) => ({ ...prev, [qId]: 'needs-practice' }));
      }
    } catch (err) {
      console.error('Answer evaluation failed:', err);
    } finally {
      setIsEvaluating((prev) => ({ ...prev, [qId]: false }));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeQuestion = prepResult?.questions[activeQuestionIndex];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'System Design': return Layers;
      case 'Frontend Architecture': return Code2;
      case 'Backend & Data': return Database;
      case 'DevOps & Cloud': return Cloud;
      case 'Behavioral & Leadership': return MessageSquare;
      default: return Sparkles;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Senior/Lead': return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Hard': return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default: return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    }
  };

  // Calculate mastery stats
  const totalQuestions = prepResult?.questions.length || 0;
  const masteredCount = Object.values(questionStatus).filter((s) => s === 'mastered').length;
  const practiceCount = Object.values(questionStatus).filter((s) => s === 'needs-practice').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* TOP HERO & CONFIGURATION CARD */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Technical Interview Simulator
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              5 role-specific interview questions with STAR answers, audio speech, and AI evaluation
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Generating Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 5 Questions</span>
              </>
            )}
          </button>
        </div>

        {/* Configuration Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-zinc-800">
          
          {/* Target Role Selector */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                const role = e.target.value;
                setSelectedRole(role);
                setJobDescription(SAMPLE_JOB_DESCRIPTIONS[role] || '');
              }}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {COMMON_TECH_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Interview Focus Type */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interview Style Focus</span>
            </label>
            <select
              value={interviewFocus}
              onChange={(e) => setInterviewFocus(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-200 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="mixed">Mixed (System Design + Code + Incident)</option>
              <option value="system-design">System Design & High Concurrency</option>
              <option value="architecture">Deep Dive into Resume Projects</option>
              <option value="behavioral">Production Incidents & Leadership</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Study Mode</span>
            </label>
            <div className="flex items-center p-0.5 bg-zinc-950/80 border border-zinc-800 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveViewMode('simulator')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'simulator'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Live Simulator</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveViewMode('cheatsheet')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeViewMode === 'cheatsheet'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cheat Sheet</span>
              </button>
            </div>
          </div>

        </div>

        {/* Collapsible JD preview */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <FileSearch className="w-3.5 h-3.5 text-indigo-400" />
              Active Job Description Context ({selectedRole})
            </span>
            <button
              type="button"
              onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTIONS[selectedRole] || '')}
              className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              Reset to Role Template
            </button>
          </div>
          <textarea
            rows={2}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste custom job posting description to tailor interview questions specifically to the company..."
            className="w-full p-2.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs outline-none focus:border-indigo-500 resize-none text-zinc-300"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN QUESTIONS CAROUSEL / NAVIGATOR */}
      {/* ========================================================================= */}
      {prepResult && (
        <div className="space-y-6">
          
          {/* Top Progress & Quick Jump Strip */}
          <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-4 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Question Quick Jump Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {prepResult.questions.map((q, idx) => {
                const isActive = activeQuestionIndex === idx;
                const status = questionStatus[q.id || `q-${idx}`];
                const Icon = getCategoryIcon(q.category);

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => {
                      setActiveQuestionIndex(idx);
                      setTimerSeconds(0);
                      setIsTimerRunning(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 border cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-400/50 shadow-[0_0_12px_rgba(79,70,229,0.3)]'
                        : 'bg-zinc-950/70 text-zinc-400 border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-black/30 flex items-center justify-center text-[10px] font-mono">
                      0{idx + 1}
                    </span>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px] sm:max-w-[160px]">{q.category}</span>
                    
                    {status === 'mastered' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Preparation Summary Stats */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-300">
                <span className="text-zinc-500 font-bold uppercase text-[10px]">Mastery:</span>
                <span className="font-bold text-emerald-400">{masteredCount}</span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400 font-semibold">{totalQuestions} Solved</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* VIEW MODE 1: INTERACTIVE SIMULATOR (QUESTION DEEP-DIVE) */}
          {/* ========================================================================= */}
          {activeViewMode === 'simulator' && activeQuestion && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: THE QUESTION & INTERACTIVE PRACTICE CANVAS (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Question Card */}
                <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
                  
                  {/* Meta Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold flex items-center gap-1.5">
                        {React.createElement(getCategoryIcon(activeQuestion.category), { className: 'w-3.5 h-3.5' })}
                        <span>{activeQuestion.category}</span>
                      </span>

                      <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${getDifficultyColor(activeQuestion.difficulty)}`}>
                        {activeQuestion.difficulty}
                      </span>
                    </div>

                    {/* Audio Reader & Copy */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSpeakQuestion(activeQuestion.question)}
                        className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isSpeaking 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                            : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                        }`}
                        title="Read question out loud like an interviewer"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span className="text-[11px]">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(activeQuestion.question, `q-${activeQuestion.id}`)}
                        className="p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
                        title="Copy question text"
                      >
                        {copiedId === `q-${activeQuestion.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* The Main Question Header */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-1">
                      Question 0{activeQuestionIndex + 1} of 05
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      "{activeQuestion.question}"
                    </h2>
                  </div>

                  {/* Context In Resume & Target Requirement */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-zinc-800/80 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-0.5">
                        Triggered by Your Resume
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        {activeQuestion.contextInResume}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                      <span className="text-[10px] uppercase font-bold text-teal-400 block mb-0.5">
                        Target Job Requirement
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        {activeQuestion.jobRequirementTarget}
                      </p>
                    </div>
                  </div>

                  {/* Key Signals / Evaluation Criteria Expected */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-zinc-400 block">
                      Key Technical Signals Interviewers Are Scoring:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5">
                      {activeQuestion.keyEvaluationCriteria.map((crit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 bg-zinc-950/40 px-2.5 py-1.5 rounded-lg border border-zinc-800/50">
                          <CheckCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Interactive Answer Box with Timer */}
                <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
                  
                  {/* Timer & Input Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Practice Your Verbal Response
                      </h3>
                    </div>

                    {/* Timer Widget */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 shadow-inner">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono text-xs font-bold text-zinc-200">
                        {formatTimer(timerSeconds)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="ml-1 p-1 text-zinc-400 hover:text-white transition cursor-pointer"
                        title={isTimerRunning ? 'Pause timer' : 'Start answer timer'}
                      >
                        {isTimerRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(0);
                        }}
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                        title="Reset timer"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Practice Textarea */}
                  <textarea
                    rows={4}
                    placeholder="Type or outline your spoken response here (Situation, Task, Action, Result, and metrics). Click 'Evaluate My Answer' below for AI critique..."
                    value={userAnswers[activeQuestion.id] || ''}
                    onChange={(e) =>
                      setUserAnswers((prev) => ({
                        ...prev,
                        [activeQuestion.id]: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs outline-none focus:border-indigo-500 resize-none text-zinc-200 placeholder:text-zinc-600 leading-relaxed font-sans"
                  />

                  {/* Evaluate Action Bar */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-zinc-500">
                      {(userAnswers[activeQuestion.id] || '').length} characters entered
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEvaluateAnswer(activeQuestion)}
                      disabled={
                        isEvaluating[activeQuestion.id] ||
                        !(userAnswers[activeQuestion.id] && userAnswers[activeQuestion.id].trim().length >= 15)
                      }
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(79,70,229,0.3)] disabled:opacity-50 cursor-pointer"
                    >
                      {isEvaluating[activeQuestion.id] ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Critiquing Answer...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Evaluate My Answer with AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Live Evaluation Result Card */}
                  {evaluationResults[activeQuestion.id] && (
                    <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-indigo-500/30 space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-indigo-400" />
                          <span className="text-xs font-bold text-white">AI Evaluation Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-indigo-300 px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/30">
                            {evaluationResults[activeQuestion.id].score}/100
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            {evaluationResults[activeQuestion.id].grade}
                          </span>
                        </div>
                      </div>

                      {/* Strengths & Missing Nuances */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Key Strengths
                          </span>
                          <ul className="space-y-1 text-zinc-300 text-[11px]">
                            {evaluationResults[activeQuestion.id].strengths.map((st, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-500">•</span>
                                <span>{st}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase text-amber-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Missed Technical Nuances
                          </span>
                          <ul className="space-y-1 text-zinc-300 text-[11px]">
                            {evaluationResults[activeQuestion.id].missingPoints.map((mp, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-500">•</span>
                                <span>{mp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* AI Enhanced Rephrase */}
                      <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase text-indigo-400 block">
                          Suggested High-Impact Rephrase:
                        </span>
                        <p className="text-zinc-200 italic leading-relaxed text-[11px]">
                          "{evaluationResults[activeQuestion.id].improvedAnswer}"
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* RIGHT COLUMN: FULL STAR MODEL ANSWER & COACHING TIPS (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* STAR Model Answer Card */}
                <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Full STAR Model Answer
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(activeQuestion.starAnswerModel.conciseScript, `script-${activeQuestion.id}`)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-indigo-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === `script-${activeQuestion.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied Script</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy 90s Script</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 90-Second Spoken Pitch */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-indigo-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        Verbatim 90-Second Interview Script
                      </span>
                    </div>
                    <p className="text-xs text-zinc-100 font-medium leading-relaxed bg-zinc-950/40 p-2.5 rounded-lg border border-indigo-500/20">
                      "{activeQuestion.starAnswerModel.conciseScript}"
                    </p>
                  </div>

                  {/* Granular STAR Breakdown */}
                  <div className="space-y-2.5 text-xs">
                    
                    <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/60">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-0.5">
                        [S] Situation
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        {activeQuestion.starAnswerModel.situation}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/60">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 block mb-0.5">
                        [T] Task
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        {activeQuestion.starAnswerModel.task}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/60">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block mb-0.5">
                        [A] Engineering Action Taken
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        {activeQuestion.starAnswerModel.action}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/60">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-0.5">
                        [R] Quantifiable Result & Impact
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        {activeQuestion.starAnswerModel.result}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Pitfalls & Follow-Up Probes Card */}
                <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4">
                  
                  {/* Common Pitfalls */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      Candidate Pitfalls to Avoid
                    </span>
                    <div className="space-y-1.5 text-xs text-zinc-300">
                      {activeQuestion.commonPitfalls.map((pitfall, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-rose-950/20 border border-rose-500/20 p-2 rounded-lg text-[11px] text-rose-200">
                          <span className="font-bold text-rose-400">✕</span>
                          <span>{pitfall}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follow-Up Probing Questions */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <span className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                      Interviewer Follow-Up Questions
                    </span>
                    <div className="space-y-1.5 text-xs text-zinc-300">
                      {activeQuestion.followUpQuestions.map((followUp, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-sky-950/20 border border-sky-500/20 p-2 rounded-lg text-[11px] text-sky-200">
                          <span className="font-bold text-sky-400">→</span>
                          <span>"{followUp}"</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW MODE 2: CHEAT SHEET (ALL 5 QUESTIONS COMPACT OVERVIEW) */}
          {/* ========================================================================= */}
          {activeViewMode === 'cheatsheet' && (
            <div className="space-y-4">
              {prepResult.questions.map((q, idx) => {
                const Icon = getCategoryIcon(q.category);
                return (
                  <div
                    key={q.id || idx}
                    className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs font-mono font-bold text-indigo-300">
                          0{idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] font-bold flex items-center gap-1">
                          <Icon className="w-3 h-3 text-indigo-400" />
                          <span>{q.category}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(q.starAnswerModel.conciseScript, `cheat-${idx}`)}
                        className="px-3 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-indigo-300 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        {copiedId === `cheat-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        "{q.question}"
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-1">
                        <strong className="text-indigo-400">Context:</strong> {q.contextInResume} • <strong className="text-teal-400">Tests:</strong> {q.jobRequirementTarget}
                      </p>
                    </div>

                    {/* Concise Script Box */}
                    <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                        Spoken Model Response:
                      </span>
                      <p className="text-xs text-zinc-200 leading-relaxed italic">
                        "{q.starAnswerModel.conciseScript}"
                      </p>
                    </div>

                    {/* Key signals and pitfalls in 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60">
                        <span className="text-[10px] font-bold uppercase text-indigo-400 block mb-1">
                          Key Evaluation Criteria:
                        </span>
                        <ul className="space-y-1 text-zinc-300 text-[11px]">
                          {q.keyEvaluationCriteria.map((c, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-indigo-400 font-bold">✓</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60">
                        <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">
                          Common Pitfalls:
                        </span>
                        <ul className="space-y-1 text-zinc-300 text-[11px]">
                          {q.commonPitfalls.map((p, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-rose-400 font-bold">✕</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
