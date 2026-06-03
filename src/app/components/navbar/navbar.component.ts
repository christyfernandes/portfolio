import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';
import { SUPPORTED_LOCALES, Locale } from '../../models/portfolio.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [LocalizePipe],
  template: `
    <nav
      class="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-lg"
    >
      <div class="mx-auto flex max-w-5xl items-center gap-5 px-6 py-3.5">
        <div
          class="grid h-9 w-9 flex-none place-items-center rounded-xl bg-grad font-display text-lg font-extrabold text-[#06121f]"
        >
          {{ svc.profile()?.initials || 'CF' }}
        </div>

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

        <div class="ml-auto flex items-center gap-2.5">
          <div class="flex rounded-[10px] border border-border bg-surface2 p-[3px]">
            @for (loc of locales; track loc.code) {
              <button
                type="button"
                (click)="svc.setLocale(loc.code)"
                [class.bg-grad]="svc.locale() === loc.code"
                [class.text-\[\#06121f\]]="svc.locale() === loc.code"
                class="cursor-pointer rounded-[7px] px-2.5 py-[7px] text-xs font-semibold text-muted transition"
              >
                {{ loc.label }}
              </button>
            }
          </div>
          <button
            type="button"
            (click)="svc.toggleTheme()"
            aria-label="Toggle theme"
            class="grid h-[38px] w-[42px] cursor-pointer place-items-center rounded-[10px] border border-border bg-surface2 text-base text-text transition hover:border-teal"
          >
            {{ svc.theme() === 'dark' ? '🌙' : '☀️' }}
          </button>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;
  locales = SUPPORTED_LOCALES;

  navLinks: { id: string; key: 'home' | 'experience' | 'projects' | 'codeHacks' | 'contact' }[] = [
    { id: 'home', key: 'home' },
    { id: 'experience', key: 'experience' },
    { id: 'projects', key: 'projects' },
    { id: 'code', key: 'codeHacks' },
    { id: 'contact', key: 'contact' },
  ];
}
