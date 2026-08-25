import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Linkedin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  Briefcase, 
  User, 
  Wrench, 
  GraduationCap, 
  Award, 
  Plus, 
  Trash2, 
  Eye, 
  RotateCcw, 
  Search,
  Link as LinkIcon,
  Globe,
  Zap,
  Check,
  Building,
  Calendar,
  Layers
} from 'lucide-react';
import { ResumeData, WorkExperience, EducationItem, CertificationItem } from '../types';
import { parseLinkedInText, parseLinkedInUrl } from '../lib/geminiApi';

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: Partial<ResumeData>) => void;
}

const SAMPLE_LINKEDIN_URLS = [
  { label: 'Staff Systems Architect', url: 'https://www.linkedin.com/in/alex-rivera-architect', role: 'Staff Systems Architect' },
  { label: 'AI/ML Infrastructure Lead', url: 'https://www.linkedin.com/in/sarah-chen-ml-infra', role: 'Staff ML Infrastructure Engineer' },
  { label: 'Principal Full-Stack Engineer', url: 'https://www.linkedin.com/in/marcus-vance-fullstack', role: 'Principal Full-Stack Engineer' },
];

const SAMPLE_LINKEDIN_RAW_TEXT = `
Alex Rivera
Senior Full-Stack & Cloud Systems Architect at CloudMatrix Technologies
San Francisco, California, United States

About:
Impact-driven Systems Architect with 7+ years of experience engineering high-throughput distributed backends, modern React web platforms, and Kubernetes cloud infrastructure. Creator of open-source projects with 7,000+ combined GitHub stars. Proven record of reducing p99 API latencies by up to 50% and scaling enterprise SaaS platforms to millions of daily active users.

Experience:
Staff Software Engineer & Tech Lead
CloudMatrix Technologies · Full-time
Jan 2023 - Present · 3 yrs 8 mos
San Francisco, CA
- Architected distributed microservices platform on AWS EKS processing 45M daily requests with 99.99% service availability.
- Spearheaded frontend migration to React 19 and Next.js, reducing Largest Contentful Paint (LCP) by 48% and boosting user conversion by 22%.
- Mentored a team of 9 engineers across 3 time zones, implementing strict code review standards and automated CI/CD gating.
- Optimized PostgreSQL queries and Redis caching layers, slashing database CPU utilization by 35% and saving $40,000 annually.
Skills: TypeScript, Go, React, Kubernetes, PostgreSQL, AWS

Senior Full-Stack Engineer
HyperScale Systems · Full-time
Apr 2020 - Dec 2022 · 2 yrs 9 mos
Austin, TX
- Engineered real-time telemetry analytics dashboard utilizing WebSockets, Go workers, and D3/Canvas visualizations.
- Implemented event-driven Kafka pipeline ingesting 120GB/hour of streaming sensor data with automated anomaly alerts.
- Authored GraphQL gateway consolidating 14 legacy REST services, reducing client roundtrips by 65%.
Skills: Go, TypeScript, GraphQL, Kafka, Docker, Redis

Software Engineer
Veloce Data Labs · Full-time
Jun 2018 - Mar 2020 · 1 yr 10 mos
Seattle, WA
- Developed core RESTful APIs in Node.js and TypeScript serving 500k+ monthly active mobile users.
- Built responsive design system components with automated visual regression tests, increasing development velocity by 30%.
Skills: Node.js, React, TypeScript, MongoDB, Jest

Education:
University of California, Berkeley
Bachelor of Science (B.S.), Computer Science
2014 - 2018
Activities and societies: Cum Laude, Dean's Honors List

Certifications:
AWS Certified Solutions Architect – Professional (Amazon Web Services, 2024)
Certified Kubernetes Administrator (CKA, Cloud Native Computing Foundation, 2023)
`;

const URL_PARSING_STAGES = [
  { id: 'resolve', label: 'Resolving LinkedIn profile handle & public index...', icon: Globe },
  { id: 'ground', label: 'Grounding career history with Google Search & Gemini 3.7...', icon: Search },
  { id: 'roles', label: 'Extracting companies, tenures & engineering positions...', icon: Briefcase },
  { id: 'bullets', label: 'Synthesizing high-impact STAR accomplishment bullets...', icon: Sparkles },
  { id: 'skills', label: 'Structuring technical stack taxonomy & credentials...', icon: Wrench },
];

const TEXT_PARSING_STAGES = [
  { id: 'scan', label: 'Scanning text structure & career timeline...', icon: Search },
  { id: 'profile', label: 'Extracting candidate identity, title & summary...', icon: User },
  { id: 'experience', label: 'Synthesizing work experience & STAR bullet points...', icon: Briefcase },
  { id: 'skills', label: 'Categorizing technical skills & domain competencies...', icon: Wrench },
  { id: 'edu', label: 'Structuring education & industry certifications...', icon: GraduationCap },
];

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
}) => {
  // Input Modes: 'url' (Scrape URL) or 'text' (Paste Text)
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [profileUrl, setProfileUrl] = useState('https://www.linkedin.com/in/alex-rivera-architect');
  const [targetRole, setTargetRole] = useState('Senior / Staff Software Engineer');
  const [rawText, setRawText] = useState('');
  
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);

  // Original snapshot from Gemini & Editable working copy
  const [originalExtracted, setOriginalExtracted] = useState<Partial<ResumeData> | null>(null);
  const [editableData, setEditableData] = useState<Partial<ResumeData> | null>(null);

  // Navigation within Preview / Edit
  const [activeTab, setActiveTab] = useState<'experience' | 'personal' | 'skills' | 'education' | 'ats-preview'>('experience');

  // New skill input helper states
  const [newSkillInput, setNewSkillInput] = useState<{ [key: string]: string }>({
    languages: '',
    frameworks: '',
    cloudAndDevOps: '',
    databasesAndTools: '',
    concepts: '',
  });

  // Selective Apply checkboxes
  const [applySections, setApplySections] = useState({
    personal: true,
    experience: true,
    skills: true,
    education: true,
    certifications: true,
  });

  const activeStages = inputMode === 'url' ? URL_PARSING_STAGES : TEXT_PARSING_STAGES;

  // Handle stage progress animation during parse
  useEffect(() => {
    let interval: any;
    if (isParsing) {
      setParsingStep(0);
      interval = setInterval(() => {
        setParsingStep((prev) => {
          if (prev < activeStages.length - 1) return prev + 1;
          return prev;
        });
      }, 700);
    } else {
      setParsingStep(0);
    }
    return () => clearInterval(interval);
  }, [isParsing, activeStages.length]);

  if (!isOpen) return null;

  const handleParse = async () => {
    setIsParsing(true);
    setParseError(null);

    try {
      let extracted: Partial<ResumeData>;
      if (inputMode === 'url') {
        if (!profileUrl.trim()) {
          throw new Error('Please enter a valid LinkedIn profile URL or username.');
        }
        extracted = await parseLinkedInUrl(profileUrl.trim(), targetRole.trim() || undefined);
      } else {
        if (!rawText.trim()) {
          throw new Error('Please paste your LinkedIn profile or resume text.');
        }
        extracted = await parseLinkedInText(rawText);
      }

      // Ensure IDs on experiences and items if missing
      const formatted: Partial<ResumeData> = {
        ...extracted,
        personal: {
          fullName: extracted.personal?.fullName || 'Candidate Name',
          title: extracted.personal?.title || targetRole || 'Software Engineer',
          email: extracted.personal?.email || '',
          phone: extracted.personal?.phone || '',
          location: extracted.personal?.location || '',
          website: extracted.personal?.website || '',
          linkedinUrl: extracted.personal?.linkedinUrl || (inputMode === 'url' ? profileUrl.trim() : ''),
          githubUrl: extracted.personal?.githubUrl || '',
          summary: extracted.personal?.summary || '',
        },
        experience: (extracted.experience || []).map((exp, i) => ({
          ...exp,
          id: exp.id || `exp-import-${i + 1}-${Date.now()}`,
          bullets: exp.bullets || [],
          techStack: exp.techStack || [],
        })),
        education: (extracted.education || []).map((edu, i) => ({
          ...edu,
          id: edu.id || `edu-import-${i + 1}-${Date.now()}`,
        })),
        certifications: (extracted.certifications || []).map((cert, i) => ({
          ...cert,
          id: cert.id || `cert-import-${i + 1}-${Date.now()}`,
        })),
      };

      setOriginalExtracted(JSON.parse(JSON.stringify(formatted)));
      setEditableData(JSON.parse(JSON.stringify(formatted)));
      setActiveTab('experience');
    } catch (err: any) {
      console.error('LinkedIn parse error:', err);
      setParseError(err.message || 'Failed to scrape and parse LinkedIn profile. Please verify your connection or try entering raw text.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleResetToOriginal = () => {
    if (originalExtracted) {
      setEditableData(JSON.parse(JSON.stringify(originalExtracted)));
    }
  };

  const handleApply = () => {
    if (!editableData) return;

    const dataToApply: Partial<ResumeData> = {};

    if (applySections.personal && editableData.personal) {
      dataToApply.personal = editableData.personal;
    }
    if (applySections.experience && editableData.experience) {
      dataToApply.experience = editableData.experience;
    }
    if (applySections.skills && editableData.skills) {
      dataToApply.skills = editableData.skills;
    }
    if (applySections.education && editableData.education) {
      dataToApply.education = editableData.education;
    }
    if (applySections.certifications && editableData.certifications) {
      dataToApply.certifications = editableData.certifications;
    }

    onApplyData(dataToApply);
    onClose();
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_LINKEDIN_RAW_TEXT.trim());
  };

  // --- Work Experience Field Edit Handlers ---
  const handleUpdateExperienceField = (index: number, field: keyof WorkExperience, value: any) => {
    if (!editableData || !editableData.experience) return;
    const updatedExps = [...editableData.experience];
    updatedExps[index] = {
      ...updatedExps[index],
      [field]: value,
    };
    setEditableData({ ...editableData, experience: updatedExps });
  };

  const handleAddExperience = () => {
    if (!editableData) return;
    const newExp: WorkExperience = {
      id: `exp-new-${Date.now()}`,
      company: 'Company Name',
      role: 'Software Engineer',
      location: 'City, State or Remote',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      bullets: ['Spearheaded core feature development using modern tech stack, improving performance by 25%.'],
      techStack: ['TypeScript', 'React', 'Node.js'],
    };
    setEditableData({
      ...editableData,
      experience: [newExp, ...(editableData.experience || [])],
    });
  };

  const handleDeleteExperience = (index: number) => {
    if (!editableData || !editableData.experience) return;
    const updatedExps = editableData.experience.filter((_, i) => i !== index);
    setEditableData({ ...editableData, experience: updatedExps });
  };

  const handleAddBullet = (expIndex: number) => {
    if (!editableData || !editableData.experience) return;
    const updatedExps = [...editableData.experience];
    const currentBullets = updatedExps[expIndex].bullets || [];
    updatedExps[expIndex] = {
      ...updatedExps[expIndex],
      bullets: [...currentBullets, 'Architected scalable solution resulting in 30% reduction in response latency.'],
    };
    setEditableData({ ...editableData, experience: updatedExps });
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    if (!editableData || !editableData.experience) return;
    const updatedExps = [...editableData.experience];
    const currentBullets = [...(updatedExps[expIndex].bullets || [])];
    currentBullets[bulletIndex] = text;
    updatedExps[expIndex] = { ...updatedExps[expIndex], bullets: currentBullets };
    setEditableData({ ...editableData, experience: updatedExps });
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    if (!editableData || !editableData.experience) return;
    const updatedExps = [...editableData.experience];
    const currentBullets = (updatedExps[expIndex].bullets || []).filter((_, i) => i !== bulletIndex);
    updatedExps[expIndex] = { ...updatedExps[expIndex], bullets: currentBullets };
    setEditableData({ ...editableData, experience: updatedExps });
  };

  const handleAddTechStackTag = (expIndex: number, tag: string) => {
    if (!tag.trim() || !editableData || !editableData.experience) return;
    const updatedExps = [...editableData.experience];
    const currentStack = updatedExps[expIndex].techStack || [];
    if (!currentStack.includes(tag.trim())) {
      updatedExps[expIndex] = {
        ...updatedExps[expIndex],
        techStack: [...currentStack, tag.trim()],
      };
      setEditableData({ ...editableData, experience: updatedExps });
    }
  };

  const handleRemoveTechStackTag = (expIndex: number, tagToRemove: string) => {
    if (!editableData || !editableData.experience) return;
    const updatedExps = [...editableData.experience];
    const currentStack = updatedExps[expIndex].techStack || [];
    updatedExps[expIndex] = {
      ...updatedExps[expIndex],
      techStack: currentStack.filter((t) => t !== tagToRemove),
    };
    setEditableData({ ...editableData, experience: updatedExps });
  };

  // --- Personal Info Field Handlers ---
  const handleUpdatePersonalField = (field: string, value: string) => {
    if (!editableData) return;
    setEditableData({
      ...editableData,
      personal: {
        ...(editableData.personal as any),
        [field]: value,
      },
    });
  };

  // --- Skills Handlers ---
  const handleAddSkill = (category: string, skill: string) => {
    if (!skill.trim() || !editableData) return;
    const skillsObj: any = editableData.skills || {};
    const list = skillsObj[category] || [];
    if (!list.includes(skill.trim())) {
      setEditableData({
        ...editableData,
        skills: {
          ...skillsObj,
          [category]: [...list, skill.trim()],
        },
      });
      setNewSkillInput((prev) => ({ ...prev, [category]: '' }));
    }
  };

  const handleRemoveSkill = (category: string, skillToRemove: string) => {
    if (!editableData) return;
    const skillsObj: any = editableData.skills || {};
    const list = skillsObj[category] || [];
    setEditableData({
      ...editableData,
      skills: {
        ...skillsObj,
        [category]: list.filter((s: string) => s !== skillToRemove),
      },
    });
  };

  // --- Education & Certs Handlers ---
  const handleAddEducation = () => {
    if (!editableData) return;
    const newEdu: EducationItem = {
      id: `edu-new-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      institution: 'University Name',
      location: 'City, State',
      graduationYear: '2023',
    };
    setEditableData({
      ...editableData,
      education: [...(editableData.education || []), newEdu],
    });
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: string) => {
    if (!editableData || !editableData.education) return;
    const updated = [...editableData.education];
    updated[index] = { ...updated[index], [field]: value };
    setEditableData({ ...editableData, education: updated });
  };

  const handleDeleteEducation = (index: number) => {
    if (!editableData || !editableData.education) return;
    setEditableData({
      ...editableData,
      education: editableData.education.filter((_, i) => i !== index),
    });
  };

  const handleAddCertification = () => {
    if (!editableData) return;
    const newCert: CertificationItem = {
      id: `cert-new-${Date.now()}`,
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2024',
    };
    setEditableData({
      ...editableData,
      certifications: [...(editableData.certifications || []), newCert],
    });
  };

  const handleUpdateCertification = (index: number, field: keyof CertificationItem, value: string) => {
    if (!editableData || !editableData.certifications) return;
    const updated = [...editableData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    setEditableData({ ...editableData, certifications: updated });
  };

  const handleDeleteCertification = (index: number) => {
    if (!editableData || !editableData.certifications) return;
    setEditableData({
      ...editableData,
      certifications: editableData.certifications.filter((_, i) => i !== index),
    });
  };

  // Stats calculation
  const totalRoles: number = editableData?.experience?.length || 0;
  const totalBullets: number = editableData?.experience?.reduce((acc: number, e: WorkExperience) => acc + (e.bullets?.length || 0), 0) || 0;
  const totalSkills: number = (Object.values(editableData?.skills || {}) as any[]).reduce(
    (acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0),
    0
  );
  const totalEdu: number = editableData?.education?.length || 0;
  const totalCerts: number = editableData?.certifications?.length || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0a0a0c] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-zinc-800 shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0077B5] flex items-center justify-center text-white shadow-md">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-sm sm:text-base">
                  LinkedIn Work Experience & Profile Extractor
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Parse raw text into ATS-optimized STAR bullets, live preview, and customize field values before applying
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* STATE 1: Text / URL Input & Live Parsing Progress */}
          {!editableData ? (
            <div className="space-y-5">
              
              {/* Input Mode Selector */}
              <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl max-w-md">
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                    inputMode === 'url'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile URL Scraper</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition ${
                    inputMode === 'text'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paste Profile Text</span>
                </button>
              </div>

              {/* MODE 1: URL SCRAPER */}
              {inputMode === 'url' ? (
                <div className="space-y-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Enter LinkedIn Profile URL or Handle</span>
                      </label>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Gemini 3.7 with Google Search grounding will scrape and synthesize work experience into ATS-ready STAR bullets.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-8">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                          <Linkedin className="w-4 h-4 text-[#0077B5]" />
                        </div>
                        <input
                          type="text"
                          disabled={isParsing}
                          value={profileUrl}
                          onChange={(e) => setProfileUrl(e.target.value)}
                          placeholder="https://www.linkedin.com/in/username or username"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-zinc-700/70 rounded-xl text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <input
                        type="text"
                        disabled={isParsing}
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="Target Role (e.g. Staff Engineer)"
                        className="w-full px-3 py-2.5 bg-zinc-950/80 border border-zinc-700/70 rounded-xl text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>

                  {/* Sample Profile URLs */}
                  <div className="pt-2 border-t border-zinc-800/60 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-zinc-500 font-medium">Try Sample Profile:</span>
                    {SAMPLE_LINKEDIN_URLS.map((sample) => (
                      <button
                        key={sample.url}
                        type="button"
                        disabled={isParsing}
                        onClick={() => {
                          setProfileUrl(sample.url);
                          setTargetRole(sample.role);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50 transition cursor-pointer"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      disabled={isParsing || !profileUrl.trim()}
                      onClick={handleParse}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Scrape & Synthesize Experience with Gemini</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              ) : (
                /* MODE 2: RAW TEXT INPUT */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Paste LinkedIn Experience & Profile Text</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      disabled={isParsing}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline disabled:opacity-50 cursor-pointer"
                    >
                      Load Sample Senior Engineer Profile
                    </button>
                  </div>

                  <div className="relative">
                    <textarea
                      rows={10}
                      disabled={isParsing}
                      placeholder="Paste unstructured text from LinkedIn (About, Experience roles, Education, Certifications, or Resume text)..."
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      className={`w-full p-4 bg-zinc-900/90 border border-zinc-700/60 rounded-xl text-xs font-mono text-zinc-200 outline-none focus:border-indigo-500 resize-none leading-relaxed transition ${
                        isParsing ? 'opacity-40 pointer-events-none' : ''
                      }`}
                    />

                    {/* Character & Word count badge */}
                    <div className="absolute bottom-3 right-3 text-[11px] font-mono text-zinc-500 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800">
                      {rawText.trim() ? `${rawText.trim().split(/\s+/).length} words · ${rawText.length} chars` : '0 words'}
                    </div>
                  </div>

                  {/* Parse Text Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      disabled={isParsing || !rawText.trim()}
                      onClick={handleParse}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Parse Text with Gemini</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* Parsing Progress Live Visualizer */}
              {isParsing && (
                <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                      <span>
                        {inputMode === 'url' ? 'Live LinkedIn URL Grounding & Extraction' : 'Gemini 3.7 Flash Live Extraction in Progress'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                      Phase {parsingStep + 1} of {activeStages.length}
                    </span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-400 h-1.5 transition-all duration-500 rounded-full"
                      style={{ width: `${((parsingStep + 1) / activeStages.length) * 100}%` }}
                    />
                  </div>

                  {/* Active Stages Indicator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {activeStages.map((stage, idx) => {
                      const StageIcon = stage.icon;
                      const isDone = idx < parsingStep;
                      const isCurrent = idx === parsingStep;
                      return (
                        <div
                          key={stage.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] transition-all border ${
                            isCurrent
                              ? 'bg-indigo-600/20 border-indigo-500/50 text-white font-semibold shadow-xs ring-1 ring-indigo-500/40'
                              : isDone
                              ? 'bg-zinc-900/60 border-emerald-500/30 text-emerald-300'
                              : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-500'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : isCurrent ? (
                            <StageIcon className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
                          ) : (
                            <StageIcon className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                          )}
                          <span className="truncate">{stage.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {parseError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{parseError}</span>
                </div>
              )}
            </div>
          ) : (
            /* STATE 2: Live Preview & Manual Field Editor */
            <div className="space-y-4">
              
              {/* Top Bento Metrics Bar */}
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 shadow-md">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl text-xs text-emerald-300 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Parsed & Ready to Edit</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-xl text-[11px] font-mono text-zinc-300 border border-zinc-700/50">
                    <Briefcase className="w-3 h-3 text-indigo-400" />
                    <span>{totalRoles} Roles</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-xl text-[11px] font-mono text-zinc-300 border border-zinc-700/50">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{totalBullets} STAR Bullets</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-xl text-[11px] font-mono text-zinc-300 border border-zinc-700/50">
                    <Wrench className="w-3 h-3 text-emerald-400" />
                    <span>{totalSkills} Skills</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-800 px-2.5 py-1 rounded-xl text-[11px] font-mono text-zinc-300 border border-zinc-700/50">
                    <GraduationCap className="w-3 h-3 text-blue-400" />
                    <span>{totalEdu} Edu · {totalCerts} Certs</span>
                  </div>
                </div>

                {/* Reset & Raw Text Controls */}
                <div className="flex items-center gap-2 self-end lg:self-auto">
                  <button
                    type="button"
                    onClick={handleResetToOriginal}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    title="Reset all manual edits back to Gemini's original extracted values"
                  >
                    <RotateCcw className="w-3 h-3 text-zinc-400" />
                    <span>Reset Edits</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditableData(null)}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <FileText className="w-3 h-3 text-zinc-400" />
                    <span>Edit Source Text</span>
                  </button>
                </div>
              </div>

              {/* Sub-Section Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('experience')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'experience'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Work Experience ({totalRoles})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'personal'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Profile & Summary</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('skills')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'skills'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Skills ({totalSkills})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('education')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'education'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Education & Certs</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ats-preview')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      activeTab === 'ats-preview'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>ATS Formatted Preview</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: WORK EXPERIENCE EDITING */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">Extracted Work Experiences</h3>
                      <p className="text-[11px] text-zinc-400">
                        Edit titles, companies, dates, STAR bullets, and tech stack tags directly.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Position</span>
                    </button>
                  </div>

                  {(!editableData.experience || editableData.experience.length === 0) ? (
                    <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl text-zinc-400 text-xs">
                      No work experiences detected. Click "Add Position" to create one.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editableData.experience.map((exp, expIdx) => (
                        <div
                          key={exp.id || expIdx}
                          className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm"
                        >
                          {/* Role Header & Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-mono font-bold">
                                #{expIdx + 1}
                              </span>
                              <span className="font-bold text-white text-xs">
                                {exp.role || 'Untitled Role'} @ {exp.company || 'Company'}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteExperience(expIdx)}
                              className="text-zinc-500 hover:text-rose-400 p-1 rounded transition self-end sm:self-auto flex items-center gap-1 text-xs"
                              title="Delete position"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Remove</span>
                            </button>
                          </div>

                          {/* Role & Company Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                Job Title / Role
                              </label>
                              <input
                                type="text"
                                value={exp.role || ''}
                                onChange={(e) => handleUpdateExperienceField(expIdx, 'role', e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                                placeholder="e.g. Senior Software Engineer"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                Company / Organization
                              </label>
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => handleUpdateExperienceField(expIdx, 'company', e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                                placeholder="e.g. Stripe, Google"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                Location
                              </label>
                              <input
                                type="text"
                                value={exp.location || ''}
                                onChange={(e) => handleUpdateExperienceField(expIdx, 'location', e.target.value)}
                                className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                                placeholder="e.g. San Francisco, CA or Remote"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                                Timeline / Dates
                              </label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={exp.startDate || ''}
                                  onChange={(e) => handleUpdateExperienceField(expIdx, 'startDate', e.target.value)}
                                  className="w-1/2 px-2 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500 text-center"
                                  placeholder="Start"
                                />
                                <span className="text-zinc-500 text-xs">-</span>
                                <input
                                  type="text"
                                  value={exp.isCurrent ? 'Present' : exp.endDate || ''}
                                  onChange={(e) => {
                                    handleUpdateExperienceField(expIdx, 'endDate', e.target.value);
                                    if (e.target.value.toLowerCase() === 'present') {
                                      handleUpdateExperienceField(expIdx, 'isCurrent', true);
                                    }
                                  }}
                                  disabled={exp.isCurrent}
                                  className={`w-1/2 px-2 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500 text-center ${
                                    exp.isCurrent ? 'opacity-60 bg-zinc-900 text-emerald-400 font-semibold' : ''
                                  }`}
                                  placeholder="End"
                                />
                              </div>
                              <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(exp.isCurrent)}
                                  onChange={(e) => handleUpdateExperienceField(expIdx, 'isCurrent', e.target.checked)}
                                  className="rounded text-indigo-600 bg-zinc-800 border-zinc-700 focus:ring-0 w-3 h-3"
                                />
                                <span className="text-[10px] text-zinc-400">Currently working here</span>
                              </label>
                            </div>
                          </div>

                          {/* STAR Bullets Editor */}
                          <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span>STAR Format Impact Bullets ({exp.bullets?.length || 0})</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddBullet(expIdx)}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Bullet</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {(exp.bullets || []).map((bullet, bulletIdx) => (
                                <div key={bulletIdx} className="flex items-start gap-2 group">
                                  <span className="text-zinc-500 text-xs mt-2">•</span>
                                  <textarea
                                    rows={2}
                                    value={bullet}
                                    onChange={(e) => handleUpdateBullet(expIdx, bulletIdx, e.target.value)}
                                    className="flex-1 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-800/90 focus:bg-zinc-800 border border-zinc-700/50 rounded-xl text-xs text-zinc-200 outline-none focus:border-indigo-500 leading-relaxed resize-none transition font-sans"
                                    placeholder="Action verb + Context + Quantifiable result (e.g. Architected microservices boosting throughput by 40%)..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteBullet(expIdx, bulletIdx)}
                                    className="text-zinc-600 hover:text-rose-400 p-1.5 rounded transition mt-1"
                                    title="Delete bullet"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Tech Stack Tags */}
                          <div className="pt-2 border-t border-zinc-800/60 space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                              Technologies & Stack Used
                            </label>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {(exp.techStack || []).map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[11px] rounded-lg border border-zinc-700/60 flex items-center gap-1"
                                >
                                  <span>{tech}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTechStackTag(expIdx, tech)}
                                    className="text-zinc-500 hover:text-rose-400 text-xs ml-0.5"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}

                              {/* Inline tag adder */}
                              <input
                                type="text"
                                placeholder="+ Add tech tag..."
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTechStackTag(expIdx, (e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }}
                                className="px-2 py-0.5 bg-zinc-800/40 border border-zinc-700/40 rounded-lg text-[11px] text-zinc-200 outline-none focus:border-indigo-500 w-28"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PERSONAL INFO & SUMMARY */}
              {activeTab === 'personal' && (
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-white text-sm">Personal Details & Professional Headline</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editableData.personal?.fullName || ''}
                        onChange={(e) => handleUpdatePersonalField('fullName', e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-semibold"
                        placeholder="Alex Rivera"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Target Role / Headline
                      </label>
                      <input
                        type="text"
                        value={editableData.personal?.title || ''}
                        onChange={(e) => handleUpdatePersonalField('title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="Senior Full-Stack & Cloud Systems Architect"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editableData.personal?.location || ''}
                        onChange={(e) => handleUpdatePersonalField('location', e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="San Francisco, CA"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editableData.personal?.email || ''}
                        onChange={(e) => handleUpdatePersonalField('email', e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="alex.rivera@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editableData.personal?.phone || ''}
                        onChange={(e) => handleUpdatePersonalField('phone', e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="+1 (415) 890-3412"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="text"
                        value={editableData.personal?.linkedinUrl || ''}
                        onChange={(e) => handleUpdatePersonalField('linkedinUrl', e.target.value)}
                        className="w-full px-3 py-1.5 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Professional Summary (ATS High-Impact Pitch)
                    </label>
                    <textarea
                      rows={4}
                      value={editableData.personal?.summary || ''}
                      onChange={(e) => handleUpdatePersonalField('summary', e.target.value)}
                      className="w-full p-3 bg-zinc-800/80 border border-zinc-700/60 rounded-xl text-xs text-zinc-200 outline-none focus:border-indigo-500 leading-relaxed font-sans"
                      placeholder="Impact-driven Systems Architect with 7+ years of experience engineering high-throughput distributed backends..."
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SKILLS EDITING */}
              {activeTab === 'skills' && (
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Categorized Technical Skills & Stack</h3>
                    <span className="text-xs text-zinc-400 font-mono">{totalSkills} total skills detected</span>
                  </div>

                  {[
                    { key: 'languages', label: 'Languages & Core Stack' },
                    { key: 'frameworks', label: 'Frameworks & Libraries' },
                    { key: 'cloudAndDevOps', label: 'Cloud, Infrastructure & DevOps' },
                    { key: 'databasesAndTools', label: 'Databases, Message Brokers & Tools' },
                    { key: 'concepts', label: 'Architecture, Paradigms & Methodologies' },
                  ].map(({ key, label }) => {
                    const skillsObj: any = editableData.skills || {};
                    const list: string[] = Array.isArray(skillsObj[key]) ? skillsObj[key] : [];

                    return (
                      <div key={key} className="space-y-2 p-3 bg-zinc-800/40 rounded-xl border border-zinc-700/40">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-zinc-300">{label}</label>
                          <span className="text-[10px] text-zinc-500 font-mono">{list.length} skills</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          {list.map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 bg-zinc-800 text-zinc-200 text-xs rounded-lg border border-zinc-700/70 flex items-center gap-1.5 shadow-xs"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(key, skill)}
                                className="text-zinc-500 hover:text-rose-400 text-xs font-bold"
                              >
                                ×
                              </button>
                            </span>
                          ))}

                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="+ Add skill (press Enter)..."
                              value={newSkillInput[key] || ''}
                              onChange={(e) => setNewSkillInput({ ...newSkillInput, [key]: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSkill(key, newSkillInput[key]);
                                }
                              }}
                              className="px-2.5 py-1 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-xs text-zinc-200 outline-none focus:border-indigo-500 w-36"
                            />
                            {newSkillInput[key] && (
                              <button
                                type="button"
                                onClick={() => handleAddSkill(key, newSkillInput[key])}
                                className="p-1 bg-indigo-600 text-white rounded text-xs"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: EDUCATION & CERTS EDITING */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  {/* Education */}
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <span>Education</span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddEducation}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Education</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editableData.education || []).map((edu, idx) => (
                        <div key={edu.id || idx} className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300">Degree #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteEducation(idx)}
                              className="text-zinc-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            <input
                              type="text"
                              placeholder="Degree & Major"
                              value={edu.degree}
                              onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                              className="p-1.5 bg-zinc-900/70 border border-zinc-700/50 rounded-lg text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                              className="p-1.5 bg-zinc-900/70 border border-zinc-700/50 rounded-lg text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Graduation Year"
                              value={edu.graduationYear}
                              onChange={(e) => handleUpdateEducation(idx, 'graduationYear', e.target.value)}
                              className="p-1.5 bg-zinc-900/70 border border-zinc-700/50 rounded-lg text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Location"
                              value={edu.location}
                              onChange={(e) => handleUpdateEducation(idx, 'location', e.target.value)}
                              className="p-1.5 bg-zinc-900/70 border border-zinc-700/50 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Certifications & Licenses</span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleAddCertification}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Certification</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editableData.certifications || []).map((cert, idx) => (
                        <div key={cert.id || idx} className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-300">Cert #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCertification(idx)}
                              className="text-zinc-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              placeholder="Certification Name"
                              value={cert.name}
                              onChange={(e) => handleUpdateCertification(idx, 'name', e.target.value)}
                              className="p-1.5 bg-zinc-900/70 border border-zinc-700/50 rounded-lg text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Issuing Organization"
                              value={cert.issuer}
                              onChange={(e) => handleUpdateCertification(idx, 'issuer', e.target.value)}
                              className="p-1.5 bg-zinc-900/70 border border-zinc-700/50 rounded-lg text-xs text-white"
                            />
                            <input
                              type="text"
                              placeholder="Year / Date"
                              value={cert.issueDate}
                              onChange={(e) => handleUpdateCertification(idx, 'issueDate', e.target.value)}
                              className="p-1.5 bg-zinc-900/70 border border-zinc-700/50 rounded-lg text-xs text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ATS FORMATTED DOCUMENT LIVE PREVIEW */}
              {activeTab === 'ats-preview' && (
                <div className="bg-white text-zinc-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-zinc-300 font-sans space-y-6 text-xs max-h-[600px] overflow-y-auto">
                  {/* Header */}
                  <div className="text-center border-b border-zinc-300 pb-4 space-y-1">
                    <h1 className="text-xl font-bold uppercase tracking-tight text-zinc-950">
                      {editableData.personal?.fullName || 'Candidate Name'}
                    </h1>
                    <p className="text-xs font-semibold text-zinc-700">
                      {editableData.personal?.title || 'Target Professional Title'}
                    </p>
                    <p className="text-[11px] text-zinc-600">
                      {[
                        editableData.personal?.email,
                        editableData.personal?.phone,
                        editableData.personal?.location,
                        editableData.personal?.linkedinUrl,
                      ]
                        .filter(Boolean)
                        .join('  •  ')}
                    </p>
                  </div>

                  {/* Summary */}
                  {editableData.personal?.summary && (
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5">
                        Professional Summary
                      </h2>
                      <p className="text-zinc-800 leading-relaxed text-[11px]">
                        {editableData.personal.summary}
                      </p>
                    </div>
                  )}

                  {/* Work Experience */}
                  {(editableData.experience || []).length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
                        Work Experience
                      </h2>
                      {editableData.experience?.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline font-bold text-[11px] text-zinc-950">
                            <span>
                              {exp.role} <span className="font-normal text-zinc-600">at</span> {exp.company}
                            </span>
                            <span className="text-zinc-600 font-mono text-[10px]">
                              {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate || 'Present'} | {exp.location}
                            </span>
                          </div>
                          <ul className="list-disc list-outside ml-4 space-y-0.5 text-zinc-800 text-[11px] leading-relaxed">
                            {exp.bullets?.map((b, bIdx) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {totalSkills > 0 && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
                        Technical Skills
                      </h2>
                      <div className="space-y-1 text-[11px] text-zinc-800">
                        {editableData.skills?.languages && editableData.skills.languages.length > 0 && (
                          <p>
                            <strong className="text-zinc-950 font-semibold">Languages & Core:</strong>{' '}
                            {editableData.skills.languages.join(', ')}
                          </p>
                        )}
                        {editableData.skills?.frameworks && editableData.skills.frameworks.length > 0 && (
                          <p>
                            <strong className="text-zinc-950 font-semibold">Frameworks & Libraries:</strong>{' '}
                            {editableData.skills.frameworks.join(', ')}
                          </p>
                        )}
                        {editableData.skills?.cloudAndDevOps && editableData.skills.cloudAndDevOps.length > 0 && (
                          <p>
                            <strong className="text-zinc-950 font-semibold">Cloud & DevOps:</strong>{' '}
                            {editableData.skills.cloudAndDevOps.join(', ')}
                          </p>
                        )}
                        {editableData.skills?.databasesAndTools && editableData.skills.databasesAndTools.length > 0 && (
                          <p>
                            <strong className="text-zinc-950 font-semibold">Databases & Tools:</strong>{' '}
                            {editableData.skills.databasesAndTools.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {(editableData.education || []).length > 0 && (
                    <div className="space-y-1">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5">
                        Education
                      </h2>
                      {editableData.education?.map((edu, idx) => (
                        <div key={idx} className="flex justify-between items-baseline text-[11px]">
                          <span>
                            <strong className="text-zinc-950 font-semibold">{edu.degree}</strong>, {edu.institution}
                          </span>
                          <span className="text-zinc-600 font-mono text-[10px]">{edu.graduationYear}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Selective Import Options Bar */}
              <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-zinc-400 text-[11px]">Apply to resume:</span>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={applySections.experience}
                      onChange={(e) => setApplySections({ ...applySections, experience: e.target.checked })}
                      className="rounded text-indigo-600 bg-zinc-800 border-zinc-700 w-3.5 h-3.5"
                    />
                    <span>Work Experience ({totalRoles})</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={applySections.personal}
                      onChange={(e) => setApplySections({ ...applySections, personal: e.target.checked })}
                      className="rounded text-indigo-600 bg-zinc-800 border-zinc-700 w-3.5 h-3.5"
                    />
                    <span>Profile & Summary</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={applySections.skills}
                      onChange={(e) => setApplySections({ ...applySections, skills: e.target.checked })}
                      className="rounded text-indigo-600 bg-zinc-800 border-zinc-700 w-3.5 h-3.5"
                    />
                    <span>Skills ({totalSkills})</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300 text-[11px]">
                    <input
                      type="checkbox"
                      checked={applySections.education}
                      onChange={(e) => setApplySections({ ...applySections, education: e.target.checked })}
                      className="rounded text-indigo-600 bg-zinc-800 border-zinc-700 w-3.5 h-3.5"
                    />
                    <span>Education & Certs</span>
                  </label>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900/70">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition"
          >
            Cancel
          </button>

          {!editableData ? (
            <button
              type="button"
              onClick={handleParse}
              disabled={!rawText.trim() || isParsing}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.35)] transition"
            >
              {isParsing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Extracting with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Parse & Extract with AI</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditableData(null)}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-semibold transition"
              >
                Back to Source Text
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition"
              >
                <span>Apply Customized Data ({totalRoles} Roles)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
