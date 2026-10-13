export interface RegulationTable {
  headers: string[];
  rows: string[][];
}

export interface RegulationCallout {
  type: "warning" | "info" | "important";
  title?: string;
  text: string;
}

export interface RegulationSection {
  heading: string;
  paragraphs: string[];
  table?: RegulationTable;
  list?: string[];
  orderedList?: string[];
  callout?: RegulationCallout;
}

export interface TournamentMetadata {
  dates: string;
  venue: string;
  organiser: string;
  contact: string;
  status: string;
}

export interface RegulationsDoc {
  title: string;
  subtitle: string;
  hostClub: string;
  partners: string[];
  venueBranch: string;
  metadata: TournamentMetadata;
  sections: RegulationSection[];
}

export const regulations: RegulationsDoc = {
  title: "2027 Oceania Youth Chess Championships Official Regulations",
  subtitle: "Classical • Rapid • Blitz",
  hostClub: "Hobsons Bay Chess Club (HBCC)",
  partners: [
    "Oceania Chess Confederation (OCC)",
    "FIDE – International Chess Federation",
  ],
  venueBranch: "Bacchus Marsh Grammar Woodlea Branch",
  metadata: {
    dates: "29 September – 3 October 2027",
    venue: "Bacchus Marsh Grammar – Woodlea Campus, Victoria, Australia",
    organiser: "Hobsons Bay Chess Club, in association with the Oceania Chess Confederation",
    contact: "major_tournaments@hobsonsbaychess.com",
    status:
      "These regulations are based on the 2025 Oceania Youth Chess Zonal Tournament Regulations and are adapted for the 2027 Championships. The FIDE Laws of Chess, FIDE Title Regulations and FIDE Rating Regulations in force at the start of each event take precedence if any inconsistency arises. The Organising Committee may publish necessary amendments before the tournament.",
  },
  sections: [
    {
      heading: "1. Technical Regulations",
      paragraphs: [
        "Hobsons Bay Chess Club (HBCC) and the Oceania Chess Confederation (OCC) invite eligible young chess players from Oceania to participate in the 2027 Oceania Youth Chess Championships.",
      ],
    },
    {
      heading: "1.1 Championships and playing system",
      paragraphs: [
        "The Championships comprise seven age categories, with separate Open and Girls events in each category, for a total of 14 championships per playing format:",
      ],
      table: {
        headers: ["Category", "Events"],
        rows: [
          ["Under 8", "Under 8 Open and Under 8 Girls"],
          ["Under 10", "Under 10 Open and Under 10 Girls"],
          ["Under 12", "Under 12 Open and Under 12 Girls"],
          ["Under 14", "Under 14 Open and Under 14 Girls"],
          ["Under 16", "Under 16 Open and Under 16 Girls"],
          ["Under 18", "Under 18 Open and Under 18 Girls"],
          ["Under 20", "Under 20 Open and Under 20 Girls"],
        ],
      },
      list: [
        "The Classical championships will be played as nine-round Swiss tournaments.",
        "The Rapid championships will be played as seven-round Swiss tournaments.",
        "The Blitz championships will be played as nine-round Swiss tournaments.",
        "If an age category does not meet the participation requirements prescribed by FIDE and OCC, the Organising Committee may merge it with another category. Where categories are merged, prizes and any title eligibility will be determined in accordance with the applicable FIDE regulations.",
        "Each Oceania federation or associated member may nominate one official player in each category (Open and Girls), up to a maximum of 14 official players. An unused official-player place in one category cannot be transferred to another category.",
      ],
    },
    {
      heading: "1.2 Participation and age eligibility",
      paragraphs: [
        "Players registered with an Oceania federation (FIDE Zone 3.6) or an eligible associated member may participate. A player may enter their eligible age category or an older age category, subject to the entry conditions and approval of the Organising Committee. A player may enter only one age category in each playing format.",
      ],
      table: {
        headers: ["Age group", "Date of birth requirement", "Eligible birth years"],
        rows: [
          ["Under 8", "Born on or after 1 January 2019", "2019 or later"],
          ["Under 10", "Born on or after 1 January 2017", "2017 or later"],
          ["Under 12", "Born on or after 1 January 2015", "2015 or later"],
          ["Under 14", "Born on or after 1 January 2013", "2013 or later"],
          ["Under 16", "Born on or after 1 January 2011", "2011 or later"],
          ["Under 18", "Born on or after 1 January 2009", "2009 or later"],
          ["Under 20", "Born on or after 1 January 2007", "2007 or later"],
        ],
      },
      paragraphsAfterTable: [
        "The age-group cut-offs above are determined by the player’s year of birth. Proof of date of birth may be requested. Each federation or associated member may register any number of additional players in the age-group categories.",
      ],
    } as RegulationSection & { paragraphsAfterTable?: string[] },
    {
      heading: "1.3 Time controls",
      paragraphs: [],
      table: {
        headers: ["Format", "Rounds", "Time control"],
        rows: [
          ["Classical", "9", "90 minutes + 30 seconds per move from move 1"],
          ["Rapid", "7", "10 minutes + 2 seconds per move from move 1"],
          ["Blitz", "9", "3 minutes + 2 seconds per move from move 1"],
        ],
      },
    },
    {
      heading: "1.4 Default time",
      paragraphs: [
        "For Classical games, a player loses the game if they arrive at the board 30 minutes or more after the scheduled start of the round, unless the Chief Arbiter decides otherwise.",
        "For Rapid and Blitz games, the default time is zero: a player must be present at the board when the round starts, unless a different default time is announced in writing before the event.",
      ],
    },
    {
      heading: "1.5 Pairings, byes and withdrawals",
      paragraphs: [
        "Pairings will be produced using a FIDE-approved Swiss pairing program and the applicable FIDE pairing regulations. Pairings must not be altered to favour any player. A pairing-allocated bye will be assigned by the pairing system when required and will be scored in accordance with the applicable regulations.",
        "Requests for permitted byes, withdrawals or re-entry must be made through the procedure and by the deadlines published by the Organising Committee. A player who cannot continue must promptly notify the Chief Arbiter or the Organising Committee.",
      ],
    },
    {
      heading: "1.6 Tiebreaks",
      paragraphs: [
        "Final ranking is determined by points scored. If two or more players are tied, the following tiebreaks apply in order, subject to confirmation by the Chief Arbiter before Round 1:",
      ],
      orderedList: [
        "Direct encounter, where applicable",
        "Number of wins",
        "Buchholz",
        "Buchholz Cut 1, then Buchholz Cut 2",
        "Sonneborn-Berger",
      ],
      paragraphsAfterTable: [
        "The announced tiebreak settings in the pairing program are authoritative. Any correction required by the applicable FIDE rules will be made by the Chief Arbiter.",
      ],
    } as RegulationSection & { paragraphsAfterTable?: string[] },
    {
      heading: "1.7 Appeals",
      paragraphs: [
        "The Technical Delegate, Chief Arbiter and Appeals Committee will be appointed and announced by OCC and the Organising Committee. The Appeals Committee will comprise three members and two reserves from different federations. A member must not take part in deciding an appeal affecting a player from the same federation, unless both players concerned are from that federation.",
        "An appeal against a decision of the Chief Arbiter or an assistant arbiter must be submitted in writing to the Chair of the Appeals Committee within 15 minutes after the end of the relevant playing session and accompanied by an AUD 100 appeal bond. The Appeals Committee’s decision is final, binding and effective immediately. If the appeal is upheld, the bond will be refunded; otherwise it may be retained.",
      ],
    },
    {
      heading: "1.8 Awards",
      paragraphs: [
        "Gold, silver and bronze trophies or medals will be awarded to the top three places in each age-group category after application of the published tiebreaks. Participation certificates may be issued to players and accredited officials. Details of any additional prizes will be published separately.",
      ],
    },
    {
      heading: "1.9 Direct titles and norms",
      paragraphs: [
        "Direct titles and title norms are not guaranteed merely by placing in an age category. They are available only where the event and relevant category satisfy every requirement of the FIDE Title Regulations and the FIDE Table for Direct Titles in force when the tournament begins, including event designation, number of games, player and federation participation, score, rating and application requirements.",
        "Where FIDE requirements are met, the results may qualify for the direct titles or norms prescribed for the relevant regional youth event. Titles may be conditional on the player achieving the applicable minimum rating. The Chief Arbiter and OCC will determine and submit eligible title applications; FIDE retains final authority.",
        "Any merged-category title eligibility will be assessed under the applicable FIDE regulations. Classical results only are considered for standard-play direct titles and norms unless FIDE regulations expressly provide otherwise.",
      ],
    },
    {
      heading: "2. Laws, conduct and fair play",
      paragraphs: [],
    },
    {
      heading: "2.1 Laws of Chess",
      paragraphs: [
        "All games are governed by the FIDE Laws of Chess and the applicable FIDE competition, rating, title, ethics and fair-play regulations. Players must follow the directions of the arbiters and venue staff.",
      ],
    },
    {
      heading: "2.2 Electronic devices",
      paragraphs: [
        "Unless expressly authorised by the Chief Arbiter, players must not have a mobile phone, smartwatch, smart glasses or other electronic or communication device on their person in the playing area. Devices must be completely switched off and stored as directed by the Organising Committee. A medically necessary device or FIDE-approved electronic notation device must receive prior approval from the arbiter team. Penalties will be imposed under the FIDE Laws of Chess and the event’s announced device policy.",
      ],
    },
    {
      heading: "2.3 Player and spectator access",
      paragraphs: [
        "Only players with games in progress, arbiters, authorised organisers, accredited officials and approved VIPs may enter the playing hall while games are in progress. Parents and spectators must remain in designated areas and must not communicate with players during play.",
      ],
    },
    {
      heading: "3. Spectator and analysis-room code of conduct",
      paragraphs: [
        "Any classroom or designated analysis room is made available on the condition that users protect the venue and comply with the following rules:",
      ],
      list: [
        "No eating except in a designated eating area or outside",
        "Place all rubbish in the bins provided",
        "Do not move furniture or tamper with displays, fittings or equipment",
        "No transfer chess or disruptive play",
        "Children must be supervised by a responsible adult at all times",
        "Follow all instructions given by venue staff and tournament officials",
      ],
      callout: {
        type: "warning",
        title: "Important Notice",
        text: "Damage, unsafe behaviour or persistent mess may result in closure of the analysis rooms. The responsible person may be charged for damage or cleaning. Serious misconduct may lead to removal from the venue, withdrawal of the player under that person’s care, and referral to the relevant authorities.",
      },
    },
    {
      heading: "4. Visas and official accommodation",
      paragraphs: [],
    },
    {
      heading: "4.1 Visa invitation letters",
      paragraphs: [
        "A visa invitation letter will be issued only after the player’s entry fee has been paid and the required personal and travel information has been supplied. Visa decisions are made solely by the Australian Government. Any refund for an unsuccessful visa application is subject to the published entry and refund policy.",
        "Requests for visa invitation letters must be sent to major_tournaments@hobsonsbaychess.com with sufficient processing time.",
      ],
    },
    {
      heading: "4.2 Official players and delegations",
      paragraphs: [
        "Accommodation entitlements for nominated official players and the Head of Delegation are governed by the official 2027 invitation and registration pack. Eligible federations must nominate their official players and claim accommodation by the published deadline. Unclaimed or late entitlements may lapse. Accommodation is normally twin-share and is subject to the conditions advised by the Organising Committee.",
      ],
    },
    {
      heading: "5. Final authority and amendments",
      paragraphs: [
        "The Chief Arbiter decides chess-related matters during play in accordance with the FIDE Laws of Chess and these regulations, subject to the appeals procedure. The Organising Committee and OCC may issue additional written regulations, schedules and venue instructions on matters not covered here. If these regulations conflict with mandatory FIDE or OCC rules, those rules prevail.",
        "Version: Draft tournament regulations prepared for the 2027 event. Operational details and appointments remain subject to confirmation by OCC and the Organising Committee.",
      ],
    },
  ],
};
