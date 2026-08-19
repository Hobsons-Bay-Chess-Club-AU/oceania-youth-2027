"use client";

import { FormEvent, useState } from "react";
import { siteConfig } from "@/lib/site-config";

type SubmitState = "idle" | "submitting" | "success" | "error";

function buildMailtoHref(form: HTMLFormElement) {
  const data = new FormData(form);
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const organization = String(data.get("organization") ?? "").trim();
  const subject = String(data.get("subject") ?? "").trim() || "Contact enquiry";
  const message = String(data.get("message") ?? "").trim();

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    organization ? `Organisation: ${organization}` : "",
    "",
    message,
  ].filter(Boolean);

  return `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    if (String(formData.get("company") ?? "").trim()) {
      return;
    }

    if (!siteConfig.contact.formEndpoint) {
      window.location.href = buildMailtoHref(form);
      setSubmitState("success");
      setStatusMessage("Your message draft has been opened in your email app.");
      return;
    }

    try {
      setSubmitState("submitting");
      setStatusMessage("");

      const response = await fetch(siteConfig.contact.formEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to send message");
      }

      form.reset();
      setSubmitState("success");
      setStatusMessage("Thanks for reaching out. Your message has been sent successfully.");
    } catch {
      setSubmitState("error");
      setStatusMessage(
        "We could not send your message right now. Please email the organising team directly."
      );
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="_subject" value="Oceania Youth Zonal 2027 contact enquiry" />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          Full Name
          <input
            required
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </label>

        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          Email Address
          <input
            required
            type="email"
            name="email"
            placeholder="name@domain.com"
            autoComplete="email"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          Federation or Club
          <input
            type="text"
            name="organization"
            placeholder="e.g. Chess Victoria / NZCF"
            autoComplete="organization"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </label>

        <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
          Subject
          <input
            required
            type="text"
            name="subject"
            placeholder="Enquiry topic"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </label>
      </div>

      <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
        Message
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Please describe your question..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
        <p className="max-w-xl text-xs text-slate-400">
          Direct email:{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-bold text-amber-300 hover:underline"
          >
            {siteConfig.contact.email}
          </a>
        </p>
        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-6 py-2.5 text-xs font-black uppercase text-slate-950 shadow-md transition hover:scale-105 disabled:opacity-60"
        >
          {submitState === "submitting" ? "Sending..." : "Submit Inquiry"}
        </button>
      </div>

      {statusMessage && (
        <p
          className={`text-xs font-semibold p-3 rounded-xl ${
            submitState === "error"
              ? "bg-rose-500/10 border border-rose-500/20 text-rose-300"
              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}

