import { Component, inject, signal, HostListener } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';
import { Project } from '../../models/portfolio.model';

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
      <p class="mb-9 mt-2 text-sm text-muted">Click any project to explore details, my role, and key contributions.</p>

      <div class="mt-2 grid grid-cols-1 gap-[18px] md:grid-cols-2">
        @for (p of svc.projects(); track p.id) {
          <div
            class="proj group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface p-[22px] shadow-card transition hover:-translate-y-1"
            [class.md:col-span-2]="p.featured"
            (click)="selected.set(p)"
          >
            <div class="flex items-start justify-between gap-4">
              <h3 class="flex items-center gap-2.5 font-display text-[19px] font-bold">
                @if (p.featured) { <span class="text-teal">★</span> }
                {{ p.title }}
              </h3>
              <span class="mt-1 flex-none rounded-md border border-border bg-surface2 px-2 py-1 font-mono text-[10px] text-dim">
                {{ p.period }}
              </span>
            </div>

            <p class="mt-3 text-[14.5px] leading-relaxed text-muted">{{ p.description | localize }}</p>

            <div class="mt-3.5 flex flex-wrap gap-1.5">
              @for (t of p.tech; track t) {
                <span class="rounded-md border border-border bg-surface2 px-2 py-1.5 font-mono text-[11px] text-muted">{{ t }}</span>
              }
            </div>

            <div class="mt-4 flex items-center justify-between">
              <div class="flex gap-3.5">
                @if (p.live) {
                  <a [href]="p.live" target="_blank" rel="noopener"
                    class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:underline"
                    (click)="$event.stopPropagation()">↗ Live</a>
                }
                @if (p.repo) {
                  <a [href]="p.repo" target="_blank" rel="noopener"
                    class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-teal hover:underline"
                    (click)="$event.stopPropagation()">⌥ Code</a>
                }
              </div>
              <span class="text-xs text-dim opacity-0 transition-opacity group-hover:opacity-100">View details →</span>
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Project detail panel -->
    @if (selected(); as proj) {
      <div
        class="panel-backdrop fixed inset-0 z-50 flex justify-end"
        style="background:rgba(7,11,22,0.75);backdrop-filter:blur(4px)"
        (click)="closeOnBackdrop($event)"
      >
        <div class="panel-sheet relative flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-border bg-surface shadow-2xl">

          <!-- Header bar -->
          <div class="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-8 py-5">
            <div>
              <div class="flex items-center gap-2.5">
                @if (proj.featured) { <span class="text-teal text-lg">★</span> }
                <h2 class="font-display text-xl font-bold">{{ proj.title }}</h2>
              </div>
              <span class="font-mono text-xs text-dim">{{ proj.period }}</span>
            </div>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted transition hover:border-teal hover:text-teal"
              (click)="selected.set(null)"
              aria-label="Close"
            >✕</button>
          </div>

          <!-- Content -->
          <div class="flex-1 px-8 py-6 space-y-8">

            <!-- Description -->
            <div>
              <div class="panel-label">Overview</div>
              <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ proj.description | localize }}</p>
            </div>

            <!-- My Role -->
            @if (proj.myRole) {
              <div>
                <div class="panel-label">My Role</div>
                <p class="mt-2 text-[15px] leading-relaxed text-muted">{{ proj.myRole | localize }}</p>
              </div>
            }

            <!-- Highlights -->
            @if (proj.highlights?.length) {
              <div>
                <div class="panel-label">Key Contributions</div>
                <ul class="mt-3 space-y-2.5">
                  @for (h of proj.highlights; track $index) {
                    <li class="flex gap-3 text-[14.5px] text-muted">
                      <span class="mt-0.5 flex-none text-teal">▹</span>
                      <span>{{ h | localize }}</span>
                    </li>
                  }
                </ul>
              </div>
            }

            <!-- Screenshots placeholder -->
            @if (proj.screenshots && proj.screenshots.length > 0) {
              <div>
                <div class="panel-label">Screenshots</div>
                <div class="mt-3 grid grid-cols-2 gap-3">
                  @for (s of proj.screenshots; track s) {
                    <img [src]="s" [alt]="proj.title + ' screenshot'" class="rounded-xl border border-border object-cover w-full aspect-video bg-surface2">
                  }
                </div>
              </div>
            }

            <!-- Tech stack -->
            <div>
              <div class="panel-label">Tech Stack</div>
              <div class="mt-3 flex flex-wrap gap-2">
                @for (t of proj.tech; track t) {
                  <span class="rounded-md border border-border bg-surface2 px-3 py-1.5 font-mono text-[12px] text-muted">{{ t }}</span>
                }
              </div>
            </div>

            <!-- Links -->
            @if (proj.live || proj.repo) {
              <div class="flex gap-3.5 pt-2 pb-4">
                @if (proj.live) {
                  <a [href]="proj.live" target="_blank" rel="noopener" class="btn btn-primary">↗ View Live</a>
                }
                @if (proj.repo) {
                  <a [href]="proj.repo" target="_blank" rel="noopener" class="btn btn-ghost">⌥ View Code</a>
                }
              </div>
            }

          </div>
        </div>
      </div>
    }
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
      .proj:hover::after { opacity: 1; }
      .panel-label {
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--teal);
      }
    `,
  ],
})
export class ProjectsComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;
  selected = signal<Project | null>(null);

  closeOnBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) this.selected.set(null);
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.selected.set(null); }
}
