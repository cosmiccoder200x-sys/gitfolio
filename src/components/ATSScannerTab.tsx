import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Check, 
  ArrowRight, 
  FileSearch, 
  Zap, 
  ShieldCheck,
  Target,
  RefreshCw,
  Sliders,
  TrendingUp,
  Award,
  Layers,
  Cpu,
  Search,
  Code2,
  Database,
  Cloud,
  BookOpen,
  Tag,
  ChevronDown,
  ChevronUp,
  FolderGit2,
  Lightbulb,
  ExternalLink,
  Filter
} from 'lucide-react';
import { ResumeData, ATSAnalysisResult, GitHubRepo, ProjectItem } from '../types';
import { runAtsScan } from '../lib/geminiApi';

interface ATSScannerTabProps {
  resume: ResumeData;
  onUpdateResume: (resume: ResumeData) => void;
  atsResult: ATSAnalysisResult | null;
  setAtsResult: (res: ATSAnalysisResult) => void;
  repos?: GitHubRepo[];
}

interface BenchmarkSkill {
  name: string;
  category: 'languages' | 'frameworks' | 'cloudAndDevOps' | 'databasesAndTools' | 'concepts';
  importance: 'critical' | 'preferred';
  aiSuggestion: string;
}

const COMMON_TECH_ROLES = [
  'Senior Full-Stack Engineer',
  'Senior Frontend Engineer (React/TypeScript)',
  'Senior Backend & Distributed Systems Engineer (Go/Rust/Node)',
  'DevOps, SRE & Cloud Architect (Kubernetes/AWS)',
  'Staff / Principal Software Engineer',
  'AI / Machine Learning Engineer (LLMs & RAG)',
  'Mobile Engineer (React Native / iOS / Android)',
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

const ROLE_BENCHMARK_KEYWORDS: Record<string, BenchmarkSkill[]> = {
  'Senior Full-Stack Engineer': [
    { name: 'TypeScript', category: 'languages', importance: 'critical', aiSuggestion: 'Highlight end-to-end type safety across client and server with shared zod schemas.' },
    { name: 'React', category: 'frameworks', importance: 'critical', aiSuggestion: 'Showcase complex state management, custom hooks, and virtualized list rendering.' },
    { name: 'Node.js', category: 'frameworks', importance: 'critical', aiSuggestion: 'Demonstrate asynchronous event loops, Express/Fastify REST endpoints, and middleware architecture.' },
    { name: 'Next.js', category: 'frameworks', importance: 'critical', aiSuggestion: 'Feature Server Components (RSC), dynamic SSR routing, and edge API handlers.' },
    { name: 'PostgreSQL', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Document schema normalization, indexing strategies, and query performance tuning.' },
    { name: 'Redis', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Quantify caching latency reductions (e.g. 70% cache hit rate cutting p99 response times).' },
    { name: 'Docker', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Mention multi-stage Docker builds reducing image size by 65% for containerized services.' },
    { name: 'Kubernetes', category: 'cloudAndDevOps', importance: 'preferred', aiSuggestion: 'Describe deploying pods, ingress controllers, and auto-scaling deployments.' },
    { name: 'AWS', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Specify AWS service integration such as S3 storage, ECS/EKS clusters, or Lambda serverless.' },
    { name: 'GraphQL', category: 'frameworks', importance: 'preferred', aiSuggestion: 'Detail building typed schemas, resolvers, and dataloaders to eliminate N+1 queries.' },
    { name: 'TailwindCSS', category: 'frameworks', importance: 'preferred', aiSuggestion: 'Emphasize responsive utility styling, dark mode support, and zero runtime CSS overhead.' },
    { name: 'CI/CD Pipeline', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Detail GitHub Actions automation for automated linting, test suites, and preview deploys.' },
    { name: 'Jest', category: 'concepts', importance: 'critical', aiSuggestion: 'Quantify unit and integration test coverage exceeding 85% across core business logic.' },
    { name: 'Microservices', category: 'concepts', importance: 'preferred', aiSuggestion: 'Describe decomposing monolithic codebases into decoupled, domain-driven services.' },
    { name: 'System Design', category: 'concepts', importance: 'critical', aiSuggestion: 'Highlight high-concurrency architecture supporting 10k+ concurrent active users.' },
  ],

  'Senior Frontend Engineer (React/TypeScript)': [
    { name: 'TypeScript', category: 'languages', importance: 'critical', aiSuggestion: 'Showcase strict TypeScript configuration, generic components, and type guards.' },
    { name: 'React', category: 'frameworks', importance: 'critical', aiSuggestion: 'Demonstrate React 18 concurrency, Suspense, and performant memoization.' },
    { name: 'Next.js', category: 'frameworks', importance: 'critical', aiSuggestion: 'Highlight Incremental Static Regeneration (ISR) and SEO-optimized page delivery.' },
    { name: 'TailwindCSS', category: 'frameworks', importance: 'critical', aiSuggestion: 'Feature fluid responsive layouts and cohesive design token design systems.' },
    { name: 'Redux', category: 'frameworks', importance: 'preferred', aiSuggestion: 'Describe centralized state management with Redux Toolkit slices and RTK Query.' },
    { name: 'WebSockets', category: 'concepts', importance: 'preferred', aiSuggestion: 'Showcase real-time bidirectional streaming for live collaboration or dashboard metrics.' },
    { name: 'Jest', category: 'concepts', importance: 'critical', aiSuggestion: 'Document comprehensive component unit tests with React Testing Library.' },
    { name: 'Playwright', category: 'concepts', importance: 'preferred', aiSuggestion: 'Detail end-to-end visual regression testing preventing customer-facing regressions.' },
    { name: 'Performance Optimization', category: 'concepts', importance: 'critical', aiSuggestion: 'Quantify 95+ Google Lighthouse scores and sub-1.2s Largest Contentful Paint (LCP).' },
    { name: 'RESTful APIs', category: 'concepts', importance: 'critical', aiSuggestion: 'Describe resilient API consumption with optimistic UI updates and retry backoffs.' },
    { name: 'GraphQL', category: 'frameworks', importance: 'preferred', aiSuggestion: 'Detail Apollo Client caching strategies and automated GraphQL code generation.' },
    { name: 'Vite', category: 'databasesAndTools', importance: 'preferred', aiSuggestion: 'Mention sub-second HMR dev server setup and optimized Rollup asset bundling.' },
  ],

  'Senior Backend & Distributed Systems Engineer (Go/Rust/Node)': [
    { name: 'Go', category: 'languages', importance: 'critical', aiSuggestion: 'Highlight goroutines, channel concurrency, and high-throughput HTTP/gRPC services.' },
    { name: 'Node.js', category: 'frameworks', importance: 'critical', aiSuggestion: 'Feature asynchronous non-blocking I/O and event-driven architecture.' },
    { name: 'Python', category: 'languages', importance: 'preferred', aiSuggestion: 'Demonstrate data pipeline processing and automated microservice tooling.' },
    { name: 'PostgreSQL', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Quantify query plan optimizations, partition tables, and connection pooling with PgBouncer.' },
    { name: 'Redis', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Detail distributed locking, pub/sub channels, and rate-limiting middleware.' },
    { name: 'Kafka', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Describe event-driven topic partitions processing 50k+ events/sec with consumer groups.' },
    { name: 'Docker', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Showcase lightweight alpine containerization and reproducible runtime configurations.' },
    { name: 'Kubernetes', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Detail orchestrating microservices with zero-downtime rolling updates.' },
    { name: 'gRPC', category: 'concepts', importance: 'preferred', aiSuggestion: 'Emphasize high-speed inter-service RPC communication using Protocol Buffers.' },
    { name: 'Microservices', category: 'concepts', importance: 'critical', aiSuggestion: 'Highlight domain-driven service boundaries and distributed tracing with OpenTelemetry.' },
    { name: 'Distributed Systems', category: 'concepts', importance: 'critical', aiSuggestion: 'Demonstrate idempotency, circuit breakers, and fault tolerance under network partitions.' },
    { name: 'System Design', category: 'concepts', importance: 'critical', aiSuggestion: 'Detail architecting 99.99% SLA uptime systems with active-active failover.' },
  ],

  'DevOps, SRE & Cloud Architect (Kubernetes/AWS)': [
    { name: 'Kubernetes', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Highlight managing multi-cluster EKS/GKE environments and Helm chart templating.' },
    { name: 'Docker', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Showcase hardened OCI images with automated vulnerability scanning via Trivy.' },
    { name: 'AWS', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Detail IAM least-privilege security, VPC peering, EKS, and multi-AZ database backups.' },
    { name: 'Terraform', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Describe modular Infrastructure as Code (IaC) managing 100% of cloud resources.' },
    { name: 'CI/CD Pipeline', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Detail GitHub Actions & ArgoCD continuous delivery pipelines with canary rollouts.' },
    { name: 'Prometheus', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Showcase automated cluster monitoring, metrics scraping, and alertmanager rules.' },
    { name: 'Grafana', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Feature real-time observability dashboards for p99 latency, error rates, and saturation.' },
    { name: 'Linux', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Demonstrate kernel tuning, systemd process management, and shell scripting.' },
    { name: 'Python', category: 'languages', importance: 'preferred', aiSuggestion: 'Detail custom automation bots, AWS Boto3 cloud scripts, and log ingestion tools.' },
    { name: 'Nginx', category: 'cloudAndDevOps', importance: 'preferred', aiSuggestion: 'Describe reverse proxy caching, SSL termination, and rate-limiting ingress configs.' },
  ],

  'AI / Machine Learning Engineer (LLMs & RAG)': [
    { name: 'Python', category: 'languages', importance: 'critical', aiSuggestion: 'Feature Python backend services with async concurrency and NumPy/Pandas processing.' },
    { name: 'FastAPI', category: 'frameworks', importance: 'critical', aiSuggestion: 'Demonstrate high-throughput async REST endpoints streaming SSE responses to frontend.' },
    { name: 'LangChain', category: 'frameworks', importance: 'preferred', aiSuggestion: 'Detail agent chains, dynamic tool invocation, and recursive prompt chains.' },
    { name: 'RAG', category: 'concepts', importance: 'critical', aiSuggestion: 'Showcase hybrid search combining dense vector embeddings with BM25 keyword matching.' },
    { name: 'Vector Databases', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Highlight indexing 100k+ enterprise documents in pgvector / Pinecone with HNSW indexes.' },
    { name: 'Docker', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Describe containerizing GPU-accelerated inference pipelines and model serving.' },
    { name: 'PostgreSQL', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Feature relational document metadata storage linked with vector similarity queries.' },
    { name: 'LLMs', category: 'concepts', importance: 'critical', aiSuggestion: 'Detail structured JSON extraction, prompt engineering, and semantic caching reducing token costs.' },
  ],

  'Mobile Engineer (React Native / iOS / Android)': [
    { name: 'React Native', category: 'frameworks', importance: 'critical', aiSuggestion: 'Showcase cross-platform 60fps animations and modular navigation hierarchies.' },
    { name: 'TypeScript', category: 'languages', importance: 'critical', aiSuggestion: 'Demonstrate strict TypeScript contracts across native bridges and state stores.' },
    { name: 'Redux', category: 'frameworks', importance: 'preferred', aiSuggestion: 'Detail persistent offline state synchronization and RTK Query optimistic updates.' },
    { name: 'iOS', category: 'concepts', importance: 'critical', aiSuggestion: 'Feature App Store compliance, Xcode build configurations, and Swift native bridging.' },
    { name: 'Android', category: 'concepts', importance: 'critical', aiSuggestion: 'Describe Gradle optimization, ProGuard minification, and Google Play console releases.' },
    { name: 'RESTful APIs', category: 'concepts', importance: 'critical', aiSuggestion: 'Detail resilient offline caching and automatic token refresh interceptors.' },
    { name: 'CI/CD Pipeline', category: 'cloudAndDevOps', importance: 'preferred', aiSuggestion: 'Showcase automated Fastlane build and deployment to TestFlight and Google Play.' },
    { name: 'Jest', category: 'concepts', importance: 'critical', aiSuggestion: 'Document comprehensive React Native component testing and mocking of native modules.' },
  ],

  'Staff / Principal Software Engineer': [
    { name: 'System Design', category: 'concepts', importance: 'critical', aiSuggestion: 'Document high-level architectural blueprints, trade-off analyses, and RFCs.' },
    { name: 'Distributed Systems', category: 'concepts', importance: 'critical', aiSuggestion: 'Showcase data partition strategies, event sourcing, and CAP theorem trade-offs.' },
    { name: 'TypeScript', category: 'languages', importance: 'critical', aiSuggestion: 'Demonstrate core shared libraries, SDK designs, and monorepo tooling.' },
    { name: 'PostgreSQL', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Feature database sharding, connection pooling, and multi-region replication.' },
    { name: 'Redis', category: 'databasesAndTools', importance: 'critical', aiSuggestion: 'Detail multi-tier caching architectures handling millions of daily cache requests.' },
    { name: 'Kubernetes', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Describe enterprise cloud platform engineering and developer velocity tooling.' },
    { name: 'Microservices', category: 'concepts', importance: 'critical', aiSuggestion: 'Highlight cross-squad domain boundary definitions and API contract governance.' },
    { name: 'AWS', category: 'cloudAndDevOps', importance: 'critical', aiSuggestion: 'Detail multi-account AWS Landing Zone architectures and cloud cost optimization.' },
  ],
};

export const ATSScannerTab: React.FC<ATSScannerTabProps> = ({
  resume,
  onUpdateResume,
  atsResult,
  setAtsResult,
  repos = [],
}) => {
  const [selectedRole, setSelectedRole] = useState(resume.targetRole || 'Senior Full-Stack Engineer');
  const [jobDescription, setJobDescription] = useState(resume.customJobDescription || '');
  const [isScanning, setIsScanning] = useState(false);
  const [appliedFixes, setAppliedFixes] = useState<Record<number, boolean>>({});
  const [addedKeywords, setAddedKeywords] = useState<Record<string, boolean>>({});
  
  // Project Tech Stack comparison state
  const [skillsFilter, setSkillsFilter] = useState<'all' | 'missing' | 'covered'>('missing');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAiSuggestions, setExpandedAiSuggestions] = useState<Record<string, boolean>>({});
  const [selectedProjectForSkill, setSelectedProjectForSkill] = useState<Record<string, string>>({});
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});

  // 1. Collect all project technologies & names
  const allProjectTechData = useMemo(() => {
    const projectMap: Record<string, string[]> = {};
    const globalTechSet = new Set<string>();

    (resume.projects || []).forEach((proj) => {
      const techList = (proj.techStack || []).map((t) => t.trim().toLowerCase());
      
      // Also extract tech words from bullets and description
      const fullText = `${proj.name} ${proj.description || ''} ${proj.bullets.join(' ')}`.toLowerCase();
      
      projectMap[proj.name] = techList;
      techList.forEach((t) => globalTechSet.add(t));
      
      // Also check standard keywords mentioned in text
      ['typescript', 'javascript', 'react', 'next.js', 'node.js', 'go', 'python', 'rust', 'docker', 'kubernetes', 'aws', 'postgresql', 'redis', 'graphql', 'tailwindcss', 'jest', 'playwright', 'kafka', 'microservices', 'restful apis', 'system design', 'distributed systems', 'fastapi', 'terraform', 'ci/cd', 'websockets', 'rag', 'llms'].forEach((keyword) => {
        if (fullText.includes(keyword)) {
          globalTechSet.add(keyword);
          if (!projectMap[proj.name].includes(keyword)) {
            projectMap[proj.name].push(keyword);
          }
        }
      });
    });

    // Also include synced repos
    repos.forEach((repo) => {
      if (repo.language) {
        globalTechSet.add(repo.language.toLowerCase());
      }
      (repo.topics || []).forEach((t) => globalTechSet.add(t.toLowerCase()));
    });

    return { projectMap, globalTechSet };
  }, [resume.projects, repos]);

  // 2. Derive active benchmark keywords from selected role and custom JD
  const activeBenchmarkSkills = useMemo<BenchmarkSkill[]>(() => {
    const roleSkills = ROLE_BENCHMARK_KEYWORDS[selectedRole] || ROLE_BENCHMARK_KEYWORDS['Senior Full-Stack Engineer'];
    
    // If Gemini atsResult provided matched + missing keywords, merge them dynamically
    if (atsResult && (atsResult.matchedKeywords.length > 0 || atsResult.missingKeywords.length > 0)) {
      const skillMap = new Map<string, BenchmarkSkill>();
      
      // Add existing role skills first
      roleSkills.forEach((s) => skillMap.set(s.name.toLowerCase(), s));

      // Merge Gemini detected matched keywords
      atsResult.matchedKeywords.forEach((kw) => {
        const key = kw.toLowerCase();
        if (!skillMap.has(key)) {
          skillMap.set(key, {
            name: kw,
            category: 'frameworks',
            importance: 'preferred',
            aiSuggestion: `Showcase practical implementation of ${kw} in your engineering project repository.`,
          });
        }
      });

      // Merge Gemini detected missing keywords
      atsResult.missingKeywords.forEach((kw) => {
        const key = kw.toLowerCase();
        if (!skillMap.has(key)) {
          skillMap.set(key, {
            name: kw,
            category: 'cloudAndDevOps',
            importance: 'critical',
            aiSuggestion: `Integrate ${kw} into your project tech stack or bullet descriptions with quantifiable performance metrics.`,
          });
        }
      });

      return Array.from(skillMap.values());
    }

    return roleSkills;
  }, [selectedRole, atsResult]);

  // 3. Compute which JD skills are covered vs missing in projects
  const analyzedSkills = useMemo(() => {
    const { globalTechSet, projectMap } = allProjectTechData;

    return activeBenchmarkSkills.map((skill) => {
      const skillLower = skill.name.toLowerCase();
      
      // Check if skill matches any project tech or repo
      const matchingProjects: string[] = [];

      Object.entries(projectMap).forEach(([projName, techs]) => {
        const techList = techs as string[];
        const hasDirectMatch = techList.some((t) => 
          t === skillLower || 
          t.includes(skillLower) || 
          skillLower.includes(t)
        );
        if (hasDirectMatch) {
          matchingProjects.push(projName);
        }
      });

      const isCovered = matchingProjects.length > 0 || globalTechSet.has(skillLower);

      return {
        ...skill,
        isCovered,
        matchingProjects,
      };
    });
  }, [activeBenchmarkSkills, allProjectTechData]);

  // Statistics
  const totalSkillsCount = analyzedSkills.length;
  const coveredSkillsCount = analyzedSkills.filter((s) => s.isCovered).length;
  const missingSkillsCount = analyzedSkills.filter((s) => !s.isCovered).length;
  const projectCoverageRate = totalSkillsCount > 0 ? Math.round((coveredSkillsCount / totalSkillsCount) * 100) : 0;

  // Filtered skills based on UI filters
  const filteredSkills = useMemo(() => {
    return analyzedSkills.filter((s) => {
      // Status filter
      if (skillsFilter === 'missing' && s.isCovered) return false;
      if (skillsFilter === 'covered' && !s.isCovered) return false;

      // Category filter
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.aiSuggestion.toLowerCase().includes(q);
      }

      return true;
    });
  }, [analyzedSkills, skillsFilter, categoryFilter, searchQuery]);

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const result = await runAtsScan({
        resumeData: resume,
        targetRole: selectedRole,
        customJobDescription: jobDescription.trim() || undefined,
      });
      setAtsResult(result);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleLoadSampleJd = (role: string) => {
    setSelectedRole(role);
    const sample = SAMPLE_JOB_DESCRIPTIONS[role] || '';
    setJobDescription(sample);
  };

  const handleAddKeywordToProject = (skillName: string, projectName: string) => {
    if (!projectName) return;
    
    const updatedProjects = resume.projects.map((proj) => {
      if (proj.name === projectName) {
        const currentStack = proj.techStack || [];
        if (!currentStack.some((t) => t.toLowerCase() === skillName.toLowerCase())) {
          return {
            ...proj,
            techStack: [...currentStack, skillName],
          };
        }
      }
      return proj;
    });

    onUpdateResume({
      ...resume,
      projects: updatedProjects,
    });

    setAddedKeywords((prev) => ({ ...prev, [`proj-${skillName}`]: true }));
  };

  const handleAddKeywordToSkills = (keyword: string, category: BenchmarkSkill['category'] = 'frameworks') => {
    const currentCategoryList = resume.skills[category] || [];
    
    if (!currentCategoryList.some((s) => s.toLowerCase() === keyword.toLowerCase())) {
      onUpdateResume({
        ...resume,
        skills: {
          ...resume.skills,
          [category]: [...currentCategoryList, keyword],
        },
      });
    }

    setAddedKeywords((prev) => ({ ...prev, [keyword]: true }));
  };

  const handleAddCustomTagToProject = (projectId: string, tag: string) => {
    if (!tag.trim()) return;
    const cleanTag = tag.trim();

    const updatedProjects = resume.projects.map((proj) => {
      if (proj.id === projectId) {
        const current = proj.techStack || [];
        if (!current.includes(cleanTag)) {
          return { ...proj, techStack: [...current, cleanTag] };
        }
      }
      return proj;
    });

    onUpdateResume({ ...resume, projects: updatedProjects });
    setNewTagInputs((prev) => ({ ...prev, [projectId]: '' }));
  };

  const handleApplyBulletFix = (index: number, original: string, improved: string) => {
    let updated = false;

    const newExp = resume.experience.map((exp) => {
      const newBullets = exp.bullets.map((b) => {
        if (b.includes(original) || original.includes(b)) {
          updated = true;
          return improved;
        }
        return b;
      });
      return { ...exp, bullets: newBullets };
    });

    const newProj = resume.projects.map((proj) => {
      const newBullets = proj.bullets.map((b) => {
        if (b.includes(original) || original.includes(b)) {
          updated = true;
          return improved;
        }
        return b;
      });
      return { ...proj, bullets: newBullets };
    });

    if (!updated && newExp.length > 0 && newExp[0].bullets.length > 0) {
      newExp[0].bullets[0] = improved;
    }

    onUpdateResume({
      ...resume,
      experience: newExp,
      projects: newProj,
    });

    setAppliedFixes((prev) => ({ ...prev, [index]: true }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'languages': return Code2;
      case 'frameworks': return Layers;
      case 'cloudAndDevOps': return Cloud;
      case 'databasesAndTools': return Database;
      default: return Cpu;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'languages': return 'Language';
      case 'frameworks': return 'Framework';
      case 'cloudAndDevOps': return 'Cloud & DevOps';
      case 'databasesAndTools': return 'Database / Tool';
      case 'concepts': return 'Architecture / Concept';
      default: return category;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Configuration Bento Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini ATS Readiness Engine</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Target Role & Applicant Tracking System Auditor
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Audit your resume and project tech stack against applicant tracking algorithms to maximize recruiter callback rates.
            </p>
          </div>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Auditing with AI...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Run Full ATS Audit</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-800/60">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                const role = e.target.value;
                setSelectedRole(role);
                if (!jobDescription || Object.values(SAMPLE_JOB_DESCRIPTIONS).includes(jobDescription)) {
                  setJobDescription(SAMPLE_JOB_DESCRIPTIONS[role] || '');
                }
              }}
              className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-xs font-semibold text-zinc-200 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {COMMON_TECH_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            {/* Quick Sample Presets */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px]">
              <span className="text-zinc-500">Preset JDs:</span>
              {['Senior Full-Stack Engineer', 'Senior Frontend Engineer (React/TypeScript)', 'Senior Backend & Distributed Systems Engineer (Go/Rust/Node)'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleLoadSampleJd(r)}
                  className="text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                >
                  {r.split(' ')[1]} JD
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-indigo-400" />
                <span>Job Description Requirements</span>
              </label>
              <button
                type="button"
                onClick={() => setJobDescription(SAMPLE_JOB_DESCRIPTIONS[selectedRole] || '')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Load Default Role JD
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Paste job posting requirements from LinkedIn, Indeed, or Greenhouse for tailored keyword matching..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-2.5 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-xs outline-none focus:border-indigo-500 resize-none text-zinc-200"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURE: PROJECT TECH STACK VS JOB DESCRIPTION KEYWORDS COMPARATOR */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900/70 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl space-y-6">
        
        {/* Section Header with Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Project Tech Stack vs Job Description Analysis</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Project Skills & Gap Matrix</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-normal">
                {resume.projects?.length || 0} Projects Analyzed
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
              Cross-references the technologies declared in your projects against critical keywords demanded in the <strong>{selectedRole}</strong> job description.
            </p>
          </div>

          {/* KPI Mini-Cards */}
          <div className="flex items-center gap-3">
            
            {/* Coverage Gauge Card */}
            <div className="px-4 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center gap-3 shadow-inner">
              <div className="relative w-11 h-11 rounded-xl bg-zinc-900 border border-indigo-500/30 flex items-center justify-center font-black text-sm text-white">
                <span>{projectCoverageRate}%</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  Project Stack Match
                </span>
                <span className="text-xs font-bold text-indigo-300">
                  {coveredSkillsCount} of {totalSkillsCount} Skills Evidenced
                </span>
              </div>
            </div>

            {/* Gap Warning Pill */}
            <div className="px-4 py-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Missing in Projects
                </span>
                <span className="text-xs font-bold text-white">
                  {missingSkillsCount} Critical Gaps
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Status Tabs (All / Missing / Covered) */}
          <div className="flex items-center p-1 bg-zinc-950/80 border border-zinc-800 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSkillsFilter('missing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                skillsFilter === 'missing'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Missing in Projects ({missingSkillsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSkillsFilter('covered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                skillsFilter === 'covered'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Covered in Projects ({coveredSkillsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setSkillsFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                skillsFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>All ({totalSkillsCount})</span>
            </button>
          </div>

          {/* Search + Category Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500 w-36 sm:w-44 transition"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-950/70 border border-zinc-800 rounded-xl text-xs font-medium text-zinc-300 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="languages">Languages</option>
              <option value="frameworks">Frameworks & UI</option>
              <option value="cloudAndDevOps">Cloud & DevOps</option>
              <option value="databasesAndTools">Databases & Storage</option>
              <option value="concepts">Architecture & Practices</option>
            </select>
          </div>

        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredSkills.map((skill) => {
            const isCovered = skill.isCovered;
            const CategoryIcon = getCategoryIcon(skill.category);
            const isAiOpen = !!expandedAiSuggestions[skill.name];
            const isAddedToSkills = !!addedKeywords[skill.name];
            const isAddedToProj = !!addedKeywords[`proj-${skill.name}`];
            const selectedProjName = selectedProjectForSkill[skill.name] || (resume.projects[0]?.name || '');

            return (
              <div
                key={skill.name}
                className={`p-4 rounded-xl border transition-all ${
                  isCovered
                    ? 'bg-zinc-900/40 border-emerald-500/20 hover:border-emerald-500/40'
                    : 'bg-amber-950/10 border-amber-500/30 hover:border-amber-500/50 shadow-sm'
                }`}
              >
                {/* Skill Card Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isCovered ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{skill.name}</span>
                        {skill.importance === 'critical' && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Core Req
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {getCategoryLabel(skill.category)}
                      </span>
                    </div>
                  </div>

                  {/* Coverage Status Pill */}
                  <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border ${
                    isCovered
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                  }`}>
                    {isCovered ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Covered in Project</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>Missing from Projects</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Evidence or Gap Description */}
                <div className="text-xs mb-3">
                  {isCovered ? (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] text-zinc-400 font-medium">Evidenced in:</span>
                      {skill.matchingProjects.length > 0 ? (
                        skill.matchingProjects.map((pName) => (
                          <span
                            key={pName}
                            className="px-2 py-0.5 bg-emerald-950/40 text-emerald-200 border border-emerald-500/30 rounded-md text-[11px] font-semibold flex items-center gap-1"
                          >
                            <FolderGit2 className="w-3 h-3 text-emerald-400" />
                            <span>{pName}</span>
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px]">
                          GitHub Repositories
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-300/90 leading-relaxed bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                      ⚠️ Not evidenced in any project tech stack. Recruiters scanning for <strong>{selectedRole}</strong> filter heavily on this keyword.
                    </p>
                  )}
                </div>

                {/* Quick Gap Bridging Actions (for Missing Skills) */}
                {!isCovered && (
                  <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      
                      {/* Add to Project Tech Stack Selector */}
                      {resume.projects.length > 0 ? (
                        <div className="flex-1 flex items-center gap-1 bg-zinc-950/80 p-1 rounded-lg border border-zinc-800">
                          <select
                            value={selectedProjName}
                            onChange={(e) =>
                              setSelectedProjectForSkill((prev) => ({
                                ...prev,
                                [skill.name]: e.target.value,
                              }))
                            }
                            className="flex-1 bg-transparent px-2 py-1 text-[11px] text-zinc-300 outline-none truncate cursor-pointer"
                          >
                            {resume.projects.map((p) => (
                              <option key={p.id} value={p.name}>
                                Add to: {p.name}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => handleAddKeywordToProject(skill.name, selectedProjName)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer shadow-xs"
                          >
                            {isAddedToProj ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span>Add to Project</span>
                              </>
                            )}
                          </button>
                        </div>
                      ) : null}

                      {/* Add to Resume Skills Section */}
                      <button
                        type="button"
                        onClick={() => handleAddKeywordToSkills(skill.name, skill.category)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 border transition shrink-0 cursor-pointer ${
                          isAddedToSkills
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {isAddedToSkills ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>In Resume Skills</span>
                          </>
                        ) : (
                          <>
                            <Tag className="w-3 h-3 text-indigo-400" />
                            <span>+ Skills Section</span>
                          </>
                        )}
                      </button>

                    </div>

                    {/* AI Suggestion Toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedAiSuggestions((prev) => ({
                            ...prev,
                            [skill.name]: !prev[skill.name],
                          }))
                        }
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer pt-0.5"
                      >
                        <Lightbulb className="w-3 h-3" />
                        <span>{isAiOpen ? 'Hide AI Bullet Tip' : 'How to showcase this skill in a project?'}</span>
                        {isAiOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                      </button>

                      {isAiOpen && (
                        <div className="mt-1.5 p-2.5 bg-indigo-950/30 border border-indigo-500/30 rounded-lg text-[11px] text-zinc-200 animate-fadeIn space-y-1">
                          <span className="font-bold text-indigo-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-400" />
                            <span>Recommended STAR Bullet Enhancement:</span>
                          </span>
                          <p className="italic text-zinc-300 font-mono">
                            "{skill.aiSuggestion}"
                          </p>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Project Evidence Matrix Inspector (Projects & Declared Tech) */}
        {resume.projects.length > 0 && (
          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                <span>Your Projects & Active Tech Stacks</span>
              </h3>
              <span className="text-[11px] text-zinc-500">
                Click tags or enter new keywords below to update stacks
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resume.projects.map((proj) => {
                const currentTagInput = newTagInputs[proj.id] || '';
                return (
                  <div
                    key={proj.id}
                    className="p-3.5 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                        {proj.name}
                      </h4>
                      {proj.stars !== undefined && proj.stars > 0 && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          ★ {proj.stars}
                        </span>
                      )}
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1">
                      {(proj.techStack || []).map((tech) => {
                        const isMatchingJd = activeBenchmarkSkills.some(
                          (s) => s.name.toLowerCase() === tech.toLowerCase()
                        );
                        return (
                          <span
                            key={tech}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border ${
                              isMatchingJd
                                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                                : 'bg-zinc-800/70 text-zinc-400 border-zinc-700/50'
                            }`}
                          >
                            <span>{tech}</span>
                            {isMatchingJd && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" title="Matched in JD" />
                            )}
                          </span>
                        );
                      })}
                    </div>

                    {/* Add Tech Tag Input */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="text"
                        placeholder="Add tech (e.g. Redis)..."
                        value={currentTagInput}
                        onChange={(e) =>
                          setNewTagInputs((prev) => ({
                            ...prev,
                            [proj.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCustomTagToProject(proj.id, currentTagInput);
                          }
                        }}
                        className="flex-1 px-2.5 py-1 bg-zinc-900 border border-zinc-700/60 rounded text-[11px] text-white outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomTagToProject(proj.id, currentTagInput)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-bold border border-zinc-700 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Main Analysis Results (From Gemini ATS Scan) */}
      {atsResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Score Gauge Bento Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Score Meter */}
              <div className="flex items-center gap-5">
                <div className="relative w-22 h-22 rounded-2xl bg-zinc-800/80 border border-indigo-500/30 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.15)]">
                  <span className="text-3xl font-black text-white">{atsResult.overallScore}%</span>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Grade {atsResult.matchGrade}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-base sm:text-lg font-bold">
                      {atsResult.overallScore >= 85
                        ? 'High Recruiter Match — ATS Ready'
                        : 'Action Recommended for Target Role'}
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 max-w-md">
                    {atsResult.roleSummaryTip || 'Ensure high-priority keywords and quantified metric gains are emphasized.'}
                  </p>
                </div>
              </div>

              {/* 5 Sub-category bars */}
              <div className="w-full md:w-80 space-y-2 text-xs">
                {[
                  { label: 'Keyword Frequency', val: atsResult.breakdown.keywordMatch },
                  { label: 'Action Verb Strength', val: atsResult.breakdown.actionVerbStrength },
                  { label: 'Quantified Metrics', val: atsResult.breakdown.quantifiedMetrics },
                  { label: 'ATS Format Standard', val: atsResult.breakdown.atsFormatReadiness },
                  { label: 'Brevity & Density', val: atsResult.breakdown.brevityAndImpact },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[11px] font-medium text-zinc-400 mb-0.5">
                      <span>{item.label}</span>
                      <span className="font-bold text-zinc-200">{item.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.val}%` }}
                        className={`h-full rounded-full ${
                          item.val >= 85 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : item.val >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Bullet-by-Bullet AI Enhancement Suggestions */}
          {atsResult.bulletEnhancements && atsResult.bulletEnhancements.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  AI High-Impact STAR Bullet Rewrites
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Transform passive statements into action-driven accomplishments with quantified metrics:
              </p>

              <div className="space-y-3">
                {atsResult.bulletEnhancements.map((enhancement, idx) => {
                  const isApplied = appliedFixes[idx];
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/40 space-y-3"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                          Original Text:
                        </span>
                        <p className="text-xs text-zinc-400 italic bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-700/30">
                          "{enhancement.original}"
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                          ✨ AI STAR Enhanced (Metrics & Active Verb):
                        </span>
                        <p className="text-xs text-white font-medium bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
                          {enhancement.improved}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-1">
                        <p className="text-zinc-400 text-[11px]">{enhancement.reason}</p>
                        <button
                          onClick={() => handleApplyBulletFix(idx, enhancement.original, enhancement.improved)}
                          disabled={isApplied}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.25)]'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied to Resume</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Apply Rewrite to Resume</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actionable Fixes Checklist */}
          {atsResult.criticalFixes && atsResult.criticalFixes.length > 0 && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-3">
              <h3 className="font-bold text-white text-sm">
                Critical Next Steps for Maximum Callback
              </h3>
              <div className="space-y-2">
                {atsResult.criticalFixes.map((fix, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-800/40 rounded-xl border border-zinc-700/40 flex items-start gap-3 text-xs"
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-200">{fix.issue}</p>
                      <p className="text-zinc-400 mt-0.5">{fix.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

