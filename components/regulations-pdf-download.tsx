"use client";

import { buildRegulationsPdf } from "@/lib/regulations-pdf";

export function RegulationsPdfDownload({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  const handleDownload = () => {
    const pdfBytes = buildRegulationsPdf();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "oceania-youth-2027-regulations.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={handleDownload} className={className}>
      {label}
    </button>
  );
}
