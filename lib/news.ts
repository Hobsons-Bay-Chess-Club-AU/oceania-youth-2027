export type FrontMatter = {
  title: string;
  date: string;
  author: string;
  summary: string;
};

export type NewsPost = FrontMatter & {
  slug: string;
  body: string;
  html: string;
};

export type NewsPostSummary = FrontMatter & {
  slug: string;
};

const staticNewsPosts: NewsPost[] = [
  {
    slug: "2026-07-03-planning-update",
    title: "Venue planning and operational updates underway",
    date: "2026-07-03",
    author: "Organising Committee",
    summary: "Work is continuing on venue logistics, visitor guidance, and the practical information families will need ahead of the event.",
    body: `## Venue and travel planning

The organising team is continuing to develop the venue information area so players and families can quickly find travel details, map access, food options, and nearby accommodation.

## Information priorities

- clearer arrival guidance for tournament days
- accommodation options close to the venue
- food and convenience options for long playing sessions
- travel notes that are easy to follow on mobile

## Next published updates

As planning milestones are confirmed, future notices will focus on registration timing, schedule updates, and final visitor information.`,
    html: `<h2>Venue and travel planning</h2><p>The organising team is continuing to develop the venue information area so players and families can quickly find travel details, map access, food options, and nearby accommodation.</p><h2>Information priorities</h2><ul><li>clearer arrival guidance for tournament days</li><li>accommodation options close to the venue</li><li>food and convenience options for long playing sessions</li><li>travel notes that are easy to follow on mobile</li></ul><h2>Next published updates</h2><p>As planning milestones are confirmed, future notices will focus on registration timing, schedule updates, and final visitor information.</p>`,
  },
  {
    slug: "2026-07-02-welcome-update",
    title: "Tournament website and information hub now live",
    date: "2026-07-02",
    author: "Organising Committee",
    summary: "The official website is now online with key sections for schedules, regulations, venue planning, player information, and event updates.",
    body: `## Website launch

The Oceania Youth Zonal 2027 event website is now live and will be the main place for official announcements and tournament planning information.

Visitors can already browse:

- tournament schedule information
- regulations and event structure
- venue and travel planning details
- player and broadcast sections
- official news and updates

## What to expect next

Over the coming updates, this page will publish confirmed dates, entry reminders, federation notices, accommodation guidance, and operational announcements as they are approved.

## For players and families

Please check this page regularly before booking travel or making tournament-day plans, as it will be used for the latest event information.`,
    html: `<h2>Website launch</h2><p>The Oceania Youth Zonal 2027 event website is now live and will be the main place for official announcements and tournament planning information.</p><p>Visitors can already browse:</p><ul><li>tournament schedule information</li><li>regulations and event structure</li><li>venue and travel planning details</li><li>player and broadcast sections</li><li>official news and updates</li></ul><h2>What to expect next</h2><p>Over the coming updates, this page will publish confirmed dates, entry reminders, federation notices, accommodation guidance, and operational announcements as they are approved.</p><h2>For players and families</h2><p>Please check this page regularly before booking travel or making tournament-day plans, as it will be used for the latest event information.</p>`,
  },
];

export function getAllNewsPosts(): NewsPost[] {
  return staticNewsPosts;
}

export function getAllNewsPostSummaries(): NewsPostSummary[] {
  return staticNewsPosts.map(({ slug, title, date, author, summary }) => ({
    slug,
    title,
    date,
    author,
    summary,
  }));
}

export function getNewsPostBySlug(slug: string): NewsPost | null {
  return staticNewsPosts.find((post) => post.slug === slug) ?? null;
}

