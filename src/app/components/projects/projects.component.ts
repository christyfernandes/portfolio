import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [LocalizePipe],
  template: `
    <section id="projects" class="relative mx-auto max-w-5xl px-6 py-14">
      <div class="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-teal">03 / Work</div>
      <h2 class="mb-1 mt-3 font-display text-[clamp(1.7rem,4vw,2.5rem)] font-bold tracking-tight">
        {{ ui()?.sections?.projectsTitle | localize }}
      </h2>

      <div class="mt-9 grid grid-cols-1 gap-[18px] md:grid-cols-2">
        @for (p of svc.projects(); track p.id) {
          <div
            class="proj group relative overflow-hidden rounded-2xl border border-border bg-surface p-[22px] shadow-card transition hover:-translate-y-1"
            [class.md:col-span-2]="p.featured"
          >
            <h3 class="flex items-center gap-2.5 font-display text-[19px] font-bold">
              @if (p.featured) { <span class="text-teal">★</span> }
              {{ p.title }}
            </h3>
            <span class="mb-2.5 mt-1.5 block font-mono text-xs text-dim">{{ p.period }}</span>
            <p class="text-[14.5px] text-muted">{{ p.description | localize }}</p>
            <div class="mt-3.5 flex flex-wrap gap-1.5">
              @for (t of p.tech; track t) {
                <span class="rounded-md border border-border bg-surface2 px-2 py-1.5 font-mono text-[11px] text-muted">{{ t }}</span>
              }
            </div>
            @if (p.live || p.repo) {
              <div class="mt-3.5 flex gap-3.5">
                @if (p.live) {
                  <a [href]="p.live" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:underline">↗ Live</a>
                }
                @if (p.repo) {
                  <a [href]="p.repo" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:underline">⌥ Code</a>
                }
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .proj::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 1rem;
        padding: 1px;
        opacity: 0;
        transition: 0.25s;
        background: var(--grad);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }
      .proj:hover::after {
        opacity: 1;
      }
    `,
  ],
})
export class ProjectsComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;
}
