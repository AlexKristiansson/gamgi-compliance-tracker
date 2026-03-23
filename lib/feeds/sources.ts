export interface FeedSource {
  id: string;
  name: string;
  country: string;
  type: "dpa" | "court" | "institution" | "ngo" | "media";
  url: string;
  color: string;
  description: string;
}

export const FEED_SOURCES: FeedSource[] = [
  {
    id: "imy",
    name: "IMY",
    country: "SE",
    type: "dpa",
    url: "https://www.imy.se/nyheter/rss",
    color: "blue",
    description: "Integritetsskyddsmyndigheten — svenska tillsynsmyndigheten",
  },
  {
    id: "edpb",
    name: "EDPB",
    country: "EU",
    type: "institution",
    url: "https://www.edpb.europa.eu/rss.xml",
    color: "indigo",
    description: "European Data Protection Board — riktlinjer och beslut",
  },
  {
    id: "edps",
    name: "EDPS",
    country: "EU",
    type: "institution",
    url: "https://www.edps.europa.eu/feed/news_en",
    color: "blue",
    description: "European Data Protection Supervisor — EU:s dataskyddstillsynsman",
  },
  {
    id: "privacyint",
    name: "Privacy International",
    country: "INT",
    type: "ngo",
    url: "https://privacyinternational.org/rss.xml",
    color: "green",
    description: "Privacy International — global NGO för integritetsrätt",
  },
  {
    id: "cnil",
    name: "CNIL",
    country: "FR",
    type: "dpa",
    url: "https://www.cnil.fr/fr/rss.xml",
    color: "red",
    description: "Commission Nationale de l'Informatique et des Libertés — Frankrike",
  },
  {
    id: "noyb",
    name: "noyb",
    country: "INT",
    type: "ngo",
    url: "https://noyb.eu/en/rss.xml",
    color: "orange",
    description: "none of your business — Max Schrems klagomålsorganisation",
  },
  {
    id: "therecord",
    name: "The Record",
    country: "INT",
    type: "media",
    url: "https://therecord.media/feed/",
    color: "purple",
    description: "The Record — cybersäkerhet och dataskyddsnyheter",
  },
  {
    id: "gdprhub",
    name: "GDPRhub",
    country: "INT",
    type: "media",
    url: "https://gdprhub.eu/index.php?title=Special:RecentChanges&feed=rss",
    color: "teal",
    description: "GDPRhub — wiki för GDPR-beslut från alla europeiska DPA:er",
  },
];

export const SOURCE_BADGE_COLORS: Record<string, string> = {
  blue:   "bg-blue-100 text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green:  "bg-green-100 text-green-700",
  red:    "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  purple: "bg-purple-100 text-purple-700",
  teal:   "bg-teal-100 text-teal-700",
};
