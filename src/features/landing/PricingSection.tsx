import React, { useState } from 'react';
import { PRICING_TIERS } from '../../data/mockSaasData';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onSelectTier: (tierId: 'free' | 'pro' | 'developer') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-28 bg-[#0b0b0b] border-y border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* APEX Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="eyebrow-label">
            <span>MEMBERSHIP TIERS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl headline-editorial text-white tracking-tight">
            Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm text-[#9A9A9A]">
            Start free forever. Upgrade when you need custom domain edge routing or high-volume analytics.
          </p>

          {/* APEX Billing Switch */}
          <div className="inline-flex items-center gap-3 bg-[#12131a] p-1.5 rounded-xl border border-white/[0.08] text-xs font-mono">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                !isAnnual ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                isAnnual ? 'bg-indigo-600 text-white font-bold shadow-glow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>ANNUAL</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono">
                SAVE 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_TIERS.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div 
                key={tier.id}
                className={`glass-panel rounded-2xl p-8 flex flex-col justify-between relative shadow-lux transition duration-300 ${
                  tier.popular 
                    ? 'border-2 border-indigo-500 shadow-glow' 
                    : 'hover:border-zinc-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold font-mono uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-200" />
                      MOST CHOSEN
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display tracking-tight">{tier.name}</h3>
                    <p className="text-xs text-[#9A9A9A] mt-1 min-h-[32px]">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-4xl sm:text-5xl font-black text-white">${price}</span>
                    <span className="text-xs text-zinc-400 font-sans font-medium">/ month</span>
                  </div>

                  <ul className="space-y-3 pt-2">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6 border-t border-white/[0.06]">
                  <button
                    onClick={() => onSelectTier(tier.id)}
                    className={`w-full py-3 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center gap-2 cursor-pointer ${
                      tier.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow-sm'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    <span>{tier.cta.toUpperCase()}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
