import React, { useEffect, useState } from 'react';
import { 
  Github, 
  FolderGit2, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Layers, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OnboardingPipelineModalProps {
  username: string;
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingPipelineModal: React.FC<OnboardingPipelineModalProps> = ({
  username,
  isOpen,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Connecting to GitHub API...', detail: `Authenticated with @${username}`, icon: Github },
    { label: 'Analyzing repositories & tech stack...', detail: 'Indexed 28 public repos (Go, TypeScript, Python)', icon: FolderGit2 },
    { label: 'Selecting top 4 standout projects...', detail: 'Calculated star velocity & commit frequencies', icon: Sparkles },
    { label: 'Assembling live portfolio & deploying to Edge...', detail: `Ready at gitfolio.dev/${username}`, icon: Layers },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const t1 = setTimeout(() => setCurrentStep(1), 700);
    const t2 = setTimeout(() => setCurrentStep(2), 1400);
    const t3 = setTimeout(() => setCurrentStep(3), 2100);
    const t4 = setTimeout(() => {
      onComplete();
    }, 2900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12131a] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative text-zinc-200">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
            <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Building Your Gitfolio
          </h3>
          <p className="text-xs text-zinc-400">
            Extracting profile and generating an edge-hosted portfolio for <strong className="text-indigo-300">@{username}</strong>
          </p>
        </div>

        {/* Step Progress List */}
        <div className="space-y-3 p-4 bg-black/40 rounded-xl border border-white/[0.06]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div 
                key={idx}
                className={`flex items-center gap-3.5 p-3 rounded-lg transition duration-300 ${
                  isCurrent 
                    ? 'bg-[#181a24] border border-indigo-500/30' 
                    : isDone 
                      ? 'bg-transparent text-zinc-400' 
                      : 'opacity-40'
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-[10px] font-mono text-zinc-500">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <p className={`text-xs font-semibold ${isCurrent ? 'text-white font-bold' : isDone ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
