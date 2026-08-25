import React, { useState } from 'react';
import { PortfolioConfig, SaaSProject } from '../../../types/saas';
import { 
  FolderGit2, 
  Sparkles, 
  Star, 
  GitFork, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Check, 
  Edit3, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface ProjectsViewProps {
  portfolio: PortfolioConfig;
  onUpdateProjects: (projects: SaaSProject[]) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  portfolio,
  onUpdateProjects,
}) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Toggle Feature Flag
  const handleToggleFeatured = (id: string) => {
    const updated = portfolio.projects.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    onUpdateProjects(updated);
  };

  // Update Project Custom Fields
  const handleUpdateProjectField = (id: string, field: keyof SaaSProject, val: any) => {
    const updated = portfolio.projects.map(p => 
      p.id === id ? { ...p, [field]: val } : p
    );
    onUpdateProjects(updated);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Repository Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Curate, edit descriptions, and highlight standout projects on your public portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400">
            Featured: <strong className="text-white">{portfolio.projects.filter(p => p.featured).length}</strong> of {portfolio.projects.length}
          </span>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-zinc-900/90 to-emerald-950/30 border border-indigo-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">
              Smart Project Recommendation Engine
            </h4>
            <p className="text-xs text-zinc-300 mt-0.5">
              Based on star velocity, commit recency, and architectural depth, we've flagged your 4 strongest repositories for maximum recruiter impact.
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            const allFeatured = portfolio.projects.map(p => ({ ...p, featured: !!p.isAiRecommended }));
            onUpdateProjects(allFeatured);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          Auto-Feature Recommended
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {portfolio.projects.map((proj) => {
          const isEditing = editingProjectId === proj.id;

          return (
            <div 
              key={proj.id}
              className={`bg-[#12131a] border rounded-2xl p-6 transition shadow-xl space-y-4 ${
                proj.featured ? 'border-indigo-500/40 bg-[#141622]' : 'border-white/[0.08]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{proj.displayName || proj.name}</span>
                    {proj.isAiRecommended && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        AI Recommended
                      </span>
                    )}
                    <span className="text-xs font-mono text-zinc-500">({proj.name})</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span className="text-zinc-300 font-semibold">{proj.language}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-current" /> {proj.stars}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" /> {proj.forks}
                    </span>
                    <span>•</span>
                    <span>Updated {proj.updatedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(proj.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      proj.featured 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{proj.featured ? 'Featured' : 'Include'}</span>
                  </button>

                  <button
                    onClick={() => setEditingProjectId(isEditing ? null : proj.id)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition cursor-pointer"
                    title="Edit project details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editable Fields Box */}
              {isEditing ? (
                <div className="p-4 bg-black/40 rounded-xl border border-white/[0.06] space-y-3 animate-fadeIn text-xs">
                  <div>
                    <label className="block font-semibold text-zinc-400 mb-1">Display Title</label>
                    <input
                      type="text"
                      value={proj.displayName}
                      onChange={(e) => handleUpdateProjectField(proj.id, 'displayName', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-400 mb-1">Custom Recruiter-Focused Description</label>
                    <textarea
                      rows={2}
                      value={proj.customDescription || proj.description}
                      onChange={(e) => handleUpdateProjectField(proj.id, 'customDescription', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-zinc-400 mb-1">Live Demo URL</label>
                      <input
                        type="url"
                        placeholder="https://yourproject.app"
                        value={proj.liveUrl || ''}
                        onChange={(e) => handleUpdateProjectField(proj.id, 'liveUrl', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-zinc-400 mb-1">Tech Stack Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={proj.tags.join(', ')}
                        onChange={(e) => handleUpdateProjectField(
                          proj.id, 
                          'tags', 
                          e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        )}
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {proj.customDescription || proj.description}
                </p>
              )}

              {/* Tags & Links */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.04] text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white flex items-center gap-1">
                    <span>GitHub Code</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                      <span>Demo</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
