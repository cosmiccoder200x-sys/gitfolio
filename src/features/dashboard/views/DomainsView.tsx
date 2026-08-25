import React, { useState } from 'react';
import { PortfolioConfig } from '../../../types/saas';
import { Globe, ShieldCheck, Check, Copy, AlertCircle, RefreshCw } from 'lucide-react';

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
    }, 1000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto animate-fadeIn font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight font-display">
          Custom Domains & SSL
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Connect your custom domain or subdomain with zero-config edge routing and automated SSL certificates.
        </p>
      </div>

      {/* Domain Status Box */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-100 font-display flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Production Domain</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Your portfolio is configured to serve from this domain address.
            </p>
          </div>

          <div>
            {isVerified ? (
              <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SSL Validated</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono font-medium border border-amber-500/20 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Pending DNS Validation</span>
              </span>
            )}
          </div>
        </div>

        {/* Input & Verify Form */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <input
            type="text"
            placeholder="yourdomain.com"
            value={inputDomain}
            onChange={(e) => {
              setInputDomain(e.target.value);
              setIsVerified(false);
            }}
            className="flex-1 px-3.5 py-2 bg-[#18181b] border border-[#27272a] focus:border-zinc-500 rounded-lg text-zinc-100 text-xs font-mono outline-none"
          />

          <button
            onClick={handleVerify}
            disabled={isVerifying || !inputDomain.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify DNS</span>
            )}
          </button>
        </div>
      </div>

      {/* DNS Configuration Instructions */}
      <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-5">
        <div className="space-y-1">
          <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400 tracking-wider">
            Required DNS Records
          </h3>
          <p className="text-xs text-zinc-400">
            Add the following DNS records with your registrar (Cloudflare, Namecheap, GoDaddy, Google Domains, etc.):
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {/* CNAME Record */}
          <div className="p-3.5 bg-[#18181b] rounded-lg border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block">CNAME Record</span>
              <div className="text-zinc-200">Host: <strong className="text-zinc-100">@</strong></div>
              <div className="text-zinc-400">Target: <strong className="text-indigo-400">cname.gitfolio.dev</strong></div>
            </div>

            <button
              onClick={() => handleCopy('cname.gitfolio.dev', 'cname')}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              {copiedRecord === 'cname' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedRecord === 'cname' ? 'Copied' : 'Copy Target'}</span>
            </button>
          </div>

          {/* TXT Record */}
          <div className="p-3.5 bg-[#18181b] rounded-lg border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase font-semibold block">TXT Record (Ownership Verification)</span>
              <div className="text-zinc-200">Host: <strong className="text-zinc-100">_gitfolio-challenge</strong></div>
              <div className="text-zinc-400 truncate max-w-md">
                Value: <strong className="text-cyan-400">gitfolio-site-verification=usr_{portfolio.slug}_7x9a</strong>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`gitfolio-site-verification=usr_${portfolio.slug}_7x9a`, 'txt')}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              {copiedRecord === 'txt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedRecord === 'txt' ? 'Copied' : 'Copy Value'}</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-zinc-500 font-mono">
          Automatic SSL certificates are issued via Let's Encrypt / Cloudflare Edge upon DNS validation.
        </p>
      </div>

    </div>
  );
};
