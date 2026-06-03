import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';
import { SUPPORTED_LOCALES, Locale } from '../../models/portfolio.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LocalizePipe],
  template: `
    <nav class="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-lg">

      <!-- ── Main bar ── -->
      <div class="mx-auto flex max-w-5xl items-center gap-5 px-6 py-3.5">

        <!-- Logo -->
        <div class="grid h-9 w-9 flex-none place-items-center rounded-xl bg-grad font-display text-lg font-extrabold text-[#06121f]">
          {{ svc.profile()?.initials || 'CF' }}
        </div>

        <!-- Desktop nav links -->
        <div class="ml-2 hidden gap-2 md:flex">
          @for (link of navLinks; track link.id) {
            <a
              [href]="'#' + link.id"
              class="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface2 hover:text-text"
            >
              {{ ui()?.nav?.[link.key] | localize }}
            </a>
          }
        </div>

        <!-- Right controls -->
        <div class="ml-auto flex items-center gap-2.5">

          <!-- Locale switcher -->
          <div class="flex rounded-[10px] border border-border bg-surface2 p-[3px]">
            @for (loc of locales; track loc.code) {
              <button
                type="button"
                (click)="svc.setLocale(loc.code)"
                [class.bg-grad]="svc.locale() === loc.code"
                [class.text-\[\#06121f\]]="svc.locale() === loc.code"
                class="cursor-pointer rounded-[7px] px-2.5 py-[7px] text-xs font-semibold text-muted transition"
              >{{ loc.label }}</button>
            }
          </div>

          <!-- Theme toggle -->
          <button
            type="button"
            (click)="svc.toggleTheme()"
            aria-label="Toggle theme"
            class="grid h-[38px] w-[42px] cursor-pointer place-items-center rounded-[10px] border border-border bg-surface2 text-base text-text transition hover:border-teal"
          >{{ svc.theme() === 'dark' ? '🌙' : '☀️' }}</button>

          <!-- Sci-Fi view toggle (animated) -->
          <button
            type="button"
            (click)="svc.toggleViewMode()"
            aria-label="Switch view"
            title="Switch to Sci-Fi view"
            class="btn-view-mode grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-[10px] border bg-surface2 transition"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>

          <!-- Hamburger — mobile only -->
          <button
            type="button"
            (click)="menuOpen = !menuOpen"
            aria-label="Toggle navigation"
            class="grid h-[38px] w-[38px] cursor-pointer place-items-center rounded-[10px] border border-border bg-surface2 text-text transition hover:border-teal md:hidden"
          >
            @if (menuOpen) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            }
          </button>
        </div>
      </div>

      <!-- ── Mobile dropdown ── -->
      @if (menuOpen) {
        <div class="mobile-nav-open border-t border-border bg-surface2 px-4 pb-3 pt-2 md:hidden">
          @for (link of navLinks; track link.id) {
            <a
              [href]="'#' + link.id"
              (click)="menuOpen = false"
              class="flex rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface hover:text-text"
            >{{ ui()?.nav?.[link.key] | localize }}</a>
          }
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;
  locales = SUPPORTED_LOCALES;
  menuOpen = false;

  navLinks: { id: string; key: 'home' | 'experience' | 'projects' | 'codeHacks' | 'contact' }[] = [
    { id: 'home',       key: 'home' },
    { id: 'experience', key: 'experience' },
    { id: 'projects',   key: 'projects' },
    { id: 'code',       key: 'codeHacks' },
    { id: 'contact',    key: 'contact' },
  ];
}
