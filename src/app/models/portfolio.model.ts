/**
 * Core data models for the data-driven portfolio.
 * Every piece of user-facing content is a `LocalizedString`, so the UI can
 * switch between English, Hindi, and Kannada without a page reload.
 */

export type Locale = 'en' | 'hi' | 'kn';
export type Theme = 'light' | 'dark';

/** A string available in all supported locales. */
export interface LocalizedString {
  en: string;
  hi: string;
  kn: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  /** icon key resolved in SocialLinksComponent ('github' | 'linkedin' | 'medium' | 'mail') */
  icon: string;
}

export interface Profile {
  name: string;
  initials: string;
  headline: LocalizedString;
  tagline: LocalizedString;
  status: {
    available: boolean;
    label: LocalizedString;
  };
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  socials: SocialLink[];
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  role: LocalizedString;
  company: string;
  location: string;
  period: string;
  current: boolean;
  summary: LocalizedString;
  /** Markdown-style **bold** is supported for highlighting key metrics. */
  highlights: LocalizedString[];
  tech: string[];
}

export interface Project {
  id: string;
  title: string;
  featured: boolean;
  period: string;
  description: LocalizedString;
  tech: string[];
  repo: string;
  live: string;
}

export interface Snippet {
  id: string;
  title: string;
  language: string;
  tags: string[];
  summary: LocalizedString;
  code: string;
}

/** UI chrome strings (nav, buttons, section titles). Mirrors assets/data/ui.json. */
export interface UiStrings {
  nav: Record<'home' | 'experience' | 'projects' | 'codeHacks' | 'contact', LocalizedString>;
  hero: Record<'greeting' | 'downloadResume' | 'contactMe', LocalizedString>;
  sections: Record<
    'experienceTitle' | 'projectsTitle' | 'codeHacksTitle' | 'codeHacksSubtitle' | 'contactTitle',
    LocalizedString
  >;
  codeHacks: Record<'searchPlaceholder' | 'all' | 'copy' | 'copied' | 'noResults', LocalizedString>;
  contact: Record<'intro' | 'emailMe', LocalizedString>;
  footer: Record<'builtWith', LocalizedString>;
}

/** The full payload hydrated by PortfolioService. */
export interface PortfolioData {
  profile: Profile;
  experience: ExperienceItem[];
  projects: Project[];
  snippets: Snippet[];
  ui: UiStrings;
}

export const SUPPORTED_LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'kn', label: 'ಕ' },
];
