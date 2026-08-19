"use client";

import Link from "next/link";
import { useState } from "react";
import { Hero } from "@/components/ui";

export function RegistrationPage() {
  const [includeBlitz, setIncludeBlitz] = useState(true);
  const [isInternational, setIsInternational] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [divisionSelect, setDivisionSelect] = useState("U14 Open");

  const baseFee = 160;
  const blitzFee = includeBlitz ? 35 : 0;
  const federationLevy = isInternational ? 25 : 0;
  const totalEstimate = baseFee + blitzFee + federationLevy;

  const handleSubmitInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim() && emailInput.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Official Player Entry Portal"
        title="Registration & Fee Estimator"
        description="Pre-register your interest, estimate entry fees, check age group eligibility requirements, and access official entry instructions once entries open."
      />

      <section className="grid gap-8 lg:grid-cols-12">
        {/* Interactive Fee Estimator */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Interactive Tool
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Entry Fee Calculator
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Estimate entry fees based on official published tournament regulations and optional side events.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="space-y-2">
              <label className="font-bold text-white block">Selected Division:</label>
              <select
                value={divisionSelect}
                onChange={(e) => setDivisionSelect(e.target.value)}
                className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-amber-500"
              >
                <option value="U8 Open">Under 8 Open / Girls</option>
                <option value="U10 Open">Under 10 Open / Girls</option>
                <option value="U12 Open">Under 12 Open / Girls</option>
                <option value="U14 Open">Under 14 Open / Girls</option>
                <option value="U16 Open">Under 16 Open / Girls</option>
                <option value="U18 Open">Under 18 Open / Girls</option>
                <option value="U20 Open">Under 20 Premier Championship</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div>
                <span className="font-bold text-white block">Official Classical Tournament Entry</span>
                <span className="text-slate-400 text-[0.75rem]">9 Rounds FIDE Rated Swiss ($160 AUD)</span>
              </div>
              <span className="font-bold text-amber-400">${baseFee} AUD</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div>
                <span className="font-bold text-white block">Oceania Blitz Side Event</span>
                <span className="text-slate-400 text-[0.75rem]">9-round rapid blitz championship ($35 AUD)</span>
              </div>
              <input
                type="checkbox"
                checked={includeBlitz}
                onChange={(e) => setIncludeBlitz(e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div>
                <span className="font-bold text-white block">International Federation Administrative Levy</span>
                <span className="text-slate-400 text-[0.75rem]">Applies to overseas FIDE federations ($25 AUD)</span>
              </div>
              <input
                type="checkbox"
                checked={isInternational}
                onChange={(e) => setIsInternational(e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Estimated Total Entry Fee
                </span>
                <span className="text-[0.75rem] text-slate-300">Subject to final organizer guidelines</span>
              </div>
              <span className="font-display text-3xl font-extrabold text-amber-300">
                ${totalEstimate} AUD
              </span>
            </div>
          </div>
        </div>

        {/* Pre-Registration Interest Sign-Up */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Notification Alert
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Pre-Register Interest
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Get notified immediately when official entries open.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
              <span className="text-3xl">🎉</span>
              <h3 className="font-display text-xl font-bold text-emerald-300">Interest Registered!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you, <strong className="text-white">{nameInput}</strong>. We will send notification alerts and official entry forms to <strong className="text-white">{emailInput}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitInterest} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-white block">Player / Parent Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-full border border-slate-800 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full rounded-full border border-slate-800 bg-slate-900 px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 py-3 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-[1.02]"
              >
                Submit Pre-Registration
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-800/80 text-[0.7rem] text-slate-500 leading-relaxed">
            Note: Pre-registration guarantees priority notice for entry slots. Official tournament entries will open following confirmation from the Australian Chess Federation.
          </div>
        </div>
      </section>
    </div>
  );
}

