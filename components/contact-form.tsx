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
        "We could not send your message right now. Please email the organising team directly.",
      );
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
      <input type="hidden" name="_subject" value="Oceania Youth Zonal 2027 contact enquiry" />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Full name
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            className="rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 md:rounded-[1.2rem]"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Email address
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 md:rounded-[1.2rem]"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Federation or organisation
          <input
            type="text"
            name="organization"
            autoComplete="organization"
            className="rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 md:rounded-[1.2rem]"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Subject
          <input
            required
            type="text"
            name="subject"
            className="rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 md:rounded-[1.2rem]"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Message
        <textarea
          required
          name="message"
          rows={7}
          className="rounded-[0.9rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 md:rounded-[1.2rem]"
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-4 md:rounded-[1.4rem]">
        <p className="max-w-xl text-sm leading-6 text-slate-600">
          Messages are sent to the organising team by email. If you prefer, you can also contact us
          directly at{" "}
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="font-bold text-sky-700 underline decoration-sky-200 underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitState === "submitting" ? "Sending..." : "Send message"}
        </button>
      </div>

      {statusMessage ? (
        <p
          className={`text-sm leading-6 ${
            submitState === "error" ? "text-rose-700" : "text-emerald-700"
          }`}
        >
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
