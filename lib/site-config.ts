export const siteConfig = {
  name: "Oceania Youth Chess 2027",
  shortName: "Oceania Youth 2027",
  siteUrl: "https://oceaniayouth2027.hobsonsbaychess.com/",
  titleTemplate: "%s | Oceania Youth Chess 2027",
  defaultTitle: "Oceania Youth Chess 2027",
  description:
    "Placeholder website for a youth chess event in Oceania, built with a modern Next.js stack and ready for future schedules, venue details, players, and live event updates.",
  keywords: [
    "chess tournament",
    "youth chess",
    "Oceania chess",
    "junior chess event",
    "FIDE chess event",
    "school chess championship",
    "chess festival",
  ],
  heroImage: "/og-image.svg",
  ogImage: "/og-image.svg",
  contact: {
    coordinatorName: "Oceania Youth Chess Organising Committee",
    phoneLabel: "Phone details to be published",
    email: "major_tournament@hobsonsbaychess.com",
  },
  organization: {
    name: "Oceania Youth Chess 2027 Organising Committee",
    legalLine: "Official event website for planning, player information, regulations, and updates.",
  },
  links: {
    registrations: "https://oceaniayouth2027.hobsonsbaychess.com/registration",
    playerList: "https://oceaniayouth2027.hobsonsbaychess.com/players",
    liveBoardsGroupA: "https://oceaniayouth2027.hobsonsbaychess.com/live-boards-a",
    liveBoardsGroupB: "https://oceaniayouth2027.hobsonsbaychess.com/live-boards-b",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086993246646!2d144.9630576!3d-37.8142176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43f1fcb0d9%3A0x5045675218ce6e0!2sMelbourne%20VIC!5e0!3m2!1sen!2sau!4v1750000000000!5m2!1sen!2sau",
  },
  seo: {
    locale: "en_AU",
    type: "website" as const,
    twitterCard: "summary_large_image" as const,
  },
  footer: {
    statusLabel: "Event planning phase",
    statusText:
      "The 2027 website is being prepared now, with structure, regulations, schedules, and player listings being staged for final event data.",
    coverageTitle: "Key sections",
    coverageLinks: [
      { label: "News & Updates", href: "/news" },
      { label: "Tournament Schedule", href: "/schedule" },
      { label: "Regulations", href: "/regulations" },
      { label: "Player Directory", href: "/players" },
      { label: "Visit Guide", href: "/location" },
      { label: "Live Boards", href: "/dgt-boards" },
    ],
    note:
      "Final dates, venue confirmation, entries, and federation contacts will be updated as official event information is released.",
  },
};

export type SiteConfig = typeof siteConfig;
