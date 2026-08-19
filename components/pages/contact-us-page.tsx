"use client";

import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site-config";
import { Hero } from "@/components/ui";

const enquiryTopics = [
  { topic: "Player eligibility and federation matters", icon: "🌐" },
  { topic: "Travel, accommodation, and venue planning", icon: "✈️" },
  { topic: "Registration timing and entry fee questions", icon: "📝" },
  { topic: "Volunteer, sponsor, and partner inquiries", icon: "🤝" },
];

export function ContactUsPage() {
  return (
    <div className="space-y-8">
      <Hero
        eyebrow="Direct Inquiry Hub"
        title="Contact Organising Committee"
        description="Have questions about Oceania Youth Zonal 2027? Get in touch with our tournament operations team directly."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-105"
          >
            <span>Email Organisers</span>
            <span>✉️</span>
          </a>
        </div>
      </Hero>

      <section className="grid gap-8 lg:grid-cols-12">
        {/* Enquiry Form */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Send Message
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              Inquiry Form
            </h2>
          </div>
          <ContactForm />
        </div>

        {/* Contact Details & Topics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl backdrop-blur-xl md:p-8 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Direct Details
              </span>
              <h2 className="mt-1 font-display text-xl font-bold text-white">
                Committee Info
              </h2>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-500 block text-[0.65rem] uppercase font-bold">Committee Name</span>
                <span className="font-bold text-white">{siteConfig.contact.coordinatorName}</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-500 block text-[0.65rem] uppercase font-bold">Official Email</span>
                <a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-amber-300 hover:underline">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-500 block text-[0.65rem] uppercase font-bold">Response Window</span>
                <span>{siteConfig.contact.responseWindow}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Common Topics
            </span>
            <div className="space-y-2">
              {enquiryTopics.map((item) => (
                <div
                  key={item.topic}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-300"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

