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
      <header id="home" class="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
        <div class="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_320px]">

          <!-- Left: text content -->
          <div>
            <div class="mb-5 font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-muted">
              {{ ui()?.hero?.greeting | localize }}
            </div>

            <h1 class="font-display font-extrabold leading-[1.0] tracking-tight" style="font-size:clamp(3rem,8vw,5.5rem)">
              {{ firstName(p.name) }}<br>
              <span class="grad-text">{{ lastName(p.name) }}</span>
            </h1>

            <div class="mt-5 font-display font-semibold opacity-90" style="font-size:clamp(1rem,2.4vw,1.4rem)">
              {{ p.headline | localize }}
            </div>

            <p class="mt-4 max-w-[540px] text-[15px] leading-relaxed text-muted">{{ p.tagline | localize }}</p>

            <!-- Stats row -->
            <div class="mt-8 flex flex-wrap items-center gap-0">
              <div class="pr-6">
                <div class="grad-text font-display text-[2rem] font-extrabold leading-none">11+</div>
                <div class="mt-1 text-[11px] font-medium uppercase tracking-wider text-dim">Years building</div>
              </div>
              <div class="border-l border-border px-6">
                <div class="grad-text font-display text-[2rem] font-extrabold leading-none">1.5M+</div>
                <div class="mt-1 text-[11px] font-medium uppercase tracking-wider text-dim">Users served</div>
              </div>
              <div class="border-l border-border pl-6">
                <div class="grad-text font-display text-[2rem] font-extrabold leading-none">64</div>
                <div class="mt-1 text-[11px] font-medium uppercase tracking-wider text-dim">TPS peak load</div>
              </div>
            </div>

            <!-- CTAs -->
            <div class="mt-9 flex flex-wrap gap-3.5">
              <a [href]="p.resumeUrl" download class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                </svg>
                {{ ui()?.hero?.downloadResume | localize }}
              </a>
              <a href="#contact" class="btn btn-ghost">{{ ui()?.hero?.contactMe | localize }}</a>
            </div>

            <!-- Skills -->
            <div class="mt-9 flex max-w-2xl flex-wrap gap-2">
              @for (skill of p.skills; track skill) {
                <span
                  class="rounded-lg border bg-surface px-2.5 py-1.5 text-xs font-medium transition-transform duration-150 hover:-translate-y-0.5"
                  [class.text-teal]="isHot(skill)"
                  [class.border-border]="!isHot(skill)"
                  [class.text-muted]="!isHot(skill)"
                  [style.border-color]="isHot(skill) ? 'color-mix(in srgb, var(--teal) 40%, var(--border))' : null"
                >{{ skill }}</span>
              }
            </div>
          </div>

          <!-- Right: portrait -->
          <div class="hidden lg:flex lg:justify-center">
            <div class="portrait-blob">
              <img
                src="assets/images/profile.svg"
                alt="Christopher Fernandes — portrait placeholder"
                class="portrait-img"
              >
            </div>
          </div>

        </div>
      </header>
    }
  `,
  styles: [`
    .portrait-blob {
      position: relative;
      width: 300px;
      height: 300px;
      border-radius: 42% 58% 52% 48% / 46% 42% 58% 54%;
      padding: 3px;
      background: var(--grad);
      animation: morph 9s ease-in-out infinite;
      flex-shrink: 0;
    }
    .portrait-blob::before {
      content: '';
      position: absolute;
      inset: -14px;
      border-radius: inherit;
      background: var(--grad);
      opacity: 0.12;
      filter: blur(22px);
      animation: morph 9s ease-in-out infinite reverse;
    }
    .portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
      background: var(--surface);
      display: block;
    }
    @keyframes morph {
      0%,100% { border-radius: 42% 58% 52% 48% / 46% 42% 58% 54%; }
      33%      { border-radius: 56% 44% 38% 62% / 60% 56% 44% 40%; }
      66%      { border-radius: 48% 52% 62% 38% / 54% 60% 40% 46%; }
    }
  `],
})
export class HeroComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;

  isHot = (s: string) => HOT.has(s);
  firstName = (n: string) => n.split(' ')[0];
  lastName = (n: string) => n.split(' ').slice(1).join(' ');
}
