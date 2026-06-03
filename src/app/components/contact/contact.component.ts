import { Component, inject } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [LocalizePipe],
  template: `
    @if (svc.profile(); as p) {
      <section id="contact" class="relative mx-auto max-w-5xl px-6 py-14">
        <div class="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-teal">05 / Connect</div>
        <h2 class="mb-1 mt-3 font-display text-[clamp(1.7rem,4vw,2.5rem)] font-bold tracking-tight">
          {{ ui()?.sections?.contactTitle | localize }}
        </h2>

        <div class="mt-7 rounded-[20px] border border-border bg-surface p-10 text-center shadow-card">
          <p class="mx-auto mb-6 mt-3.5 max-w-[520px] text-muted">{{ ui()?.contact?.intro | localize }}</p>
          <a [href]="'mailto:' + p.email" class="btn btn-primary inline-flex">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
            </svg>
            {{ ui()?.contact?.emailMe | localize }}
          </a>
          <div class="mt-6 flex flex-wrap justify-center gap-3">
            @for (s of p.socials; track s.platform) {
              <a [href]="s.url" target="_blank" rel="noopener" class="btn btn-ghost" style="padding:11px 16px">{{ s.platform }}</a>
            }
          </div>
        </div>

        <footer class="mt-12 border-t border-border py-7 text-center text-[13px] text-dim">
          {{ ui()?.footer?.builtWith | localize }} · © {{ year }} {{ p.name }}
        </footer>
      </section>
    }
  `,
})
export class ContactComponent {
  svc = inject(PortfolioService);
  ui = this.svc.ui;
  year = new Date().getFullYear();
}
