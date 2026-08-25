import React, { useState } from 'react';
import { 
  Github, 
  Star, 
  GitFork, 
  ExternalLink, 
  Sparkles, 
  CheckCircle, 
  Code2, 
  Folder,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { DEFAULT_PORTFOLIO_CONFIG } from '../../data/mockSaasData';

export const LiveHeroPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bento' | 'terminal' | 'minimal'>('bento');
  const portfolio = DEFAULT_PORTFOLIO_CONFIG;

  return (
    <div className="relative w-full max-w-4xl mx-auto group">
      {/* Decorative Ambient Mesh Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 via-cyan-500/20 to-emerald-500/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Browser Frame */}
      <div className="bg-[#10121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Browser Top Chrome */}
        <div className="bg-[#161822] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <div className="hidden sm:flex items-center gap-1.5 ml-3 px-3 py-1 rounded-md bg-black/40 border border-white/[0.06] text-[11px] font-mono text-zinc-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>https://gitfolio.dev/sreerang</span>
            </div>
          </div>

          {/* Quick Template Switcher Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/[0.06] text-[11px] font-semibold">
            {(['bento', 'terminal', 'minimal'] as const).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setActiveTab(tmpl)}
                className={`px-2.5 py-1 rounded-md capitalize transition cursor-pointer ${
                  activeTab === tmpl 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tmpl}
              </button>
            ))}
          </div>
        </div>

        {/* Live Generated Preview Body */}
        <div className="p-6 sm:p-8 bg-[#0a0a0c] text-zinc-200">
          
          {activeTab === 'bento' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-xs animate-fadeIn">
              {/* Profile Card */}
              <div className="md:col-span-8 bg-[#12131a] border border-white/[0.08] rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-lg text-indigo-300">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Sreerang K</h3>
                    <p className="text-zinc-400 text-xs font-mono">@sreerang • Distributed Systems & AI</p>
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Building developer infrastructure and generative AI tools. 6+ years shipping high-throughput microservices.
                </p>
              </div>

              {/* Stats Card */}
              <div className="md:col-span-4 bg-[#12131a] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">GitHub Analytics</span>
                <div className="grid grid-cols-2 gap-2 my-2">
                  <div className="bg-[#181a24] p-2 rounded-lg text-center">
                    <span className="text-base font-black text-white font-mono">4.8K+</span>
                    <span className="text-[9px] text-zinc-500 block">Stars</span>
                  </div>
                  <div className="bg-[#181a24] p-2 rounded-lg text-center">
                    <span className="text-base font-black text-emerald-400 font-mono">1.4K</span>
                    <span className="text-[9px] text-zinc-500 block">Commits</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">✓ Verified Developer Profile</span>
              </div>

              {/* Pinned Repos */}
              <div className="md:col-span-6 bg-[#12131a] border border-white/[0.08] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                    HyperCache Distributed KV
                  </span>
                  <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> 2.8K
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  Ultra-low latency in-memory caching engine in Go with Raft consensus.
                </p>
                <div className="flex gap-1 pt-1 font-mono text-[10px] text-indigo-300">
                  <span>#Go</span> • <span>#Raft</span> • <span>#Distributed</span>
                </div>
              </div>

              <div className="md:col-span-6 bg-[#12131a] border border-white/[0.08] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-cyan-400" />
                    Neural RAG Enterprise Engine
                  </span>
                  <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> 920
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2">
                  Hybrid vector & lexical search pipeline leveraging Gemini AI and pgvector.
                </p>
                <div className="flex gap-1 pt-1 font-mono text-[10px] text-cyan-300">
                  <span>#Python</span> • <span>#FastAPI</span> • <span>#pgvector</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="bg-[#0c0d12] p-5 rounded-xl border border-emerald-500/30 font-mono text-xs text-zinc-300 space-y-3 animate-fadeIn">
              <div className="text-emerald-400">$ gitfolio status --live</div>
              <div className="text-zinc-400">
                [OK] User: sreerang (28 public repositories synced)
              </div>
              <div className="p-3 bg-black/60 rounded border border-zinc-800 space-y-1">
                <p className="text-amber-300">const primary_languages = ["Go", "TypeScript", "Python", "Rust"];</p>
                <p className="text-zinc-400">// Top project: HyperCache Distributed KV (2,840 stars)</p>
                <p className="text-emerald-400">Deployed at: https://gitfolio.dev/sreerang</p>
              </div>
            </div>
          )}

          {activeTab === 'minimal' && (
            <div className="p-6 bg-zinc-950 rounded-xl border border-zinc-800 space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold text-white tracking-tight">Sreerang K</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Staff Software Engineer & Distributed Systems Architect. Building edge platforms, resilient microservices, and AI query pipelines.
              </p>
              <div className="flex gap-4 text-xs text-indigo-400 font-mono pt-2">
                <span>github.com/sreerang &rarr;</span>
                <span>sreerang.dev &rarr;</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
