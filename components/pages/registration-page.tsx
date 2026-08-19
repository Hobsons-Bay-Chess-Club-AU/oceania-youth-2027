"use client";

import Link from "next/link";
import { useState } from "react";
import { Hero } from "@/components/ui";

const OFFICIAL_REGISTRATION_URL =
  "https://portal.hobsonsbaychess.com/public/schedule/events/87244oceania-youth-championship-2027";

export function RegistrationPage() {
  const [isOfficialPlayer, setIsOfficialPlayer] = useState(false);
  const [isEarlyBird, setIsEarlyBird] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [divisionSelect, setDivisionSelect] = useState("U14 Open");

  // Official Fee Structure:
  // Registration Fee: $130 AUD (Waived for Official Federation Invited Players)
  // Entry Fee: Early Bird (before Aug 1, 2027) = $130 AUD, General = $170 AUD
  // Rapid & Blitz: $0 AUD (Included in Championship Package!)
  const registrationFee = isOfficialPlayer ? 0 : 130;
  const entryFee = isEarlyBird ? 130 : 170;
  const totalFee = registrationFee + entryFee;

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
        title="Registration & Fee Calculator"
        description="Register for Oceania Youth 2027, calculate official entry fees, explore Pacific Island grants, and enter the First 300 Lucky Draw."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={OFFICIAL_REGISTRATION_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-3 text-xs font-black uppercase text-slate-950 shadow-lg transition hover:scale-105"
          >
            <span>Open Official Registration Portal</span>
            <span>↗</span>
          </a>
          <a
            href="/OceaniaYouth%202027%20Tournament%20Pack.pdf"
            download="OceaniaYouth 2027 Tournament Pack.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            <span>📥 Download Tournament Pack (PDF)</span>
          </a>
        </div>
      </Hero>

      {/* Lucky Draw & Pacific Grant Alert Banner */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              🎁 Lucky Draw Alert
            </span>
            <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[0.65rem] font-bold text-amber-200">
              First 300 Players
            </span>
          </div>
          <h3 className="font-display text-lg font-bold text-white">First 300 Entry Lucky Draw</h3>
          <p className="text-xs leading-relaxed text-slate-300">
            The first 300 players who complete their registration automatically qualify for a special draw featuring:
          </p>
          <ul className="text-xs space-y-1 text-amber-300 font-semibold">
            <li>• 5x DGT Electronic Chess Clocks</li>
            <li>• 1x ChessNut Go Smart Electronic Chess Board</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              ✈️ Federation Support
            </span>
            <span className="rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-[0.65rem] font-bold text-cyan-200">
              $1,000 AUD Grant
            </span>
          </div>
          <h3 className="font-display text-lg font-bold text-white">Pacific Island Assistance Scheme</h3>
          <p className="text-xs leading-relaxed text-slate-300">
            First 3 Pacific Island federations (outside Australia & New Zealand) registering 5+ players by <strong className="text-white">1 March 2027</strong> receive a <strong className="text-cyan-300">$1,000 AUD travel grant</strong>.
          </p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        {/* Interactive Official Fee Calculator */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Official Tournament Fees
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Fee Structure Calculator
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              One registration fee grants access to Classical, Rapid, and Blitz championships (3-in-1 Package).
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="space-y-2">
              <label className="font-bold text-white block">Age Championship Category:</label>
              <select
                value={divisionSelect}
                onChange={(e) => setDivisionSelect(e.target.value)}
                className="w-full rounded-full border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none focus:border-amber-500"
              >
                <option value="U8 Open">Under 8 Open & Girls</option>
                <option value="U10 Open">Under 10 Open & Girls</option>
                <option value="U12 Open">Under 12 Open & Girls</option>
                <option value="U14 Open">Under 14 Open & Girls</option>
                <option value="U16 Open">Under 16 Open & Girls</option>
                <option value="U18 Open">Under 18 Open & Girls</option>
                <option value="U20 Open">Under 20 Premier Championship</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div>
                <span className="font-bold text-white block">Federation Status</span>
                <span className="text-slate-400 text-[0.75rem]">Official Nominated Federation Player (Waives $130 reg fee)</span>
              </div>
              <input
                type="checkbox"
                checked={isOfficialPlayer}
                onChange={(e) => setIsOfficialPlayer(e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <div>
                <span className="font-bold text-white block">Early Bird Rate</span>
                <span className="text-slate-400 text-[0.75rem]">Register before 1 August 2027 (Save $40 AUD)</span>
              </div>
              <input
                type="checkbox"
                checked={isEarlyBird}
                onChange={(e) => setIsEarlyBird(e.target.checked)}
                className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-amber-500"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Championship Registration Fee:</span>
                <span className="font-bold text-white">${registrationFee} AUD</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Championship Entry Fee ({isEarlyBird ? "Early Bird" : "Standard"}):</span>
                <span className="font-bold text-white">${entryFee} AUD</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Rapid & Blitz Side Championships:</span>
                <span className="font-bold">INCLUDED ($0 AUD)</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Total Official Payable Fee
                </span>
                <span className="text-[0.75rem] text-slate-300">Includes Classical, Rapid & Blitz entries</span>
              </div>
              <span className="font-display text-3xl font-extrabold text-amber-300">
                ${totalFee} AUD
              </span>
            </div>
          </div>
        </div>

        {/* Pre-Registration Notification Form */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Notification & Updates
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Pre-Register Interest
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Receive entry reminders, visa assistance documents, and tournament updates.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
              <span className="text-3xl">🎉</span>
              <h3 className="font-display text-xl font-bold text-emerald-300">Interest Registered!</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you, <strong className="text-white">{nameInput}</strong>. Updates will be sent to <strong className="text-white">{emailInput}</strong>.
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

          <div className="pt-2 border-t border-slate-800/80 text-[0.7rem] text-slate-500 leading-relaxed space-y-2">
            <p>
              Official registration opens 1 September 2026. Early Bird discount applies to payments received on or before 1 August 2027.
            </p>
            <a
              href={OFFICIAL_REGISTRATION_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-amber-400 font-bold hover:underline"
            >
              Go to Hobsons Bay Portal Registration →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


