import React from 'react';
import { FolderGit2, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0a0a0c] text-zinc-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">Gitfolio</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              The developer portfolio platform engineered to automatically turn GitHub profiles and repositories into stunning, high-converting websites.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com/cosmiccoder200x-sys/gitfolio" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#templates" className="hover:text-white transition">Templates</a></li>
              <li><a href="#showcase" className="hover:text-white transition">Showcase</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
              <li><a href="https://github.com/cosmiccoder200x-sys/gitfolio" target="_blank" rel="noreferrer" className="hover:text-white transition">CLI Tool</a></li>
            </ul>
          </div>

          {/* Templates Col */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">Templates</h4>
            <ul className="space-y-2">
              <li><span className="text-zinc-500">Minimal</span></li>
              <li><span className="text-zinc-500">Terminal CLI</span></li>
              <li><span className="text-zinc-500">Bento Grid</span></li>
              <li><span className="text-zinc-500">Editorial</span></li>
              <li><span className="text-zinc-500">Gradient Mesh</span></li>
              <li><span className="text-zinc-500">Open Source Maintainer</span></li>
            </ul>
          </div>

          {/* Developers & Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase font-mono text-[11px] tracking-wider">Developers</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com/cosmiccoder200x-sys/gitfolio" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub Repo</a></li>
              <li><span className="hover:text-white transition cursor-pointer">API Reference</span></li>
              <li><span className="hover:text-white transition cursor-pointer">System Status</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Privacy & Terms</span></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} Gitfolio Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Engineered with precision for developers</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
