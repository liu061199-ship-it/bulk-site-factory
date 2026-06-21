export type SiteConfig = {
  slug: string;
  template: "download-landing" | "review-magazine" | "bonus-guide" | "howto-tutorial" | "updates-hub";
  contentFramework: string;
  siteName: string;
  domain: string;
  logo: string;
  themeColor: string;
  title: string;
  description: string;
  keywords: string[];
  contactEmail: string;
  heroTitle: string;
  heroSubtitle: string;
  appVersion: string;
  appSize: string;
  downloadUrl: string;
  offerText: string;
  paymentMethods: string[];
  featureBullets: string[];
  articles: string[];
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
};
