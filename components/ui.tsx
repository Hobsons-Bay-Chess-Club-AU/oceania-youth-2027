
import { Translated } from "@/components/i18n-provider";
import Link from "next/link";
import React from "react";
export function Hero({ eyebrow, title, description, children }: {
    eyebrow: string;
    title: string;
    description: string;
    children?: React.ReactNode;
}) {
    return <Translated>{<section className="page-title"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p>{children && <div>{children}</div>}</section>}</Translated>;
}
export function Section({ title, subtitle, badge, children, className = "" }: {
    title: string;
    subtitle?: string;
    badge?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return <Translated>{<section className={`content-section ${className}`}><div>{badge && <span className="eyebrow">{badge}</span>}<h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{children}</section>}</Translated>;
}
export function GlassCard({ children, className = "" }: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}) { return <Translated>{<div className={`content-item ${className}`}>{children}</div>}</Translated>; }
export function InfoGrid({ items }: {
    items: Array<{
        title: string;
        body: string;
    }>;
}) { return <Translated>{<div className="subgrid info-grid">{items.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}</div>}</Translated>; }
export function CtaLink({ href, label }: {
    href: string;
    label: string;
    variant?: "primary" | "secondary" | "outline";
}) { return <Translated>{<Link className="action" href={href}>{label}</Link>}</Translated>; }
export function SearchInput({ value, onChange, placeholder = "Search..." }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return <Translated>{<div className="search-field"><svg className="ui-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><input type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}/></div>}</Translated>;
}
