import { siteConfig } from "@/lib/site-config";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/venue", label: "Venue" },
  { href: "/map", label: "Map" },
  { href: "/schedule", label: "Schedule" },
  { href: "/regulations", label: "Regulations" },
  { href: "/players", label: "Players" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/dgt-boards", label: "DGT Boards" },
];

export const homePageData = {
  dateLabel: "Event dates coming soon",
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
    {
      title: "Venue",
      body: "Venue name and host city placeholder.",
    },
    {
      title: "Dates",
      body: "Tournament dates placeholder.",
    },
    {
      title: "Format",
      body: "Event format placeholder, such as rated divisions or age groups.",
    },
    {
      title: "Eligibility",
      body: "Eligibility rules placeholder for players, federations, or schools.",
    },
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

export const venueData = {
  venue: {
    name: "Venue name placeholder",
    address: "Venue address placeholder",
    note: "Use this area for arrival instructions, entry gates, campus buildings, or venue notes.",
  },
  travelIntro: "Add a short overview here explaining where the venue is and why it is convenient for players and families.",
  byAir: "Airport and arrival placeholder. Replace this with the closest airport, transfer options, and expected travel times.",
  byTransport:
    "Public transport placeholder. Replace with trains, buses, parking, or shuttle information relevant to the final venue.",
  transportRoutes: [
    {
      label: "Transport route placeholder A",
      href: "https://www.example.com/transport-route-a",
      note: "(Add stop or station details here.)",
    },
    {
      label: "Transport route placeholder B",
      href: "https://www.example.com/transport-route-b",
      note: "(Add stop or station details here.)",
    },
  ],
  accommodation: [
    {
      name: "Hotel placeholder one",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
      offer: "Special rate placeholder",
    },
    {
      name: "Hotel placeholder two",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
    },
    {
      name: "Hotel placeholder three",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
    },
    {
      name: "Apartment placeholder four",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
      offer: "Booking code placeholder",
    },
    {
      name: "Accommodation placeholder five",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
    },
    {
      name: "Accommodation placeholder six",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
    },
    {
      name: "Accommodation placeholder seven",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
    },
    {
      name: "Accommodation placeholder eight",
      address: "Accommodation address placeholder",
      distance: "Distance placeholder",
    },
  ],
  onSiteFoodIntro: "On-site food placeholder. Replace this with actual cafe hours, kiosks, or meal options.",
  onSiteFoodItems: [
    "Meal option placeholder one",
    "Meal option placeholder two",
    "Snack or drinks placeholder",
  ],
  nearbyEateries: [
    { name: "Cafe placeholder one", address: "Food location placeholder", distance: "Distance placeholder" },
    { name: "Cafe placeholder two", address: "Food location placeholder", distance: "Distance placeholder" },
    { name: "Grocery placeholder", address: "Food location placeholder", distance: "Distance placeholder" },
    { name: "Restaurant placeholder", address: "Food location placeholder", distance: "Distance placeholder" },
    { name: "Quick meal placeholder", address: "Food location placeholder", distance: "Distance placeholder" },
    { name: "Family dining placeholder", address: "Food location placeholder", distance: "Distance placeholder" },
  ],
};

export const scheduleRows = [
  { date: "Day 0", day: "Arrival", time: "TBC", venue: "Main venue", activity: "Registration placeholder" },
  { date: "", day: "", time: "TBC", venue: "Briefing room", activity: "Staff or team meeting placeholder" },
  { date: "Day 1", day: "Opening", time: "TBC", venue: "Main hall", activity: "Opening ceremony placeholder" },
  { date: "", day: "", time: "TBC", venue: "Playing hall", activity: "Round 1 placeholder" },
  { date: "", day: "", time: "TBC", venue: "Playing hall", activity: "Round 2 placeholder" },
  { date: "Day 2", day: "Competition", time: "TBC", venue: "Playing hall", activity: "Round 3 placeholder" },
  { date: "", day: "", time: "TBC", venue: "Playing hall", activity: "Round 4 placeholder" },
  { date: "Day 3", day: "Competition", time: "TBC", venue: "Playing hall", activity: "Round 5 placeholder" },
  { date: "", day: "", time: "TBC", venue: "Playing hall", activity: "Round 6 placeholder" },
  { date: "Day 4", day: "Competition", time: "TBC", venue: "Playing hall", activity: "Round 7 placeholder" },
  { date: "", day: "", time: "TBC", venue: "Playing hall", activity: "Round 8 placeholder" },
  { date: "Day 5", day: "Finals", time: "TBC", venue: "Playing hall", activity: "Round 9 placeholder" },
  { date: "", day: "", time: "TBC", venue: "Ceremony space", activity: "Awards ceremony placeholder" },
];

export const regulations = {
  title: "2025 Oceania Youth Chess Zonal Tournament Regulations",
  sections: [
    {
      heading: "1. Technical Regulations",
      paragraphs: [
        "Australasian Chess Enterprises (ACE) and the Oceania Chess Confederation (OCC) invite all young chess players from Oceania to participate in the 2025 Oceania Youth Chess Zonal Tournament.",
      ],
    },
    {
      heading: "1.1 Play System",
      paragraphs: [
        "Each tournament will be a Swiss System with 9 rounds.",
        "There shall be 7 categories with separate events for Open and Girls (in total 14 championships):",
        "In case there are fewer than eight players and three Federations in an age group category, that group shall be merged with another group.",
        "Every Oceania Federation or associated member can register one official player in each category (under 8, 10, 12, 14, 16, 18 & 20 years old, Open and Girls) totaling a maximum of 14 invited players. No replacement from other categories can be made in case there is no official player in one category.",
      ],
      list: [
        "UNDER 8 OPEN & GIRLS",
        "UNDER 10 OPEN & GIRLS",
        "UNDER 12 OPEN & GIRLS",
        "UNDER 14 OPEN & GIRLS",
        "UNDER 16 OPEN & GIRLS",
        "UNDER 18 OPEN & GIRLS",
        "UNDER 20 OPEN & GIRLS",
      ],
    },
    {
      heading: "1.2 Participation Eligibility",
      paragraphs: [
        "Entitled to participate are Chess players from Oceania Federations (Zone 3.6 federations) or associated members. Players must not have reached his/her respective age group birthday before 1st January 2025.",
        "AGE GROUP REQUIREMENTS",
        "Each Federation or associated member country may register any number of players to participate in the age group categories.",
      ],
      list: [
        "UNDER 8 Born on or after 1st January 2017",
        "UNDER 10 Born on or after 1st January 2015",
        "UNDER 12 Born on or after 1st January 2013",
        "UNDER 14 Born on or after 1st January 2011",
        "UNDER 16 Born on or after 1st January 2009",
        "UNDER 18 Born on or after 1st January 2007",
        "UNDER 20 Born on or after 1st January 2005",
      ],
    },
    {
      heading: "1.3 Rate of Play",
      paragraphs: ["90 minutes per player with an increment of 30 seconds per move from move one."],
    },
    {
      heading: "1.4 Default Time",
      paragraphs: ["A player forfeits the game if he/she hasn't appeared at his/her board within 30 minutes after the start of the game."],
    },
    {
      heading: "1.5 Tiebreaks",
      paragraphs: ["Final ranking order of players is determined by the number of points scored. If two or more players are tied, the tie shall be broken by tiebreak systems in the following order:"],
      orderedList: [
        "Direct Encounter",
        "The greater number of wins",
        "Buchholz",
        "Buchholz Cut 1, Cut 2",
        "Sonnenborn Berger",
      ],
    },
    {
      heading: "1.6 Appeals Committee and Appeals Procedure",
      paragraphs: [
        "The Continental President for Asia (His Highness Sheikh Sultan Bin Khalifa Al Nahyan) has, after consultation with the organizing federation, appointed IA David Esmonde as the Technical Delegate, and IA Dr Peter Tsai as the Chief Arbiter. The Chief Arbiter may, in consultation with the Technical Delegate, issue additional written regulations on other details not covered by these regulations.",
        "The Technical Delegate (or nominee) shall chair the Appeals Committee. The Appeals Committee shall be composed of three members and two reserves, all from different federations. No member of the Appeals Committee shall take part in a decision affecting a player belonging to the same federation unless both players are from the same federation.",
        "Appeals including appeals against the decisions of the Chief Arbiter or his assistants must be submitted in writing to the Chairman of the Appeals Committee within fifteen minutes of the completion of the relevant playing session alongside a $100 AUD bond.",
        "The decision of the Appeals Committee is final, binding and takes effect immediately. Should the appeal be successful, the bond will be returned to the appealer.",
      ],
    },
    {
      heading: "1.7 Prizes",
      paragraphs: [
        "The Organiser shall award gold, silver and bronze trophies to the top three positions, after application of tiebreaks where required, in each age group category.",
        "Certificates of Participation shall be given to all players, Fide accredited trainers, Managers and Officials.",
      ],
    },
    {
      heading: "1.8 Direct Titles",
      paragraphs: [
        "FIDE rules state that for a direct title to be awarded immediately an applicant has to have achieved at some time or other a minimum rating as follows: IM 2200, WIM 2000, FM 2100, WFM 1900, CM 2000, and WCM 1800.",
        "If groups are combined to make a bigger group, then the requirements (at least 8 participants from at least 4 federations) shall apply to this merged group. Titles can be awarded to the best player(s) of the subgroups, provided the subgroup has at least 6 participants from at least 3 federations and the player scores a minimum of 50% in a minimum of 9 games.",
        "The Chief Organizer and Oceanic Chess President reserve the right to change divisions to support the awarding of direct titles.",
        "In the U20 category, the gold medal winner shall be awarded the Grandmaster (GM)/Woman Grandmaster (WGM) norm (9 games). 1st equal (up to 3 players) shall get the IM/WIM title. The silver and bronze medal winners shall be awarded the IM/WIM norm and FIDE Master (FM)/Woman FIDE Master (WFM).",
        "In the U18 categories, the gold medal winner shall be awarded the title of International Master (IM) / Woman International Master (WIM). 1st equal players (up to 3 players) shall get IM/WIM norm (9 games). The Silver & Bronze Medal winners shall be awarded the FIDE Master (FM) / Woman FIDE Master (WFM) title.",
        "In the U16 category, the gold medal winner shall be awarded IM/WIM norm (9 games). 1st equal player (up to 3 players) shall get FM/WFM title. The Silver & Bronze Medal winners shall be awarded the Candidate Master (CM) / Woman Candidate Master (WCM) title.",
        "In the U12 & U14 categories, the gold medal winner shall be awarded the title of FM / WFM. The Silver & Bronze Medal winners shall be awarded the CM / WCM title.",
        "Gold, Silver & Bronze Medal (after tiebreak up to 3 players) winners of the U8 & U10 categories shall be awarded the CM/WCM title.",
      ],
    },
    {
      heading: "1.9 If you Require a Visa",
      paragraphs: [
        "Invitational Letters will only be given for Visas once the Entry Fee is paid. If you are then unable to obtain an Australian Visa, your entry/registration fee will be refunded.",
        "Please contact oceanicyouthchesschamps2025@gmail.com after you have paid your entry fee, and we will send you an invitational letter for a Visa.",
      ],
    },
    {
      heading: "1.10 Accommodation for Invited Players",
      paragraphs: [
        "To receive free accommodation as an invited player (excluding Australia) a member of your federation must email oceanicyouthchesschamps2025@gmail.com to claim your free accommodation by the 23rd of October at 11:59pm.",
      ],
    },
    {
      heading: "2. Code of Conduct for Spectator & Analysis Rooms",
      paragraphs: [
        "Classrooms will be opened for spectators and parents for analysis however users must comply with the following strict rules otherwise these rooms will be closed for everyone. We will need someone to be responsible for each analysis room we open.",
        "Important Notice:",
        "Any damage or mess to the rooms will result in analysis room closures and the associated damage costs being billed to you. Severe cases of damage may result in withdrawal of you and the participant under your care from the tournament and criminal proceedings.",
      ],
      list: [
        "No Eating (there will be a designated eating zone or you can eat outside)",
        "No Rubbish",
        "No moving furniture, tampering with displays or equipment",
        "No transfer chess",
        "Children must always be supervised when in the analysis room",
        "Parents are not allowed into the player hall or lingering around the playing hall when games are being played. Only players in games, arbiters, the organizing committee and VIPs will be allowed in",
      ],
    },
  ],
};

export const playersData = {
  description:
    "Browse players by division, search by name or FIDE ID, and filter by category or federation.",
  divisions: ["U8", "U10", "U12", "U14", "U16", "U18", "U20"],
  categories: ["Open", "Girls"] as const,
  players: [
    {
      name: "Ari Tan",
      division: "U8",
      category: "Open",
      federation: "AUS",
      flag: "AU",
      fideId: "52000101",
      fideRating: 1120,
    },
    {
      name: "Lucas Wei",
      division: "U8",
      category: "Open",
      federation: "NZL",
      flag: "NZ",
      fideId: "43000102",
      fideRating: 1087,
    },
    {
      name: "Mila Kumar",
      division: "U8",
      category: "Girls",
      federation: "FIJ",
      flag: "FJ",
      fideId: "91000103",
      fideRating: 1042,
    },
    {
      name: "Sophie Teo",
      division: "U10",
      category: "Girls",
      federation: "SGP",
      flag: "SG",
      fideId: "58000104",
      fideRating: 1298,
    },
    {
      name: "Noah Faumuina",
      division: "U10",
      category: "Open",
      federation: "SAM",
      flag: "WS",
      fideId: "99000105",
      fideRating: 1214,
    },
    {
      name: "Ethan Ho",
      division: "U10",
      category: "Open",
      federation: "AUS",
      flag: "AU",
      fideId: "52000106",
      fideRating: 1355,
    },
    {
      name: "Chloe Martin",
      division: "U12",
      category: "Girls",
      federation: "NZL",
      flag: "NZ",
      fideId: "43000107",
      fideRating: 1512,
    },
    {
      name: "Ryan Lim",
      division: "U12",
      category: "Open",
      federation: "MAS",
      flag: "MY",
      fideId: "57000108",
      fideRating: 1590,
    },
    {
      name: "Isla Prasad",
      division: "U12",
      category: "Open",
      federation: "FIJ",
      flag: "FJ",
      fideId: "91000109",
      fideRating: 1468,
    },
    {
      name: "Emily Stone",
      division: "U14",
      category: "Girls",
      federation: "AUS",
      flag: "AU",
      fideId: "52000110",
      fideRating: 1718,
    },
    {
      name: "Daniel Reddy",
      division: "U14",
      category: "Open",
      federation: "NZL",
      flag: "NZ",
      fideId: "43000111",
      fideRating: 1774,
    },
    {
      name: "Mia Vuniyayawa",
      division: "U14",
      category: "Girls",
      federation: "FIJ",
      flag: "FJ",
      fideId: "91000112",
      fideRating: 1630,
    },
    {
      name: "James Patel",
      division: "U16",
      category: "Open",
      federation: "AUS",
      flag: "AU",
      fideId: "52000113",
      fideRating: 1936,
    },
    {
      name: "Grace Niu",
      division: "U16",
      category: "Girls",
      federation: "NZL",
      flag: "NZ",
      fideId: "43000114",
      fideRating: 1824,
    },
    {
      name: "Tyler Sione",
      division: "U16",
      category: "Open",
      federation: "TGA",
      flag: "TO",
      fideId: "98000115",
      fideRating: 1882,
    },
    {
      name: "Sarah Wong",
      division: "U18",
      category: "Girls",
      federation: "SGP",
      flag: "SG",
      fideId: "58000116",
      fideRating: 2011,
    },
    {
      name: "Oliver Chen",
      division: "U18",
      category: "Open",
      federation: "AUS",
      flag: "AU",
      fideId: "52000117",
      fideRating: 2094,
    },
    {
      name: "Hana Moce",
      division: "U18",
      category: "Girls",
      federation: "FIJ",
      flag: "FJ",
      fideId: "91000118",
      fideRating: 1916,
    },
    {
      name: "Leo Thompson",
      division: "U20",
      category: "Open",
      federation: "NZL",
      flag: "NZ",
      fideId: "43000119",
      fideRating: 2217,
    },
    {
      name: "Amelia Cruz",
      division: "U20",
      category: "Girls",
      federation: "AUS",
      flag: "AU",
      fideId: "52000120",
      fideRating: 2068,
    },
    {
      name: "Ben Tavita",
      division: "U20",
      category: "Open",
      federation: "SAM",
      flag: "WS",
      fideId: "99000121",
      fideRating: 2145,
    },
  ],
};

export const dgtGroups = [
  { title: "Boards 1-9", boards: Array.from({ length: 9 }, (_, index) => `DGT Board ${index + 1}`) },
  { title: "Boards 10-12", boards: Array.from({ length: 3 }, (_, index) => `DGT Board ${index + 10}`) },
  { title: "Boards 13-15", boards: Array.from({ length: 3 }, (_, index) => `DGT Board ${index + 13}`) },
  { title: "Boards 16-20", boards: Array.from({ length: 5 }, (_, index) => `DGT Board ${index + 16}`) },
];
