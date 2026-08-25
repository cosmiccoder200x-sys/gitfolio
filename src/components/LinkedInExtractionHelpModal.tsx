import React, { useState } from 'react';
import { 
  Linkedin, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  FileSpreadsheet, 
  MousePointerClick, 
  Layers, 
  Info,
  Lock,
  FileCheck,
  ChevronRight
} from 'lucide-react';

interface LinkedInExtractionHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImporter?: () => void;
}

export const LinkedInExtractionHelpModal: React.FC<LinkedInExtractionHelpModalProps> = ({
  isOpen,
  onClose,
  onOpenImporter,
}) => {
  const [activeMethod, setActiveMethod] = useState<'pdf' | 'archive' | 'copy'>('pdf');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  if (!isOpen) return null;

  const sampleFormatText = `Alex Rivera
Senior Full-Stack & Cloud Systems Architect
San Francisco, CA · alex.rivera@example.com · github.com/alexrivera

About:
Systems Architect with 7+ years of experience engineering high-throughput distributed backends, React platforms, and cloud infrastructure.

Experience:
Staff Software Engineer — CloudMatrix Technologies
Jan 2023 - Present · San Francisco, CA
- Architected distributed microservices on AWS EKS processing 45M daily requests with 99.99% uptime.
- Spearheaded frontend migration to React and Next.js, reducing LCP by 48%.
- Optimized PostgreSQL queries and Redis caching, cutting CPU load by 35%.

Senior Full-Stack Engineer — HyperScale Systems
Apr 2020 - Dec 2022 · Austin, TX
- Built real-time telemetry dashboard using WebSockets and Go workers.
- Implemented Kafka event pipeline ingesting 120GB/hour of data.

Education:
University of California, Berkeley — B.S. in Computer Science (2014 - 2018)

Skills:
TypeScript, React, Go, Node.js, PostgreSQL, Redis, Docker, Kubernetes, AWS`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://www.linkedin.com/mypreferences/d/download-my-data');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleFormatText);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#0f1117] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0077b5]/15 border border-[#0077b5]/30 flex items-center justify-center text-[#0077b5]">
              <Linkedin className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manual LinkedIn Data Extraction Guide</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  Official Methods
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Step-by-step instructions to safely extract your full career data
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-zinc-300 text-xs leading-relaxed">
          
          {/* Why Manual Extraction is Required Notice */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-amber-300 text-xs">
                Why is manual export recommended over automated API scraping?
              </h4>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                LinkedIn's official public API strictly restricts third-party access to personal profile data behind paid enterprise Recruiter tiers. Direct automated scraping is actively blocked by Cloudflare bot protection. <strong>Extracting your own data manually is 100% compliant, private, official, and takes under 30 seconds.</strong>
              </p>
            </div>
          </div>

          {/* Method Selection Tabs */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Select Extraction Method:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              {/* Method 1: PDF Export */}
              <button
                type="button"
                onClick={() => setActiveMethod('pdf')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  activeMethod === 'pdf'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xs'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>1. Save to PDF</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Fastest (15s)
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Download LinkedIn's official PDF summary with all roles & bullets.
                </p>
              </button>

              {/* Method 2: Direct Text & AI Parser */}
              <button
                type="button"
                onClick={() => setActiveMethod('copy')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  activeMethod === 'copy'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xs'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>2. Highlight & AI Parse</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    No Downloads
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Highlight raw text from your profile; Gemini AI auto-formats to STAR.
                </p>
              </button>

              {/* Method 3: Official Data Archive */}
              <button
                type="button"
                onClick={() => setActiveMethod('archive')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  activeMethod === 'archive'
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-xs'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    <span>3. Privacy Archive</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    100% History
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Request official CSV data archive under GDPR/CCPA settings.
                </p>
              </button>

            </div>
          </div>

          {/* ========================================================= */}
          {/* METHOD 1 CONTENT: SAVE TO PDF */}
          {/* ========================================================= */}
          {activeMethod === 'pdf' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Navigate to your LinkedIn Profile
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  Open LinkedIn in any desktop browser and go to your profile page: <code className="px-1.5 py-0.5 rounded bg-black text-indigo-300 font-mono text-[10px]">linkedin.com/in/your-username</code>.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Click "More" in the Top Header Card
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  In your top intro card (directly below your headline and next to the <em>"Open to"</em> and <em>"Add profile section"</em> buttons), click the <strong>"More"</strong> button with the dropdown arrow.
                </p>

                {/* Visual Representation Diagram */}
                <div className="pl-7 pt-1">
                  <div className="p-3 rounded-lg bg-black/60 border border-zinc-800 font-sans flex items-center gap-2 flex-wrap text-xs">
                    <div className="px-3 py-1 rounded-md bg-indigo-600 text-white font-semibold text-[11px] opacity-75">
                      Open to
                    </div>
                    <div className="px-3 py-1 rounded-md bg-zinc-800 text-zinc-300 font-semibold text-[11px] opacity-75">
                      Add profile section
                    </div>
                    <div className="px-3 py-1 rounded-md bg-zinc-800 border-2 border-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      <span>More ▾</span>
                    </div>
                    <span className="text-zinc-500 text-[11px]">➔ Select:</span>
                    <div className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>Save to PDF</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Select "Save to PDF" and Copy Content
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  LinkedIn will instantly generate and download a clean PDF. Open the PDF, press <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200">Cmd+A</kbd> / <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-200">Ctrl+A</kbd> to copy the text, and paste it into our AI Importer.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <span className="text-[11px] text-zinc-300 font-medium">
                  Ready with your PDF text? Open the AI Importer:
                </span>
                {onOpenImporter && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenImporter();
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open Importer</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* METHOD 2 CONTENT: DIRECT COPY & AI PARSE */}
          {/* ========================================================= */}
          {activeMethod === 'copy' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Highlight Your Profile Sections
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  On your LinkedIn profile, simply click and drag to highlight your <strong>About</strong>, <strong>Experience</strong>, <strong>Education</strong>, and <strong>Skills</strong> sections.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Paste Directly into the Gemini 3.7 AI Parser
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  Do not worry about messy formatting, weird line breaks, or missing dates. Our built-in Gemini 3.7 model parses messy raw text, isolates each company/role, and transforms basic task descriptions into quantifiable <strong>STAR bullets</strong>.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Preview & Selectively Apply to Your ATS Resume
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  Review extracted roles, tweak any dates or titles, and merge them with your GitHub repositories.
                </p>
              </div>

              {/* Sample Profile Copy Helper */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                    Want to test with a pre-formatted template?
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySample}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSample ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied Template</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Sample Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* METHOD 3 CONTENT: OFFICIAL DATA ARCHIVE */}
          {/* ========================================================= */}
          {activeMethod === 'archive' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Open LinkedIn Data Privacy Settings
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  Click your profile avatar in the top navigation bar, choose <strong>Settings & Privacy</strong>, and select <strong>Data Privacy</strong> on the left.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Click "Get a copy of your data"
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  Choose <em>"Select the data files you're most interested in"</em> and check <strong>Positions</strong>, <strong>Profile</strong>, and <strong>Education</strong>.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-white text-xs">
                    Click "Request archive"
                  </h4>
                </div>
                <p className="text-zinc-400 text-[11px] pl-7">
                  LinkedIn prepares a zip file containing clean <code className="px-1 py-0.5 bg-black rounded text-amber-300 font-mono text-[10px]">Positions.csv</code> and emails you a download link within 10 minutes.
                </p>
              </div>

              {/* Direct Settings Link Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <span className="text-[11px] text-amber-200/90 font-medium">
                  Direct shortcut to LinkedIn's Data Download portal:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <a
                    href="https://www.linkedin.com/mypreferences/d/download-my-data"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open LinkedIn Settings</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Recruiter & ATS Tips Card */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pro ATS Optimization Tips When Importing LinkedIn Data</span>
            </h4>
            <ul className="space-y-1.5 text-zinc-400 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Replace duty statements with metrics:</strong> Change "Responsible for database maintenance" to "Optimized PostgreSQL indexes reducing query latency by 40%".</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Curate relevant tech stacks:</strong> Tag each role with the exact languages and cloud tools you utilized.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Cross-link GitHub codebases:</strong> Pair your work experience with verified repository projects in the ATS Builder.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 shrink-0">
          <span className="text-[11px] text-zinc-500">
            Compliant with LinkedIn Terms of Service & Data Portability Standards
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Close Guide
            </button>

            {onOpenImporter && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenImporter();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(79,70,229,0.3)] cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
                <span>Launch LinkedIn Importer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
