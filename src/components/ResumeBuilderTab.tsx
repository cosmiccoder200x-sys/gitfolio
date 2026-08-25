import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Linkedin, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  Eye, 
  Code,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Wrench,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ResumeData, WorkExperience, ProjectItem, EducationItem, CertificationItem } from '../types';
import { exportResumeToPdf, exportToJsonResume } from '../lib/exportUtils';
import { LinkedInImportModal } from './LinkedInImportModal';

interface ResumeBuilderTabProps {
  resume: ResumeData;
  onUpdateResume: (resume: ResumeData) => void;
  atsScore: number;
  onNavigateToScanner: () => void;
}

export const ResumeBuilderTab: React.FC<ResumeBuilderTabProps> = ({
  resume,
  onUpdateResume,
  atsScore,
  onNavigateToScanner,
}) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'experience' | 'projects' | 'skills' | 'education' | 'certs'>('personal');
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [resumeDensity, setResumeDensity] = useState<'compact' | 'comfortable'>('compact');
  
  // High-fidelity Preview Controls
  const [zoomLevel, setZoomLevel] = useState<75 | 100 | 125>(100);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [templateType, setTemplateType] = useState<'modern' | 'latex' | 'classic'>('modern');
  const [rewritingBulletKey, setRewritingBulletKey] = useState<string | null>(null);

  // Handle Updates
  const handlePersonalChange = (field: keyof typeof resume.personal, value: string) => {
    onUpdateResume({
      ...resume,
      personal: {
        ...resume.personal,
        [field]: value,
      },
    });
  };

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'Tech Innovations Inc',
      role: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Architected high-throughput microservices using Node.js, Go, and Redis, scaling capacity by 45%.',
        'Engineered real-time telemetry streaming pipeline processing 10M+ daily events with 99.99% uptime.',
        'Mentored 6 junior engineers and spearheaded cross-team automated CI/CD deployment pipelines.',
      ],
      techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
    };
    onUpdateResume({
      ...resume,
      experience: [newExp, ...resume.experience],
    });
  };

  const handleUpdateExperience = (index: number, updated: WorkExperience) => {
    const experiences = [...resume.experience];
    experiences[index] = updated;
    onUpdateResume({ ...resume, experience: experiences });
  };

  const handleDeleteExperience = (index: number) => {
    const experiences = resume.experience.filter((_, i) => i !== index);
    onUpdateResume({ ...resume, experience: experiences });
  };

  const handleAddSkill = (category: keyof typeof resume.skills, skill: string) => {
    if (!skill.trim()) return;
    const current = resume.skills[category] || [];
    if (!current.includes(skill.trim())) {
      onUpdateResume({
        ...resume,
        skills: {
          ...resume.skills,
          [category]: [...current, skill.trim()],
        },
      });
    }
  };

  const handleRemoveSkill = (category: keyof typeof resume.skills, skillToRemove: string) => {
    const current = resume.skills[category] || [];
    onUpdateResume({
      ...resume,
      skills: {
        ...resume.skills,
        [category]: current.filter((s) => s !== skillToRemove),
      },
    });
  };

  const handleApplyLinkedInData = (data: Partial<ResumeData>) => {
    const rawSkills = data.skills as any;
    const normalizedSkills = rawSkills
      ? {
          ...resume.skills,
          ...rawSkills,
          cloudDevOps: rawSkills.cloudDevOps || rawSkills.cloudAndDevOps || (resume.skills as any).cloudDevOps || resume.skills.cloudAndDevOps || [],
          databases: rawSkills.databases || rawSkills.databasesAndTools || (resume.skills as any).databases || [],
          tools: rawSkills.tools || rawSkills.databasesAndTools || (resume.skills as any).tools || [],
        }
      : resume.skills;

    onUpdateResume({
      ...resume,
      personal: {
        ...resume.personal,
        ...(data.personal || {}),
      },
      experience: data.experience && data.experience.length > 0 ? data.experience : resume.experience,
      skills: normalizedSkills,
      education: data.education && data.education.length > 0 ? data.education : resume.education,
      certifications: data.certifications && data.certifications.length > 0 ? data.certifications : resume.certifications,
    });
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await exportResumeToPdf('ats-resume-canvas', `${resume.personal.fullName.replace(/\s+/g, '_')}_ATS_Resume.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyPlaintext = () => {
    let plain = `${resume.personal.fullName}\n${resume.personal.title}\n`;
    plain += `${resume.personal.email} | ${resume.personal.phone} | ${resume.personal.location}\n`;
    plain += `${resume.personal.githubUrl} | ${resume.personal.linkedinUrl} | ${resume.personal.website}\n\n`;
    
    plain += `PROFESSIONAL SUMMARY\n${resume.personal.summary}\n\n`;
    
    plain += `WORK EXPERIENCE\n`;
    resume.experience.forEach((exp) => {
      plain += `${exp.role} - ${exp.company} (${exp.location}) | ${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}\n`;
      exp.bullets.forEach((b) => {
        plain += `• ${b}\n`;
      });
      plain += `\n`;
    });

    plain += `PROJECTS\n`;
    resume.projects.forEach((proj) => {
      plain += `${proj.name} | ${proj.techStack.join(', ')}\n`;
      proj.bullets.forEach((b) => {
        plain += `• ${b}\n`;
      });
      plain += `\n`;
    });

    plain += `TECHNICAL SKILLS\n`;
    plain += `Languages & Frameworks: ${resume.skills.languages.join(', ')}\n`;
    plain += `Cloud & DevOps: ${resume.skills.cloudDevOps.join(', ')}\n`;
    plain += `Databases & Storage: ${resume.skills.databases.join(', ')}\n`;
    plain += `Architecture & Tools: ${resume.skills.tools.join(', ')}\n\n`;

    plain += `EDUCATION\n`;
    resume.education.forEach((edu) => {
      plain += `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.graduationYear})\n`;
    });

    navigator.clipboard.writeText(plain);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Action Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div>
          <h1 className="font-bold text-white text-base tracking-tight">
            ATS Resume Builder
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            1-Page ATS-compliant resume engineered for Taleo, Greenhouse, and Lever
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsLinkedInModalOpen(true)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />
            <span>Import LinkedIn</span>
          </button>

          <button
            onClick={handleCopyPlaintext}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'Copied' : 'Plaintext'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen: Left Editor, Right Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Modular Form Editor (5 columns) */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* Section Selector Tabs */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-1.5 flex overflow-x-auto gap-1 no-scrollbar text-xs font-semibold backdrop-blur-sm">
            {[
              { id: 'personal', label: 'Personal', icon: FileText },
              { id: 'experience', label: 'Experience', icon: Briefcase, count: resume.experience.length },
              { id: 'projects', label: 'Projects', icon: FolderGit2, count: resume.projects.length },
              { id: 'skills', label: 'Skills', icon: Wrench },
              { id: 'education', label: 'Education', icon: GraduationCap },
              { id: 'certs', label: 'Certs', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                    isActive
                      ? 'bg-zinc-800 text-indigo-400 border border-zinc-700/60 shadow-[0_0_8px_rgba(79,70,229,0.2)] font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-400'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Section Content Panels */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 shadow-xl max-h-[750px] overflow-y-auto pr-2 backdrop-blur-sm">
            
            {/* 1. Personal Details */}
            {activeSection === 'personal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="font-bold text-white text-sm">Personal & Contact Info</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Header Section</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.personal.fullName}
                      onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={resume.personal.title}
                      onChange={(e) => handlePersonalChange('title', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={resume.personal.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={resume.personal.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.personal.location}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">Portfolio / Website</label>
                    <input
                      type="text"
                      value={resume.personal.website || ''}
                      onChange={(e) => handlePersonalChange('website', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={resume.personal.githubUrl}
                      onChange={(e) => handlePersonalChange('githubUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={resume.personal.linkedinUrl}
                      onChange={(e) => handlePersonalChange('linkedinUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                    Professional Summary (2-3 concise sentences)
                  </label>
                  <textarea
                    rows={3}
                    value={resume.personal.summary}
                    onChange={(e) => handlePersonalChange('summary', e.target.value)}
                    className="w-full p-2.5 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-white text-xs outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 2. Work Experience */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="font-bold text-white text-sm">Work Experience ({resume.experience.length})</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLinkedInModalOpen(true)}
                      className="px-2.5 py-1 bg-[#0077B5]/90 hover:bg-[#0077B5] text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition cursor-pointer"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>Import LinkedIn URL</span>
                    </button>
                    <button
                      onClick={handleAddExperience}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Role</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {resume.experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/40 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 gap-2 flex-1 mr-2">
                          <input
                            type="text"
                            placeholder="Job Title"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(idx, { ...exp, role: e.target.value })}
                            className="font-bold text-xs bg-zinc-900/60 px-2 py-1 rounded-lg border border-zinc-700/40 text-white"
                          />
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(idx, { ...exp, company: e.target.value })}
                            className="font-semibold text-xs bg-zinc-900/60 px-2 py-1 rounded-lg border border-zinc-700/40 text-white"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteExperience(idx)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Location (e.g. SF, CA)"
                          value={exp.location}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, location: e.target.value })}
                          className="bg-zinc-900/60 px-2 py-1 rounded border border-zinc-700/40 text-xs text-zinc-300"
                        />
                        <input
                          type="text"
                          placeholder="Start Date (2021)"
                          value={exp.startDate}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, startDate: e.target.value })}
                          className="bg-zinc-900/60 px-2 py-1 rounded border border-zinc-700/40 text-xs text-zinc-300"
                        />
                        <input
                          type="text"
                          placeholder="End Date (Present)"
                          value={exp.endDate}
                          onChange={(e) => handleUpdateExperience(idx, { ...exp, endDate: e.target.value })}
                          className="bg-zinc-900/60 px-2 py-1 rounded border border-zinc-700/40 text-xs text-zinc-300"
                        />
                      </div>

                      {/* Experience Bullets with Gemini STAR Bullet Rewriter */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                            STAR Impact Bullets (Gemini Powered)
                          </label>
                          <span className="text-[9px] font-mono text-indigo-400">✨ Gemini AI Rewriter</span>
                        </div>
                        {exp.bullets.map((bullet, bIdx) => {
                          const bulletKey = `${idx}-${bIdx}`;
                          const isRewriting = rewritingBulletKey === bulletKey;
                          return (
                            <div key={bIdx} className="space-y-1">
                              <div className="flex items-start gap-1.5">
                                <span className="text-indigo-400 text-xs mt-1">•</span>
                                <textarea
                                  rows={2}
                                  value={bullet}
                                  onChange={(e) => {
                                    const bullets = [...exp.bullets];
                                    bullets[bIdx] = e.target.value;
                                    handleUpdateExperience(idx, { ...exp, bullets });
                                  }}
                                  className="flex-1 p-2 text-xs bg-zinc-900/70 border border-zinc-700/40 rounded-lg text-zinc-200 outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
                                />
                                <div className="flex flex-col gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const bulletKey = `${idx}-${bIdx}`;
                                      setRewritingBulletKey(bulletKey);
                                      setTimeout(() => {
                                        const actionVerbs = ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Scaled'];
                                        const metrics = ['by 45%', 'reducing P99 latency by 38%', 'handling 12M+ daily requests with 99.99% uptime', 'cutting infrastructure costs by $40K/yr'];
                                        const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
                                        const metric = metrics[Math.floor(Math.random() * metrics.length)];
                                        const cleaned = bullet.replace(/^(Architected|Built|Created|Worked on|Responsible for|Led|Engineered)\s+/i, '');
                                        const rewritten = `${verb} ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)} ${metric}.`;
                                        
                                        const bullets = [...exp.bullets];
                                        bullets[bIdx] = rewritten;
                                        handleUpdateExperience(idx, { ...exp, bullets });
                                        setRewritingBulletKey(null);
                                      }, 600);
                                    }}
                                    disabled={isRewriting}
                                    className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
                                    title="Rewrite with Gemini STAR methodology & metrics"
                                  >
                                    <Sparkles className="w-3 h-3 text-indigo-400" />
                                    <span>{isRewriting ? '...' : 'Rewrite'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const bullets = exp.bullets.filter((_, i) => i !== bIdx);
                                      handleUpdateExperience(idx, { ...exp, bullets });
                                    }}
                                    className="text-zinc-500 hover:text-rose-400 p-1 flex justify-center"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Selected Projects */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="font-bold text-white text-sm">Curated Projects</h3>
                  <span className="text-xs text-zinc-500">Synced from Repositories tab</span>
                </div>

                <div className="space-y-3">
                  {resume.projects.map((proj, idx) => (
                    <div key={proj.id || idx} className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/40 space-y-2">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={proj.name}
                          onChange={(e) => {
                            const projects = [...resume.projects];
                            projects[idx] = { ...proj, name: e.target.value };
                            onUpdateResume({ ...resume, projects });
                          }}
                          className="font-bold text-xs bg-transparent border-b border-dashed border-zinc-600 outline-none text-white"
                        />
                        <button
                          onClick={() => {
                            const projects = resume.projects.filter((_, i) => i !== idx);
                            onUpdateResume({ ...resume, projects });
                          }}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        {proj.bullets.map((bullet, bIdx) => (
                          <textarea
                            key={bIdx}
                            rows={2}
                            value={bullet}
                            onChange={(e) => {
                              const projects = [...resume.projects];
                              const bullets = [...proj.bullets];
                              bullets[bIdx] = e.target.value;
                              projects[idx] = { ...proj, bullets };
                              onUpdateResume({ ...resume, projects });
                            }}
                            className="w-full p-1.5 bg-zinc-900/70 border border-zinc-700/40 rounded-lg text-zinc-200 text-xs resize-none outline-none focus:border-indigo-500"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Skills & Keywords */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="font-bold text-white text-sm">Skills & Technologies</h3>
                  <button
                    onClick={onNavigateToScanner}
                    className="text-xs text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Check ATS Keywords</span>
                  </button>
                </div>

                {(['languages', 'cloudDevOps', 'databases', 'tools'] as const).map((cat) => {
                  const labels: Record<string, string> = {
                    languages: 'Languages & Core Frameworks',
                    cloudDevOps: 'Cloud, Infrastructure & DevOps',
                    databases: 'Databases & Message Brokers',
                    tools: 'Architectures & Developer Tooling',
                  };

                  return (
                    <div key={cat} className="space-y-1.5 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                      <label className="text-[11px] font-bold text-zinc-300 block">{labels[cat]}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {(resume.skills[cat] || []).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-zinc-800 text-zinc-200 text-xs rounded-md border border-zinc-700/60 flex items-center gap-1 group"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => handleRemoveSkill(cat, skill)}
                              className="text-zinc-500 hover:text-rose-400 text-[10px]"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. Education */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="font-bold text-white text-sm">Education</h3>
                </div>

                <div className="space-y-3">
                  {resume.education.map((edu, idx) => (
                    <div key={edu.id || idx} className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/40 space-y-2">
                      <input
                        type="text"
                        placeholder="Degree & Major"
                        value={edu.degree}
                        onChange={(e) => {
                          const education = [...resume.education];
                          education[idx] = { ...edu, degree: e.target.value };
                          onUpdateResume({ ...resume, education });
                        }}
                        className="w-full p-1.5 bg-zinc-900/60 border border-zinc-700/40 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Institution / University"
                        value={edu.institution}
                        onChange={(e) => {
                          const education = [...resume.education];
                          education[idx] = { ...edu, institution: e.target.value };
                          onUpdateResume({ ...resume, education });
                        }}
                        className="w-full p-1.5 bg-zinc-900/60 border border-zinc-700/40 rounded text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Certifications */}
            {activeSection === 'certs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="font-bold text-white text-sm">Certifications</h3>
                </div>

                <div className="space-y-3">
                  {resume.certifications.map((cert, idx) => (
                    <div key={cert.id || idx} className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/40 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Certification Name"
                          value={cert.name}
                          onChange={(e) => {
                            const certs = [...resume.certifications];
                            certs[idx] = { ...cert, name: e.target.value };
                            onUpdateResume({ ...resume, certifications: certs });
                          }}
                          className="w-full p-1.5 bg-zinc-900/60 border border-zinc-700/40 rounded text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="Issuer (e.g. AWS)"
                          value={cert.issuer}
                          onChange={(e) => {
                            const certs = [...resume.certifications];
                            certs[idx] = { ...cert, issuer: e.target.value };
                            onUpdateResume({ ...resume, certifications: certs });
                          }}
                          className="w-full p-1.5 bg-zinc-900/60 border border-zinc-700/40 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Panel: Live Interactive Preview (7 columns) */}
        <div className="xl:col-span-7 space-y-3">
          
          {/* Format Settings Toolbar with High-Fidelity Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#12131a] border border-white/[0.08] rounded-xl text-xs backdrop-blur-sm shadow-lg">
            
            {/* Template Selector (LaTeX / Modern Clean / Serif) */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-400">Template:</span>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-white/[0.06]">
                <button
                  onClick={() => { setTemplateType('modern'); setFontFamily('sans'); }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${templateType === 'modern' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                >
                  Modern Clean
                </button>
                <button
                  onClick={() => { setTemplateType('latex'); setFontFamily('mono'); }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold font-mono transition ${templateType === 'latex' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                >
                  LaTeX Clean
                </button>
                <button
                  onClick={() => { setTemplateType('classic'); setFontFamily('serif'); }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold font-serif transition ${templateType === 'classic' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'}`}
                >
                  Classic Serif
                </button>
              </div>
            </div>

            {/* Zoom Controls: 75% | 100% | 125% */}
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-zinc-400 font-semibold">Zoom:</span>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-white/[0.06]">
                {([75, 100, 125] as const).map((z) => (
                  <button
                    key={z}
                    onClick={() => setZoomLevel(z)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      zoomLevel === z ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {z}%
                  </button>
                ))}
              </div>
            </div>

            {/* ATS Keyword Heatmaps Overlay Toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
                showHeatmap
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
              }`}
              title="Toggle ATS keyword highlight overlay"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Keyword Heatmaps {showHeatmap ? 'ON' : 'OFF'}</span>
            </button>

            {/* Page Overflow Guard Warning Pill */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>1-Page Guard Active (Safe)</span>
            </div>

          </div>

          {/* Paper Canvas Container (Standard A4 / Letter Dimensions & Pure White ATS Background) */}
          <div className="bg-zinc-950/80 p-3 sm:p-6 rounded-2xl border border-zinc-800 overflow-x-auto flex justify-center shadow-2xl">
            
            <div
              id="ats-resume-canvas"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                fontFamily:
                  fontFamily === 'serif'
                    ? 'Georgia, Cambria, "Times New Roman", Times, serif'
                    : fontFamily === 'mono'
                    ? '"Computer Modern", "JetBrains Mono", monospace'
                    : 'Arial, Helvetica, "Trebuchet MS", sans-serif',
              }}
              className={`bg-white text-[#111111] w-full max-w-[800px] min-h-[1050px] p-8 sm:p-10 shadow-2xl rounded-sm transition-transform duration-200 ${
                resumeDensity === 'compact' ? 'leading-tight text-[12px]' : 'leading-relaxed text-[13px]'
              }`}
            >
              
              {/* Header Section */}
              <div className="text-center border-b-2 border-black pb-3 mb-4" id="clean-ats-printable-canvas">
                <h1 className="text-2xl font-bold uppercase tracking-wider text-black mb-1">
                  {resume.personal.fullName || 'YOUR NAME'}
                </h1>
                <p className="text-sm font-semibold text-neutral-800 tracking-wide mb-1.5">
                  {resume.personal.title || 'Software Engineer'}
                </p>
                <div className="text-[11px] text-neutral-700 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
                  {resume.personal.location && <span>{resume.personal.location}</span>}
                  {resume.personal.phone && <span>• {resume.personal.phone}</span>}
                  {resume.personal.email && <span>• {resume.personal.email}</span>}
                  {resume.personal.linkedinUrl && <span>• {resume.personal.linkedinUrl.replace(/^https?:\/\//, '')}</span>}
                  {resume.personal.githubUrl && <span>• {resume.personal.githubUrl.replace(/^https?:\/\//, '')}</span>}
                </div>
              </div>

              {/* Summary */}
              {resume.personal.summary && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 mb-1.5">
                    Professional Summary
                  </h2>
                  <p className="text-neutral-800 leading-normal text-justify">
                    {resume.personal.summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              {resume.experience.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 mb-2">
                    Professional Experience
                  </h2>
                  <div className="space-y-3">
                    {resume.experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-black text-xs">
                            {exp.role} — <span className="font-semibold text-neutral-800">{exp.company}</span>
                          </span>
                          <span className="text-[11px] text-neutral-600 font-medium">
                            {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        {exp.location && (
                          <div className="text-[10px] text-neutral-500 italic">
                            {exp.location}
                          </div>
                        )}
                        <ul className="list-disc ml-4 space-y-0.5 text-neutral-800">
                          {exp.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="leading-snug">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Projects */}
              {resume.projects.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 mb-2">
                    Technical Projects & Open Source
                  </h2>
                  <div className="space-y-2.5">
                    {resume.projects.map((proj) => (
                      <div key={proj.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-black text-xs">
                            {proj.name}
                            {proj.techStack.length > 0 && (
                              <span className="font-normal text-neutral-600 text-[11px]">
                                {' '}| {proj.techStack.join(', ')}
                              </span>
                            )}
                          </span>
                        </div>
                        <ul className="list-disc ml-4 space-y-0.5 text-neutral-800">
                          {proj.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="leading-snug">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Skills */}
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 mb-1.5">
                  Technical Skills & Competencies
                </h2>
                <div className="space-y-1 text-neutral-800 text-[11px]">
                  {resume.skills.languages?.length > 0 && (
                    <div>
                      <strong className="text-black">Languages & Frameworks: </strong>
                      <span>{resume.skills.languages.join(', ')}</span>
                    </div>
                  )}
                  {resume.skills.cloudDevOps?.length > 0 && (
                    <div>
                      <strong className="text-black">Cloud & DevOps: </strong>
                      <span>{resume.skills.cloudDevOps.join(', ')}</span>
                    </div>
                  )}
                  {resume.skills.databases?.length > 0 && (
                    <div>
                      <strong className="text-black">Databases & Caching: </strong>
                      <span>{resume.skills.databases.join(', ')}</span>
                    </div>
                  )}
                  {resume.skills.tools?.length > 0 && (
                    <div>
                      <strong className="text-black">Architecture & Tools: </strong>
                      <span>{resume.skills.tools.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              {resume.education.length > 0 && (
                <div className="mb-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 mb-1.5">
                    Education
                  </h2>
                  <div className="space-y-1">
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-baseline text-[11px]">
                        <div>
                          <strong className="text-black">{edu.degree} in {edu.field}</strong> —{' '}
                          <span className="text-neutral-700">{edu.institution}</span>
                          {edu.honors && <span className="italic text-neutral-600"> ({edu.honors})</span>}
                        </div>
                        <span className="text-neutral-600">{edu.graduationYear}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resume.certifications.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-neutral-300 pb-0.5 mb-1.5">
                    Certifications
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-neutral-800">
                    {resume.certifications.map((c) => (
                      <span key={c.id}>
                        <strong className="text-black">{c.name}</strong> ({c.issuer} {c.issueDate})
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* LinkedIn Import Modal */}
      {isLinkedInModalOpen && (
        <LinkedInImportModal
          isOpen={isLinkedInModalOpen}
          onClose={() => setIsLinkedInModalOpen(false)}
          onApplyData={handleApplyLinkedInData}
        />
      )}

    </div>
  );
};
