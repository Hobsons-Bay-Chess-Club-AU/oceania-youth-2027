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
    slug: "2026-08-19-the-road-to-oceania-2027-begins",
    title: "The Road to Oceania 2027 Begins: Official Championship Announcement",
    date: "2026-08-19",
    author: "Organising Committee",
    summary: "Hobsons Bay Chess Club is proud to announce the Oceania Youth Chess Championship 2027 at Bacchus Marsh Grammar – Woodlea Campus, featuring 3 championships, Pacific Islander Assistance Grants, and early bird registration details.",
    body: `## The Road to Oceania 2027 Begins!

Hobsons Bay Chess Club is proud to host the Oceania Youth Chess Championship 2027, bringing together young chess players from across Oceania for one of the region’s premier junior chess events.

- 📅 Dates: 29 September – 3 October 2027 (Arrivals 28 Sept / Departures 4 Oct)
- 📍 Venue: Bacchus Marsh Grammar – Woodlea Campus, Victoria, Australia

We are preparing to welcome 300–400 players from across the Oceania region for five exciting days of international junior chess.

## 🏆 Three Championships

Players will have the opportunity to compete in:

- ♟️ Oceania Youth Classical Championship
- ⚡ Oceania Youth Rapid Championship
- 🔥 Oceania Youth Blitz Championship

Competitions will be held across multiple age groups for Open and Girls, giving young players the opportunity to represent their federations and compete for Oceania honours.

## 📅 The Road to Oceania 2027 Timeline

## 🔓 1 September 2026 — Registration Opens
Registration for Oceania Youth 2027 officially opens!

## 🌴 1 March 2027 — Pacific Islander Federation Participation Assistance Scheme
To encourage participation from across our region, the first three eligible Pacific Islander federations to register by 1 March 2027 will be eligible for AUD $1,000 assistance towards flight costs.
- Open to eligible Oceania federations excluding Australia and New Zealand
- Minimum 5 players per federation required
- Limited to the first three eligible federations

## 🌏 1 April 2027 — Overseas Federation Deadline
Latest entry date for overseas federations, allowing time for players and delegations requiring Australian visas to complete their visa applications.

## 🎁 1 May 2027 — First 300 Players Lucky Draw
Another reason to register early! More information about our special lucky draw will be announced.

## 🐦 1 August 2027 — Early Bird Entry Closes

## ⏰ 27 September 2027 — Final Entry Closes

## ✈️ 28 September 2027 — Arrival in Melbourne

## ♟️ 29 September 2027 — Tournament Begins

## 🏁 3 October 2027 — Championship Concludes

## ✈️ 4 October 2027 — Departure

## 🌊 Bringing Oceania Together Through Chess

Oceania Youth 2027 is about more than finding champions. Our goal is to bring together young players, parents, coaches and federations from throughout the region, create new friendships and provide young chess players with the experience of competing on an international stage.

Over the coming months, we will be revealing much more about:

- 📋 Registration and tournament information
- 🏨 Accommodation
- 🌴 Pacific Island federation support
- 🎓 Oceania Island Federations Coaching Programme
- 🏆 Prizes and awards
- 🤝 Sponsors and partners
- 🎥 Live coverage and media
- ♟️ Officials and special guests
- 🎉 Activities surrounding the championship

This is our first announcement — and there is much more to come.

Registration opens 1 September 2026. Save the dates, share the news with your chess community and join us on the Road to Oceania 2027!

13 Federations. One Region. One Championship.

![Oceania Youth Chess Championship 2027 Banner](/banner.png)`,
    html: `<h2>The Road to Oceania 2027 Begins!</h2><p>Hobsons Bay Chess Club is proud to host the <strong>Oceania Youth Chess Championship 2027</strong>, bringing together young chess players from across Oceania for one of the region’s premier junior chess events.</p><ul><li>📅 <strong>Dates</strong>: 29 September – 3 October 2027 (Arrivals 28 Sept / Departures 4 Oct)</li><li>📍 <strong>Venue</strong>: Bacchus Marsh Grammar – Woodlea Campus, Victoria, Australia</li></ul><p>We are preparing to welcome <strong>300–400 players</strong> from across the Oceania region for five exciting days of international junior chess.</p><h2>🏆 Three Championships</h2><p>Players will have the opportunity to compete in:</p><ul><li>♟️ <strong>Oceania Youth Classical Championship</strong></li><li>⚡ <strong>Oceania Youth Rapid Championship</strong></li><li>🔥 <strong>Oceania Youth Blitz Championship</strong></li></ul><p>Competitions will be held across multiple age groups for Open and Girls, giving young players the opportunity to represent their federations and compete for Oceania honours.</p><h2>📅 The Road to Oceania 2027 Timeline</h2><h2>🔓 1 September 2026 — Registration Opens</h2><p>Registration for Oceania Youth 2027 officially opens!</p><h2>🌴 1 March 2027 — Pacific Islander Federation Participation Assistance Scheme</h2><p>To encourage participation from across our region, the first three eligible Pacific Islander federations to register by 1 March 2027 will be eligible for <strong>AUD $1,000 assistance towards flight costs</strong>.</p><ul><li>Open to eligible Oceania federations excluding Australia and New Zealand</li><li>Minimum 5 players per federation required</li><li>Limited to the first three eligible federations</li></ul><h2>🌏 1 April 2027 — Overseas Federation Deadline</h2><p>Latest entry date for overseas federations, allowing time for players and delegations requiring Australian visas to complete their visa applications.</p><h2>🎁 1 May 2027 — First 300 Players Lucky Draw</h2><p>Another reason to register early! More information about our special lucky draw will be announced.</p><h2>🐦 1 August 2027 — Early Bird Entry Closes</h2><h2>⏰ 27 September 2027 — Final Entry Closes</h2><h2>✈️ 28 September 2027 — Arrival in Melbourne</h2><h2>♟️ 29 September 2027 — Tournament Begins</h2><h2>🏁 3 October 2027 — Championship Concludes</h2><h2>✈️ 4 October 2027 — Departure</h2><h2>🌊 Bringing Oceania Together Through Chess</h2><p>Oceania Youth 2027 is about more than finding champions. Our goal is to bring together young players, parents, coaches and federations from throughout the region, create new friendships and provide young chess players with the experience of competing on an international stage.</p><ul><li>📋 Registration and tournament information</li><li>🏨 Accommodation</li><li>🌴 Pacific Island federation support</li><li>🎓 Oceania Island Federations Coaching Programme</li><li>🏆 Prizes and awards</li><li>🤝 Sponsors and partners</li><li>🎥 Live coverage and media</li><li>♟️ Officials and special guests</li><li>🎉 Activities surrounding the championship</li></ul><p>This is our first announcement — and there is much more to come.</p><p>Registration opens 1 September 2026. Save the dates, share the news with your chess community and join us on the Road to Oceania 2027!</p><p><strong>13 Federations. One Region. One Championship.</strong></p><div class="mt-8 overflow-hidden rounded-2xl border border-slate-800 shadow-2xl"><img src="/banner.png" alt="Oceania Youth Chess Championship 2027 Official Banner" class="w-full h-auto object-cover" /></div>`,
  },
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
    title: "Official Launch: Oceania Youth 2027 Digital Portal",
    date: "2026-07-02",
    author: "Organising Committee",
    summary: "Announcing the official launch of the Oceania Youth Chess Championship 2027 digital portal — designed as the single source of truth for players, families, and Zone 3.6 federations.",
    body: `## Objective of the Website

Hobsons Bay Chess Club Inc. (Est. 1974) and the Oceania Chess Confederation (OCC) are proud to launch the official web platform for the Oceania Youth Chess Championship 2027 (FIDE Zone 3.6).

This digital portal serves as the single source of truth for all participating junior players, families, coaches, arbiters, and national federations across Oceania.

## How to Navigate & Use the Portal

The platform is structured into clear navigation hubs to help users quickly access essential information:

## Schedule & Calendar
Inspect the 7-day tournament timetable for Classical (Rounds 1–9), Rapid, and Blitz events, with direct export buttons for Google Calendar.

## Regulations & Direct Titles
Review official FIDE Zone 3.6 regulations, tiebreak criteria, age cutoffs, and direct title/norm pathways (GM, WGM, IM, WIM, FM, WFM, CM, WCM).

## Registration & Fee Calculator
Estimate official entry fees ($260 Early Bird / $300 General / $130 Official Player), explore the Pacific Island assistance scheme ($1,000 AUD grants), and jump directly to the Hobsons Bay entry portal.

## Venue & Travel Guide
Access venue directions for Bacchus Marsh Grammar – Woodlea Campus, Rockbank V/Line train transit details, and nearby accommodation (Quest & Mercure Caroline Springs).

## Live Games & DGT Boards
Access live electronic board broadcasts and pairing sheets when tournament play commences.

## Staying Updated

Visitors and delegation officials are encouraged to bookmark this website and check the News & Bulletins section regularly for circulars, pairing notifications, and operational announcements leading up to September 2027.`,
    html: `<h2>Objective of the Website</h2><p>Hobsons Bay Chess Club Inc. (Est. 1974) and the Oceania Chess Confederation (OCC) are proud to launch the official web platform for the <strong>Oceania Youth Chess Championship 2027</strong> (FIDE Zone 3.6).</p><p>This digital portal serves as the single source of truth for all participating junior players, families, coaches, arbiters, and national federations across Oceania.</p><h2>How to Navigate & Use the Portal</h2><p>The platform is structured into clear navigation hubs to help users quickly access essential information:</p><h2>Schedule & Calendar</h2><p>Inspect the 7-day tournament timetable for Classical (Rounds 1–9), Rapid, and Blitz events, with direct export buttons for Google Calendar.</p><h2>Regulations & Direct Titles</h2><p>Review official FIDE Zone 3.6 regulations, tiebreak criteria, age cutoffs, and direct title/norm pathways (GM, WGM, IM, WIM, FM, WFM, CM, WCM).</p><h2>Registration & Fee Calculator</h2><p>Estimate official entry fees ($260 Early Bird / $300 General / $130 Official Player), explore the Pacific Island assistance scheme ($1,000 AUD grants), and jump directly to the Hobsons Bay entry portal.</p><h2>Venue & Travel Guide</h2><p>Access venue directions for Bacchus Marsh Grammar – Woodlea Campus, Rockbank V/Line train transit details, and nearby accommodation (Quest & Mercure Caroline Springs).</p><h2>Live Games & DGT Boards</h2><p>Access live electronic board broadcasts and pairing sheets when tournament play commences.</p><h2>Staying Updated</h2><p>Visitors and delegation officials are encouraged to bookmark this website and check the <strong>News & Bulletins</strong> section regularly for circulars, pairing notifications, and operational announcements leading up to September 2027.</p>`,
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

