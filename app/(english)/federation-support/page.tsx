import type { Metadata } from "next";
import { FederationSupportPage } from "@/components/pages/federation-support-page";

export const metadata: Metadata = {
    title: "Registration and Federation Support",
    description: "Entry fees, official federation delegations, accommodation, Pacific Island travel assistance, visa support and programme conditions for Oceania Youth 2027.",
    alternates: { canonical: "/federation-support/" },
};

export default function Page() {
    return <FederationSupportPage/>;
}
