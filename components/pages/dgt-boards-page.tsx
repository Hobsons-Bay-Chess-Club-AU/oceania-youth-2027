import { siteConfig } from "@/lib/site-config";
import { Hero, Section } from "@/components/ui";
import { dgtGroups } from "@/app/dgt-boards/data";

export function DgtBoardsPage() {
  return (
    <>
      <Hero
        eyebrow="Live boards"
        title="DGT Boards"
        description="The original DGT board listing has been rebuilt as a responsive card grid with the same external viewing links."
      />
      <Section title="Board groups">
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {dgtGroups.map((group) => (
            <div className="grid gap-4" key={group.title}>
              <h3 className="text-2xl text-[var(--ink)] [font-family:var(--font-display)]">{group.title}</h3>
              <div className="grid gap-3">
                {group.boards.map((board) => (
                  <div className="rounded-[1.35rem] border border-[rgba(24,34,53,0.12)] bg-[#fffaf1] p-4 font-bold" key={board}>
                    {board}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a className="inline-flex min-h-[2.8rem] items-center justify-center rounded-full bg-[var(--navy)] px-4 py-3 font-bold text-white" href={siteConfig.links.liveBoardsGroupA} target="_blank" rel="noreferrer">
            View Games from Boards 1 to 11
          </a>
          <a className="inline-flex min-h-[2.8rem] items-center justify-center rounded-full bg-[var(--navy)] px-4 py-3 font-bold text-white" href={siteConfig.links.liveBoardsGroupB} target="_blank" rel="noreferrer">
            View Games from Boards 12 to 20
          </a>
        </div>
      </Section>
    </>
  );
}
