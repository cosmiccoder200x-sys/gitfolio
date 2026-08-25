import React, { useState } from 'react';
import { Bot, Sparkles, Send, User, Copy, Check, ArrowRight } from 'lucide-react';
import { ResumeData, GitHubRepo } from '../types';
import { sendAiChat } from '../lib/geminiApi';

interface AIAssistantTabProps {
  resume: ResumeData;
  repos: GitHubRepo[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const DEFAULT_PROMPT_SUGGESTIONS = [
  '🎯 Tailor my summary to target a Staff Backend & Distributed Systems role',
  '⭐ Turn my GitHub projects into 3 behavioral STAR interview stories',
  '💡 What are the top 5 high-impact technical keywords missing from my resume?',
  '📝 Draft a customized, recruiter-facing cover letter highlighting my open-source work',
];

export const AIAssistantTab: React.FC<AIAssistantTabProps> = ({ resume, repos }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello **${resume.personal.fullName || 'there'}**! I am your **GitFolio AI Career & Resume Strategist**.

I've loaded your resume and **${repos.length} synchronized GitHub repositories**. I can help you:
- **Tailor bullet points** with active verbs and quantified performance metrics.
- **Generate technical interview talking points** based on your codebase architecture.
- **Draft cover letters** tailored for specific companies and tech stacks.
- **Audit ATS keywords** for Staff, Senior, and Tech Lead positions.

Ask me anything or click a suggestion below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendAiChat({
        message: text.trim(),
        resumeContext: {
          name: resume.personal.fullName,
          targetRole: resume.targetRole,
          summary: resume.personal.summary,
          experience: resume.experience,
          projects: resume.projects,
          skills: resume.skills,
          topRepos: repos.slice(0, 5).map((r) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            stars: r.stargazers_count,
            bullets: r.customBullets,
          })),
        },
      });

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Sorry, I encountered an issue analyzing your request: ${err.message || 'Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      
      {/* Bento Header */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">
              GitFolio AI Career & Interview Advisor
            </h1>
            <p className="text-xs text-zinc-400">
              Powered by Gemini 3.7 Flash with live context of your GitHub code & ATS resume
            </p>
          </div>
        </div>
      </div>

      {/* Chat Conversation Bento Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl flex flex-col h-[580px] overflow-hidden backdrop-blur-sm">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    isAi
                      ? 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.4)]'
                      : 'bg-zinc-700 text-zinc-200 border border-zinc-600'
                  }`}
                >
                  {isAi ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isAi
                      ? 'bg-zinc-850/80 bg-zinc-900 border border-zinc-800 text-zinc-200 shadow-md'
                      : 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.25)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                  
                  <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-zinc-700/40 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {isAi && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="hover:text-indigo-300 flex items-center gap-1 font-semibold transition"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-zinc-400">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-300">
                Gemini is synthesizing insights from your resume and repositories...
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Prompts */}
        <div className="p-2.5 bg-zinc-900/60 border-t border-zinc-800 overflow-x-auto flex gap-2 no-scrollbar">
          {DEFAULT_PROMPT_SUGGESTIONS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-800 hover:text-indigo-300 border border-zinc-700/50 rounded-xl text-[11px] font-medium text-zinc-300 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI to optimize a bullet, craft interview talking points, or tailor for a company..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-zinc-800/70 border border-zinc-700/50 rounded-xl text-xs outline-none focus:border-indigo-500 text-white placeholder-zinc-500 transition"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition shadow-[0_0_10px_rgba(79,70,229,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>

    </div>
  );
};
