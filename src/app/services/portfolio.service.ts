import { Injectable, computed, effect, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import {
  Locale,
  Theme,
  PortfolioData,
  Profile,
  ExperienceItem,
  Project,
  Snippet,
  UiStrings,
} from '../models/portfolio.model';

const THEME_KEY = 'cf.theme';
const LOCALE_KEY = 'cf.locale';

/**
 * Single source of truth for the app.
 * - Reactive `theme` and `locale` (signals) drive the whole UI.
 * - Data is fetched once from the static JSON files in assets/data/.
 *
 * Note: this app is a static Jamstack build (GitHub Pages) — there is no
 * server. All content lives in assets/data/*.json, regenerated locally with
 * `node scripts/parse-resume.js`.
 */
@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);

  /** ----- Theme ----- */
  readonly theme = signal<Theme>(this.resolveInitialTheme());

  /** ----- Locale ----- */
  readonly locale = signal<Locale>(this.resolveInitialLocale());

  /** ----- Data ----- */
  readonly data = signal<PortfolioData | null>(null);
  readonly loaded = computed(() => this.data() !== null);

  /** Convenience selectors */
  readonly profile = computed<Profile | null>(() => this.data()?.profile ?? null);
  readonly experience = computed<ExperienceItem[]>(() => this.data()?.experience ?? []);
  readonly projects = computed<Project[]>(() => this.data()?.projects ?? []);
  readonly snippets = computed<Snippet[]>(() => this.data()?.snippets ?? []);
  readonly ui = computed<UiStrings | null>(() => this.data()?.ui ?? null);

  constructor() {
    // Persist + apply theme whenever it changes.
    effect(() => {
      const t = this.theme();
      document.documentElement.dataset['theme'] = t;
      document.documentElement.classList.toggle('dark', t === 'dark');
      try {
        localStorage.setItem(THEME_KEY, t);
      } catch {}
    });

    // Persist locale + reflect on <html lang>.
    effect(() => {
      const l = this.locale();
      document.documentElement.lang = l;
      try {
        localStorage.setItem(LOCALE_KEY, l);
      } catch {}
    });
  }

  /** Kick off data hydration; call once from the root component. */
  load(): void {
    forkJoin({
      profile: this.http.get<Profile>('assets/data/profile.json'),
      experience: this.http.get<ExperienceItem[]>('assets/data/experience.json'),
      projects: this.http.get<Project[]>('assets/data/projects.json'),
      snippets: this.http.get<Snippet[]>('assets/data/snippets.json'),
      ui: this.http.get<UiStrings>('assets/data/ui.json'),
    }).subscribe((payload) => this.data.set(payload));
  }

  toggleTheme(): void {
    this.theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  setLocale(locale: Locale): void {
    this.locale.set(locale);
  }

  // -------- initial state resolution --------

  private resolveInitialTheme(): Theme {
    try {
      const saved = localStorage.getItem(THEME_KEY) as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private resolveInitialLocale(): Locale {
    try {
      const saved = localStorage.getItem(LOCALE_KEY) as Locale | null;
      if (saved === 'en' || saved === 'hi' || saved === 'kn') return saved;
    } catch {}
    const nav = (navigator.language || 'en').slice(0, 2);
    return nav === 'hi' || nav === 'kn' ? (nav as Locale) : 'en';
  }
}
