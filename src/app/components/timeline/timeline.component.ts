import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe, MdBoldPipe } from '../../shared/localize.pipe';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [LocalizePipe, MdBoldPipe],
  template: `
    <section id="experience" class="relative mx-auto max-w-5xl px-6 py-14">
      <div class="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-teal">02 / Journey</div>
      <h2 class="mb-1 mt-3 font-display text-[clamp(1.7rem,4vw,2.5rem)] font-bold tracking-tight">
        {{ ui()?.sections?.experienceTitle | localize }}
      </h2>

      <div class="tl relative mt-9 pl-9">
        @for (e of svc.experience(); track e.id) {
          <div class="node relative mb-8">
            <div class="rounded-2xl border border-border bg-surface p-6 shadow-card">
              <div class="flex flex-wrap items-baseline gap-2">
                <span class="font-display text-lg font-bold">{{ e.role | localize }}</span>
                <span class="font-semibold text-teal">&#64; {{ e.company }}</span>
                @if (e.current) {
                  <span class="rounded-md bg-teal px-2 py-1 text-[11px] font-semibold text-[#06121f]">NOW</span>
                }
                <span class="ml-auto font-mono text-xs text-dim">{{ e.period }}</span>
              </div>
              <div class="my-3 text-[15px] text-muted">{{ e.summary | localize }}</div>
              <ul class="flex list-none flex-col gap-2">
                @for (h of e.highlights; track $index) {
                  <li class="relative pl-5 text-[14.5px] before:absolute before:left-0 before:text-teal before:content-['▹'] [&_strong]:font-semibold [&_strong]:text-text"
                      [innerHTML]="(h | localize) | mdBold"></li>
                }
              </ul>
              <div class="mt-3.5 flex flex-wrap gap-1.5">
                @for (t of e.tech; track t) {
                  <span class="rounded-md border border-border bg-surface2 px-2 py-1.5 font-mono text-[11px] text-muted">{{ t }}</span>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .tl::before {
        content: '';
        position: absolute;
        left: 9px;
        top: 6px;
        bottom: 6px;
        width: 2px;
        background: linear-gradient(var(--teal), var(--indigo), var(--violet));
        opacity: 0.5;
      }
      .node::before {
        content: '';
        position: absolute;
        left: -33px;
        top: 5px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--bg);
        border: 2px solid var(--teal);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--teal) 18%, transparent);
      }
    `,
  ],
})
export class TimelineComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;
}
