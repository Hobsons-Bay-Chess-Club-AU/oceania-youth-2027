import { siteConfig } from "@/lib/site-config";

export const homePageData = {
  dateLabel: "Official dates to be announced",
  eventStartDate: null as string | null,
  heroKicker: "Oceania Zone 3.6 | Australia 2027",
  heroImage: siteConfig.heroImage,
  alert: {
    title: "Important event updates",
    items: [
      "Australia has been announced as the host country for the 2027 Oceania Youth Zonal Tournament.",
      "Official updates on dates, venue, entry procedures, and logistics will be published here as they are confirmed.",
      "Players, families, and federations should use the News & Updates page for the latest notices.",
      "Registration, travel guidance, and operational details will be expanded as planning milestones are released.",
    ],
  },
  quickFacts: [
    {
      label: "Championships",
      value: "14",
      note: "Open and Girls championships are planned across the seven official age categories.",
      tone: "from-sky-400 via-cyan-300 to-teal-200",
    },
    {
      label: "Playing format",
      value: "9",
      note: "Each championship is scheduled as a nine-round Swiss tournament under the published regulations.",
      tone: "from-amber-300 via-orange-300 to-pink-200",
    },
    {
      label: "Age groups",
      value: "U8-U20",
      note: "Age divisions run from Under 8 through Under 20, covering the full Oceania youth pathway.",
      tone: "from-violet-400 via-fuchsia-300 to-rose-200",
    },
  ],
  tournamentStats: {
    heading: "Tournament snapshot",
    title: "Oceania field at a glance",
    badge: "Planning snapshot",
    description:
      "These planning figures help explain the scale of the event and can be updated later as entries, officials, and federation participation are confirmed.",
    stats: {
      Federations: 6,
      Championships: 14,
      Rounds: 9,
      AgeGroups: 7,
    },
  },
  eventDetails: [
    {
      title: "Host nation",
      body: "Australia has been announced as host, with final city and venue details to be published once confirmed.",
    },
    {
      title: "Dates",
      body: "Official tournament dates are still to be announced and will be published here as soon as they are finalised.",
    },
    {
      title: "Format",
      body: "The event is planned as nine-round Swiss championships across the official Oceania youth age categories.",
    },
    {
      title: "Eligibility",
      body: "Participation is intended for players from Oceania federations and associated members, subject to age-group rules.",
    },
  ],
  stakes: [
    {
      title: "Titles",
      body: "Published regulations outline direct title pathways and norm opportunities across several age categories.",
    },
    {
      title: "Recognition",
      body: "Gold, silver, and bronze trophies are planned for each championship, together with participation certificates.",
    },
    {
      title: "Representation",
      body: "The zonal gives young players the chance to compete for their federation on the Oceania stage.",
    },
    {
      title: "Legacy",
      body: "Events like this strengthen youth chess development across the region and create lasting international connections.",
    },
  ],
  whyParticipate: [
    {
      title: "Regional Representation",
      body: "Players have the opportunity to represent their federation in the premier Oceania youth zonal environment.",
    },
    {
      title: "FIDE Ratings",
      body: "Rated tournament conditions and title pathways make this a meaningful competitive step for ambitious juniors.",
    },
    {
      title: "Challenge Yourself",
      body: "The event brings together strong young players from across the region, creating real tests in every age group.",
    },
    {
      title: "Tournament Thrill",
      body: "Beyond the games, the tournament offers a memorable international atmosphere for players, families, and teams.",
    },
  ],
  registration: {
    description:
      "Registration is not yet open. This website will publish the official entry process, eligibility notes, deadlines, and tournament updates once the organiser releases them.",
    playersRegistered: "Opening soon",
    status: "Registration not yet open",
    note: "Families and federations should monitor the News & Updates page for the registration announcement and key planning milestones.",
  },
};
