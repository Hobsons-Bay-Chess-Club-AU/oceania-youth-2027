import { Suspense } from "react";
import { PlayersPage } from "@/components/pages/players-page";

export default function Page() {
  return <Suspense fallback={<p role="status">Loading player directory…</p>}><PlayersPage /></Suspense>;
}
