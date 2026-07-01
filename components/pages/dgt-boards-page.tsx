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
        <div className="board-grid">
          {dgtGroups.map((group) => (
            <div className="board-column" key={group.title}>
              <h3>{group.title}</h3>
              <div className="board-stack">
                {group.boards.map((board) => (
                  <div className="board-card" key={board}>
                    {board}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="cta-row">
          <a href={siteConfig.links.liveBoardsGroupA} target="_blank" rel="noreferrer">
            View Games from Boards 1 to 11
          </a>
          <a href={siteConfig.links.liveBoardsGroupB} target="_blank" rel="noreferrer">
            View Games from Boards 12 to 20
          </a>
        </div>
      </Section>
    </>
  );
}
