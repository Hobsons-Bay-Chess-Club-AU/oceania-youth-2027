export type NavLinkItem = {
  href: string;
  label: string;
};

export type NavGroupItem = {
  label: string;
  children: NavLinkItem[];
};

export type NavItem = NavLinkItem | NavGroupItem;

export const navItems: NavItem[] = [
  { href: "/location", label: "Visit" },
  { href: "/schedule", label: "Schedule" },
  { href: "/regulations", label: "Regulations" },
  { href: "/players", label: "Players" },
  {
    label: "Information",
    children: [
      { href: "/organizer", label: "Organizer" },
      { href: "/sponsors", label: "Sponsors" },
      { href: "/dgt-boards", label: "Broadcasts" },
      { href: "/contact-us", label: "Contact Us" },
    ],
  },
  { href: "/news", label: "News & Updates" },
];
