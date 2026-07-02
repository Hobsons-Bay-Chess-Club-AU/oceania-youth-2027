import Link from "next/link";

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
    <section className="rounded-[1rem] border border-white/70 bg-[rgba(255,252,246,0.84)] p-[1.35rem] shadow-[0_20px_60px_rgba(23,52,99,0.12)] backdrop-blur-[16px] sm:p-8 md:rounded-[1.5rem] md:p-12">
      <div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--gold)]">
          {eyebrow}
        </p>
        <h1 className="m-0 max-w-[12ch] text-[clamp(2rem,11vw,3rem)] leading-[0.95] text-[var(--ink)] [font-family:var(--font-display)] sm:text-[clamp(2.4rem,5vw,5rem)]">
          {title}
        </h1>
        <p className="mt-4 text-[0.98rem] leading-[1.65] text-[var(--muted)] sm:text-base sm:leading-[1.7]">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1rem] border border-white/70 bg-[rgba(255,252,246,0.84)] p-[1.35rem] shadow-[0_20px_60px_rgba(23,52,99,0.12)] backdrop-blur-[16px] sm:p-8 md:rounded-[1.5rem]">
      <div className="mb-5">
        <h2 className="m-0 text-[clamp(1.5rem,8vw,2.1rem)] text-[var(--ink)] [font-family:var(--font-display)] sm:text-[clamp(1.8rem,3vw,2.6rem)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-[0.98rem] leading-[1.65] text-[var(--muted)] sm:text-base sm:leading-[1.7]">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function InfoGrid({
  items,
}: {
  items: Array<{ title: string; body: string }>;
}) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
      {items.map((item) => (
        <article
          className="rounded-[0.9rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] p-5 md:rounded-[1.35rem]"
          key={item.title}
        >
          <h3 className="text-xl text-[var(--ink)] [font-family:var(--font-display)]">{item.title}</h3>
          <p className="mt-2 leading-[1.7] text-[var(--muted)]">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

export function CtaLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="inline-flex min-h-[2.8rem] items-center justify-center rounded-full bg-[var(--navy)] px-4 py-3 font-bold text-white"
      href={href}
    >
      {label}
    </Link>
  );
}
