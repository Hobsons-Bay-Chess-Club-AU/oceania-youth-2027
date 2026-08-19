import Link from "next/link";
import React from "react";

export function Hero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 p-6 shadow-2xl backdrop-blur-xl md:rounded-3xl md:p-10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          {eyebrow}
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">
          {description}
        </p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function Section({
  title,
  subtitle,
  badge,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md md:rounded-3xl md:p-8 ${className}`}>
      <div className="mb-6">
        {badge && (
          <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            {badge}
          </span>
        )}
        <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-slate-400 md:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md ${
        hover ? "glass-card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function InfoGrid({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <GlassCard key={item.title}>
          <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
        </GlassCard>
      ))}
    </div>
  );
}

export function CtaLink({
  href,
  label,
  variant = "primary",
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "outline";
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5",
    secondary:
      "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 hover:-translate-y-0.5",
    outline:
      "border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:-translate-y-0.5",
  };

  return (
    <Link
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200 ${styles[variant]}`}
      href={href}
    >
      {label}
    </Link>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-slate-700 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
}

