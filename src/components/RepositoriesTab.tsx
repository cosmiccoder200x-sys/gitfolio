import React, { useState } from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  Star, 
  GitFork, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Code2, 
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  Layers,
  X
} from 'lucide-react';
import { GitHubRepo, ProjectItem } from '../types';
import { generateProjectBullets } from '../lib/geminiApi';

interface RepositoriesTabProps {
  repos: GitHubRepo[];
  onUpdateRepos: (repos: GitHubRepo[]) => void;
  targetRole: string;
  onSyncWithResumeProjects: (projects: ProjectItem[]) => void;
}

export const RepositoriesTab: React.FC<RepositoriesTabProps> = ({
  repos,
  onUpdateRepos,
  targetRole,
  onSyncWithResumeProjects,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [generatingRepoId, setGeneratingRepoId] = useState<number | null>(null);
  const [newCustomProjectModal, setNewCustomProjectModal] = useState(false);

  // Custom project form state
  const [customProjName, setCustomProjName] = useState('');
  const [customProjDesc, setCustomProjDesc] = useState('');
  const [customProjLang, setCustomProjLang] = useState('TypeScript');
  const [customProjUrl, setCustomProjUrl] = useState('');

  // Extract unique languages
  const availableLanguages = Array.from(
    new Set(repos.map((r) => r.language).filter(Boolean))
  ) as string[];

  // Filtered repos
  const filteredRepos = repos.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.topics && r.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesLang = selectedLanguage === 'all' || r.language === selectedLanguage;
    return matchesSearch && matchesLang;
  });

  const toggleResumeSelection = (repoId: number) => {
    const updated = repos.map((r) =>
      r.id === repoId ? { ...r, selectedForResume: !r.selectedForResume } : r
    );
    onUpdateRepos(updated);
  };

  const togglePortfolioSelection = (repoId: number) => {
    const updated = repos.map((r) =>
      r.id === repoId ? { ...r, selectedForPortfolio: !r.selectedForPortfolio } : r
    );
    onUpdateRepos(updated);
  };

  const handleGenerateBullets = async (repo: GitHubRepo) => {
    setGeneratingRepoId(repo.id);
    try {
      const result = await generateProjectBullets({
        projectName: repo.customTitle || repo.name,
        description: repo.description || undefined,
        language: repo.language || undefined,
        topics: repo.topics,
        targetRole: targetRole,
        stars: repo.stargazers_count,
      });

      const updated = repos.map((r) => {
        if (r.id === repo.id) {
          return {
            ...r,
            selectedForResume: true,
            customBullets: result.bullets,
            topics: Array.from(new Set([...(r.topics || []), ...(result.techStack || [])])),
          };
        }
        return r;
      });

      onUpdateRepos(updated);
    } catch (err: any) {
      console.error('Failed to generate bullets:', err);
    } finally {
      setGeneratingRepoId(null);
    }
  };

  const handleAddCustomBullet = (repoId: number) => {
    const updated = repos.map((r) => {
      if (r.id === repoId) {
        const bullets = r.customBullets ? [...r.customBullets] : [];
        bullets.push('Architected high-throughput service reducing API response latency by 35% with automated regression testing.');
        return { ...r, customBullets: bullets };
      }
      return r;
    });
    onUpdateRepos(updated);
  };

  const handleUpdateBulletText = (repoId: number, index: number, text: string) => {
    const updated = repos.map((r) => {
      if (r.id === repoId && r.customBullets) {
        const bullets = [...r.customBullets];
        bullets[index] = text;
        return { ...r, customBullets: bullets };
      }
      return r;
    });
    onUpdateRepos(updated);
  };

  const handleDeleteBullet = (repoId: number, index: number) => {
    const updated = repos.map((r) => {
      if (r.id === repoId && r.customBullets) {
        const bullets = r.customBullets.filter((_, i) => i !== index);
        return { ...r, customBullets: bullets };
      }
      return r;
    });
    onUpdateRepos(updated);
  };

  const handleCreateCustomProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProjName.trim()) return;

    const newRepo: GitHubRepo = {
      id: Date.now(),
      name: customProjName.trim(),
      full_name: `custom/${customProjName.trim()}`,
      private: false,
      html_url: customProjUrl.trim() || 'https://github.com',
      description: customProjDesc.trim() || 'High-impact enterprise software engineering initiative.',
      fork: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pushed_at: new Date().toISOString(),
      homepage: null,
      size: 1000,
      stargazers_count: 0,
      watchers_count: 0,
      language: customProjLang,
      forks_count: 0,
      open_issues_count: 0,
      topics: [customProjLang.toLowerCase(), 'enterprise', 'fullstack'],
      selectedForResume: true,
      selectedForPortfolio: true,
      customBullets: [
        `Architected ${customProjName} using ${customProjLang} and cloud infrastructure, driving 40% performance improvement.`,
        'Implemented end-to-end telemetry and CI/CD automated deployment pipelines.',
      ],
    };

    onUpdateRepos([newRepo, ...repos]);
    setNewCustomProjectModal(false);
    setCustomProjName('');
    setCustomProjDesc('');
    setCustomProjUrl('');
  };

  const selectedForResumeCount = repos.filter(r => r.selectedForResume).length;
  const selectedForPortfolioCount = repos.filter(r => r.selectedForPortfolio).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Bento Header & Summary Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Repository & Project Curator
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Curate projects for your ATS resume and live portfolio. Generate STAR impact bullets with Gemini.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/40 border border-zinc-700/30 rounded-xl text-xs text-zinc-300">
              <span>Selected:</span>
              <span className="font-bold text-indigo-400">{selectedForResumeCount} Resume</span>
              <span>•</span>
              <span className="font-bold text-emerald-400">{selectedForPortfolioCount} Portfolio</span>
            </div>

            <button
              onClick={() => setNewCustomProjectModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-[0_0_12px_rgba(79,70,229,0.3)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Project</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-zinc-800/60">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search repositories by name, description, or topic tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-xs text-zinc-300 outline-none focus:border-indigo-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="all">All Languages ({repos.length})</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Repositories Bento List */}
      <div className="space-y-4">
        {filteredRepos.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-12 text-center">
            <Code2 className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="font-semibold text-zinc-300 text-sm">No repositories found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your search query or language filter.</p>
          </div>
        ) : (
          filteredRepos.map((repo) => {
            const isGenerating = generatingRepoId === repo.id;
            const hasBullets = repo.customBullets && repo.customBullets.length > 0;

            return (
              <div
                key={repo.id}
                className={`bg-zinc-900/50 border rounded-2xl p-5 transition-all shadow-lg backdrop-blur-sm ${
                  repo.selectedForResume || repo.selectedForPortfolio
                    ? 'border-zinc-700/80 bg-zinc-900/70 shadow-[0_0_15px_rgba(79,70,229,0.06)]'
                    : 'border-zinc-800/80 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${repo.selectedForResume ? 'bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]' : 'bg-zinc-600'}`} />
                        <h3 className="font-bold text-white text-sm">
                          {repo.customTitle || repo.name}
                        </h3>
                      </div>

                      {repo.language && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/40">
                          {repo.language}
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{repo.stargazers_count}</span>
                      </span>

                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <GitFork className="w-3 h-3" />
                          <span>{repo.forks_count}</span>
                        </span>
                      )}

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-indigo-400 transition"
                        title="Open on GitHub"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      {repo.description || 'No description provided in GitHub repository.'}
                    </p>

                    {/* Topics */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {repo.topics.slice(0, 8).map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800/60 text-indigo-300 border border-indigo-500/20"
                          >
                            #{topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Inclusion Toggles & AI Generator Action */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 items-end">
                    
                    {/* Resume Toggle Checkbox */}
                    <button
                      onClick={() => toggleResumeSelection(repo.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        repo.selectedForResume
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_10px_rgba(79,70,229,0.15)]'
                          : 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800'
                      }`}
                    >
                      {repo.selectedForResume ? (
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-zinc-500" />
                      )}
                      <span>Resume Project</span>
                    </button>

                    {/* Portfolio Toggle Checkbox */}
                    <button
                      onClick={() => togglePortfolioSelection(repo.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        repo.selectedForPortfolio
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                          : 'bg-zinc-800/40 text-zinc-400 border border-zinc-700/30 hover:bg-zinc-800'
                      }`}
                    >
                      {repo.selectedForPortfolio ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      )}
                      <span>Portfolio Project</span>
                    </button>

                    {/* AI Generate STAR Bullets Button */}
                    <button
                      onClick={() => handleGenerateBullets(repo)}
                      disabled={isGenerating}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_12px_rgba(79,70,229,0.25)] transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{isGenerating ? 'Analyzing code...' : 'AI STAR Bullets'}</span>
                    </button>
                  </div>
                </div>

                {/* Bullets Section */}
                <div className="mt-4 pt-3 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>ATS Resume Bullets ({repo.customBullets?.length || 0})</span>
                    </span>
                    <button
                      onClick={() => handleAddCustomBullet(repo.id)}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  {hasBullets ? (
                    <div className="space-y-2">
                      {repo.customBullets!.map((bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2 group">
                          <span className="text-indigo-400 font-bold text-xs mt-1.5">•</span>
                          <textarea
                            value={bullet}
                            onChange={(e) => handleUpdateBulletText(repo.id, idx, e.target.value)}
                            rows={2}
                            className="flex-1 p-2 text-xs bg-zinc-800/40 border border-zinc-700/40 rounded-xl text-zinc-200 focus:border-indigo-500 focus:bg-zinc-800/80 outline-none leading-relaxed resize-none transition"
                          />
                          <button
                            onClick={() => handleDeleteBullet(repo.id, idx)}
                            className="text-zinc-500 hover:text-rose-400 p-1.5 transition opacity-0 group-hover:opacity-100"
                            title="Remove bullet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">
                      No bullets generated yet. Click "AI STAR Bullets" to generate recruiter-ready bullets from your codebase.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Project Modal */}
      {newCustomProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0a0a0c] border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Add Custom / Enterprise Project</span>
              </h3>
              <button
                onClick={() => setNewCustomProjectModal(false)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed In-Memory Cache"
                  value={customProjName}
                  onChange={(e) => setCustomProjName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-xl text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Primary Tech Stack</label>
                <input
                  type="text"
                  placeholder="e.g. Go, Redis, Docker, gRPC"
                  value={customProjLang}
                  onChange={(e) => setCustomProjLang(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-xl text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Repository or Demo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourname/project"
                  value={customProjUrl}
                  onChange={(e) => setCustomProjUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-xl text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  placeholder="High-throughput key-value storage engine with raft consensus."
                  value={customProjDesc}
                  onChange={(e) => setCustomProjDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/60 rounded-xl text-white outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewCustomProjectModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-[0_0_12px_rgba(79,70,229,0.3)]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
