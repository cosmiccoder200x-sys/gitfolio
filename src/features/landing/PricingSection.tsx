import React, { useState } from 'react';
import { PRICING_TIERS } from '../../data/mockSaasData';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onSelectTier: (tierId: 'free' | 'pro' | 'developer') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectTier }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 bg-[#0c0d12]/70 border-y border-white/[0.08] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-bold">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple, Developer-Friendly Plans
          </h2>
          <p className="text-sm text-zinc-400">
            Start for free forever, upgrade when you need custom domains, rich analytics, or premium templates.
          </p>

          {/* Billing Switch */}
          <div className="inline-flex items-center gap-3 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold pt-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer ${
                !isAnnual ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-3.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                isAnnual ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono">
                Save 25%
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
                className={`bg-[#12131a] rounded-2xl p-8 flex flex-col justify-between relative shadow-2xl transition duration-300 ${
                  tier.popular 
                    ? 'border-2 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.25)]' 
                    : 'border border-white/[0.08] hover:border-zinc-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold font-mono uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-200" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{tier.description}</p>
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
                    className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                      tier.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    <span>{tier.cta}</span>
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
