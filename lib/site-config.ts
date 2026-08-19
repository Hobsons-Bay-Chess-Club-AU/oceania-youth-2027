export const siteConfig = {
  name: "Oceania Youth Chess Championship 2027",
  shortName: "Oceania Youth 2027",
  siteUrl: "https://oceaniayouth2027.hobsonsbaychess.com/",
  titleTemplate: "%s | Oceania Youth Zonal 2027",
  defaultTitle: "Oceania Youth Chess Championship 2027 (FIDE Zone 3.6)",
  description:
    "Official championship platform for Oceania Youth Chess Championship 2027 (FIDE Zone 3.6), hosted by Hobsons Bay Chess Club at Bacchus Marsh Grammar – Woodlea Campus in Melbourne, Australia.",
  keywords: [
    "Oceania Youth Chess Championship 2027",
    "FIDE Zone 3.6",
    "Hobsons Bay Chess Club",
    "Bacchus Marsh Grammar Woodlea",
    "youth chess championship",
    "Australia junior chess",
    "FIDE rated chess tournament",
  ],
  heroImage: "/og-image.svg",
  ogImage: "/og-image.svg",
  contact: {
    coordinatorName: "IA Casey Goh (Event Director) & HBCC Committee",
    phoneLabel: "Hobsons Bay Chess Club Inc.",
    email: "major_tournaments@hobsonsbaychess.com",
    responseWindow: "We aim to reply to all federation and player enquiries within 1 to 2 business days.",
    locationLabel: "Bacchus Marsh Grammar – Woodlea Campus (111 Frontier Ave, Aintree VIC 3336)",
    officeHours: "Email enquiries are monitored throughout the tournament planning and execution period.",
    formEndpoint: "",
    formProviderName: "Formspree",
    formProviderHref: "https://formspree.io/",
  },
  organization: {
    name: "Hobsons Bay Chess Club Inc. (Est. 1974) & Oceania Chess Confederation",
    legalLine: "Official championship platform for player registration, schedules, regulations, and live broadcasts.",
  },
  links: {
    registrations: "https://portal.hobsonsbaychess.com/public/schedule/events/87244oceania-youth-championship-2027",
    playerList: "/players",
    liveBoardsGroupA: "/dgt-boards",
    liveBoardsGroupB: "/dgt-boards",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3155.772590214876!2d144.675037!3d-37.725842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad684344d5c192d%3A0x6b8f726715ff2886!2sBacchus%20Marsh%20Grammar%20-%20Woodlea%20Campus!5e0!3m2!1sen!2sau!4v1750000000000!5m2!1sen!2sau",
  },
  seo: {
    locale: "en_AU",
    type: "website" as const,
    twitterCard: "summary_large_image" as const,
  },
  footer: {
    statusLabel: "Official Event Dates Confirmed",
    statusText:
      "Oceania Youth Zonal 2027 takes place 27 September – 4 October 2027 at Bacchus Marsh Grammar – Woodlea Campus in Melbourne, Australia.",
    coverageTitle: "Key Sections",
    coverageLinks: [
      { label: "News & Updates", href: "/news" },
      { label: "Tournament Schedule", href: "/schedule" },
      { label: "Regulations", href: "/regulations" },
      { label: "Player Directory", href: "/players" },
      { label: "Venue & Travel", href: "/location" },
      { label: "Registration Portal", href: "/registration" },
      { label: "Live DGT Boards", href: "/dgt-boards" },
    ],
    note:
      "Hosted by Hobsons Bay Chess Club Inc. (Est. 1974) under the auspices of the Oceania Chess Confederation (OCC) and Australian Chess Federation (ACF).",
  },
};

export type SiteConfig = typeof siteConfig;

