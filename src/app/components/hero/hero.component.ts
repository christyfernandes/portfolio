import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';

const HOT = new Set([
  'Apache Kafka',
  'Apache Flink',
  'Apache Druid',
  'PySpark',
  'AI-Assisted Dev (Claude, Copilot)',
]);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LocalizePipe],
  template: `
    @if (svc.profile(); as p) {
      <header id="home" class="relative mx-auto max-w-5xl px-6 pb-16 pt-20">
        <span
          class="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-[7px] text-[13px] font-medium text-muted"
        >
          <span class="dot relative h-[9px] w-[9px] flex-none rounded-full bg-teal"></span>
          {{ p.status.label | localize }}
        </span>

        <div class="mb-2 mt-6 text-[15px] font-semibold tracking-wide text-muted">
          {{ ui()?.hero?.greeting | localize }}
        </div>

        <h1 class="font-display text-[clamp(2.6rem,7vw,4.6rem)] font-extrabold leading-[1.02] tracking-tight">
          {{ firstName(p.name) }} <span class="bg-grad bg-clip-text text-transparent">{{ lastName(p.name) }}</span>
        </h1>

        <div class="mt-3.5 font-display text-[clamp(1.05rem,2.4vw,1.5rem)] font-semibold opacity-90">
          {{ p.headline | localize }}
        </div>
        <p class="mt-4 max-w-[620px] text-base text-muted">{{ p.tagline | localize }}</p>

        <div class="mt-7 flex flex-wrap gap-3.5">
          <a [href]="p.resumeUrl" download class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
            </svg>
            {{ ui()?.hero?.downloadResume | localize }}
          </a>
          <a href="#contact" class="btn btn-ghost">{{ ui()?.hero?.contactMe | localize }}</a>
        </div>

        <div class="mt-9 flex max-w-3xl flex-wrap gap-2">
          @for (skill of p.skills; track skill) {
            <span
              class="rounded-lg border bg-surface px-2.5 py-1.5 text-xs font-medium"
              [class.text-teal]="isHot(skill)"
              [class.border-border]="!isHot(skill)"
              [class.text-muted]="!isHot(skill)"
              [style.border-color]="isHot(skill) ? 'color-mix(in srgb, var(--teal) 40%, var(--border))' : null"
              >{{ skill }}</span
            >
          }
        </div>
      </header>
    }
  `,
})
export class HeroComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;

  isHot = (s: string) => HOT.has(s);
  firstName = (n: string) => n.split(' ')[0];
  lastName = (n: string) => n.split(' ').slice(1).join(' ');
}
