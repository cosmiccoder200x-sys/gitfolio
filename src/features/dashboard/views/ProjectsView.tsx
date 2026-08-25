import React, { useState } from 'react';
import { PortfolioConfig, SaaSProject } from '../../../types/saas';
import { 
  FolderGit2, 
  Star, 
  GitFork, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Edit3, 
  Check, 
  Save, 
  Plus 
} from 'lucide-react';

interface ProjectsViewProps {
  portfolio: PortfolioConfig;
  onUpdatePortfolio: (updated: Partial<PortfolioConfig>) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');

  const handleToggleFeatured = (projectId: string) => {
    const updatedProjects = portfolio.projects.map(p => 
      p.id === projectId ? { ...p, featured: !p.featured } : p
    );
    onUpdatePortfolio({ projects: updatedProjects });
  };

  const handleStartEdit = (proj: SaaSProject) => {
    setEditingProjectId(proj.id);
    setCustomTitle(proj.displayName || proj.name);
    setCustomDesc(proj.customDescription || proj.description);
  };

  const handleSaveEdit = (projectId: string) => {
    const updatedProjects = portfolio.projects.map(p => 
      p.id === projectId ? { ...p, displayName: customTitle, customDescription: customDesc } : p
    );
    onUpdatePortfolio({ projects: updatedProjects });
    setEditingProjectId(null);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto animate-fadeIn font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight font-display">
            Project Curation & Showcase
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage featured GitHub repositories, customize titles, and set project visibility.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded bg-[#18181b] border border-[#27272a] font-mono text-zinc-400">
            {portfolio.projects.filter(p => p.featured).length} / {portfolio.projects.length} Featured
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {portfolio.projects.map((proj) => {
          const isEditing = editingProjectId === proj.id;

          return (
            <div 
              key={proj.id}
              className={`bg-[#121215] border rounded-xl p-5 space-y-4 transition ${
                proj.featured ? 'border-[#27272a]' : 'border-[#27272a] opacity-70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Repo Meta */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <FolderGit2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <h3 className="font-bold text-zinc-100 text-sm font-display">
                      {proj.displayName || proj.name}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400 bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a]">
                      {proj.language}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400">
                    {proj.customDescription || proj.description}
                  </p>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  
                  {/* Star Counter */}
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1 bg-[#18181b] px-2.5 py-1 rounded border border-[#27272a]">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    {proj.stars}
                  </span>

                  {/* Feature Toggle */}
                  <button
                    onClick={() => handleToggleFeatured(proj.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer ${
                      proj.featured
                        ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                        : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    {proj.featured ? 'Featured' : 'Hidden'}
                  </button>

                  {/* Edit Toggle */}
                  <button
                    onClick={() => isEditing ? handleSaveEdit(proj.id) : handleStartEdit(proj)}
                    className="p-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 border border-[#27272a] rounded text-xs transition cursor-pointer"
                    title="Edit project copy"
                  >
                    {isEditing ? <Save className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5 text-zinc-400" />}
                  </button>
                </div>
              </div>

              {/* Inline Edit Form */}
              {isEditing && (
                <div className="p-4 bg-[#18181b] rounded-lg border border-[#27272a] space-y-3 text-xs animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Display Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#121215] border border-zinc-700 rounded text-zinc-100 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-400 font-medium">Highlight Description</label>
                    <textarea
                      rows={2}
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#121215] border border-zinc-700 rounded text-zinc-100 text-xs outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setEditingProjectId(null)}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(proj.id)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
