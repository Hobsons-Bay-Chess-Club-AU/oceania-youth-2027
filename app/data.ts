import { siteConfig } from "@/lib/site-config";

export const homePageData = {
  dateLabel: "Event dates coming soon",
  eventStartDate: "2027-01-01",
  heroImage: siteConfig.heroImage,
  alert: {
    title: "Important event update placeholder",
    items: [
      "Replace this note with the latest headline for players and families.",
      "Use this space for transport changes, round reminders, or venue notices.",
      "Keep each update short so it is easy to scan on mobile.",
      "Link to schedules, live boards, or important announcements when ready.",
    ],
  },
  eventDetails: [
    { title: "Venue", body: "Venue name and host city placeholder." },
    { title: "Dates", body: "Tournament dates placeholder." },
    { title: "Format", body: "Event format placeholder, such as rated divisions or age groups." },
    { title: "Eligibility", body: "Eligibility rules placeholder for players, federations, or schools." },
  ],
  stakes: [
    { title: "Titles", body: "Placeholder for title pathways, norms, or rating opportunities." },
    { title: "Recognition", body: "Placeholder for medals, trophies, certificates, or team honours." },
    { title: "Representation", body: "Placeholder for federation, school, or regional representation." },
    { title: "Legacy", body: "Placeholder for how this event supports long-term youth chess growth." },
  ],
  whyParticipate: [
    {
      title: "Regional Representation",
      body: "Placeholder copy explaining why players will want to represent their region or team.",
    },
    {
      title: "FIDE Ratings",
      body: "Placeholder copy for rating growth, norms, titles, or competitive development.",
    },
    {
      title: "Challenge Yourself",
      body: "Placeholder copy for stepping up, learning, and facing strong opponents.",
    },
    {
      title: "Tournament Thrill",
      body: "Placeholder copy for atmosphere, friendships, and memorable event moments.",
    },
  ],
  registration: {
    description:
      "Placeholder registration message for the upcoming event. Swap this for the real invitation, player callout, or launch announcement later.",
    playersRegistered: "Player count placeholder",
    status: "Registration status placeholder",
    note: "Add a short note here for travel, team registrations, or waitlist information.",
  },
};
