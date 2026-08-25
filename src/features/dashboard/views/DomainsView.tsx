import React, { useState } from 'react';
import { PortfolioConfig } from '../../../types/saas';
import { Globe, ShieldCheck, CheckCircle2, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface DomainsViewProps {
  portfolio: PortfolioConfig;
  onUpdateDomain: (domain: string) => void;
}

export const DomainsView: React.FC<DomainsViewProps> = ({
  portfolio,
  onUpdateDomain,
}) => {
  const [inputDomain, setInputDomain] = useState(portfolio.customDomain || 'sreerang.dev');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(portfolio.isDomainVerified ?? true);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      onUpdateDomain(inputDomain);
    }, 1200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Custom Domains & SSL
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Connect your apex domain or subdomain with zero-config edge routing and automated SSL.
        </p>
      </div>

      {/* Primary Domain Status Box */}
      <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span>Production Custom Domain</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Your portfolio will be directly accessible at this address.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Validated & Active</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold border border-amber-500/20 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Pending DNS Configuration</span>
              </span>
            )}
          </div>
        </div>

        {/* Input & Verify Form */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            placeholder="yourdomain.com (e.g. sreerang.dev)"
            value={inputDomain}
            onChange={(e) => {
              setInputDomain(e.target.value);
              setIsVerified(false);
            }}
            className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-xs font-mono outline-none shadow-inner"
          />

          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputDomain.trim()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.35)] transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Querying DNS...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify DNS Records</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* DNS Configuration Instructions */}
      <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Required DNS Records
          </h3>
          <p className="text-xs text-zinc-400">
            Add the following DNS records with your registrar (Cloudflare, Namecheap, GoDaddy, Google Domains, etc.):
          </p>
        </div>

        <div className="space-y-3">
          {/* CNAME Record */}
          <div className="p-4 bg-[#181a24] rounded-xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Record Type: CNAME</span>
              <div className="text-zinc-200">
                Host: <strong className="text-white">@</strong> (or <strong className="text-white">www</strong>)
              </div>
              <div className="text-zinc-400">
                Target / Value: <strong className="text-indigo-400">cname.gitfolio.dev</strong>
              </div>
            </div>

            <button
              onClick={() => handleCopy('cname.gitfolio.dev', 'cname')}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              {copiedRecord === 'cname' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedRecord === 'cname' ? 'Copied' : 'Copy Target'}</span>
            </button>
          </div>

          {/* TXT Record */}
          <div className="p-4 bg-[#181a24] rounded-xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Record Type: TXT (Ownership Verification)</span>
              <div className="text-zinc-200">
                Host: <strong className="text-white">_gitfolio-challenge</strong>
              </div>
              <div className="text-zinc-400 truncate max-w-md">
                Value: <strong className="text-cyan-400">gitfolio-site-verification=usr_{portfolio.slug}_7x9a</strong>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`gitfolio-site-verification=usr_${portfolio.slug}_7x9a`, 'txt')}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-700 transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              {copiedRecord === 'txt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedRecord === 'txt' ? 'Copied' : 'Copy Value'}</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-zinc-500 font-mono">
          ✓ Automatic SSL certificates are issued via Let's Encrypt / Cloudflare within 60 seconds of DNS validation.
        </div>
      </div>

    </div>
  );
};
