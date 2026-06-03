import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';
import { Snippet } from '../../models/portfolio.model';

@Component({
  selector: 'app-code-hacks',
  standalone: true,
  imports: [LocalizePipe],
  template: `
    <section id="code" class="relative mx-auto max-w-5xl px-6 py-14">
      <div class="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-teal">04 / Lab</div>
      <h2 class="mb-1 mt-3 font-display text-[clamp(1.7rem,4vw,2.5rem)] font-bold tracking-tight">
        {{ ui()?.sections?.codeHacksTitle | localize }}
      </h2>
      <p class="mb-2 text-muted">{{ ui()?.sections?.codeHacksSubtitle | localize }}</p>

      <!-- Search -->
      <div class="mt-7 flex flex-wrap items-center gap-3">
        <div class="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
          <input
            type="text"
            [value]="query()"
            (input)="query.set($any($event.target).value)"
            [placeholder]="ui()?.codeHacks?.searchPlaceholder | localize"
            class="flex-1 border-0 bg-transparent text-[15px] text-text outline-none placeholder:text-dim"
          />
        </div>
      </div>

      <!-- Tag filters -->
      <div class="mt-4 flex flex-wrap gap-2">
        @for (tag of tags(); track tag) {
          <button
            type="button"
            (click)="activeTag.set(tag)"
            [class.bg-grad]="activeTag() === tag"
            [class.text-\[\#06121f\]]="activeTag() === tag"
            [class.border-transparent]="activeTag() === tag"
            class="cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs font-medium text-muted transition hover:text-text"
          >
            {{ tag === 'all' ? (ui()?.codeHacks?.all | localize) : '#' + tag }}
          </button>
        }
      </div>

      <!-- Results -->
      @if (filtered().length) {
        <div class="mt-6 grid grid-cols-1 gap-[18px] md:grid-cols-2">
          @for (s of filtered(); track s.id) {
            <div class="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              <div class="border-b border-border p-[18px]">
                <h3 class="font-display text-[15.5px] font-semibold">{{ s.title }}</h3>
                <p class="mt-1 text-[13px] text-muted">{{ s.summary | localize }}</p>
                <div class="mt-2.5 flex flex-wrap gap-1.5 font-mono text-[11px] text-teal">
                  @for (t of s.tags; track t) { <span>#{{ t }}</span> }
                </div>
              </div>
              <div class="codebox relative">
                <span class="absolute right-[54px] top-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-dim">{{ s.language }}</span>
                <button
                  type="button"
                  (click)="copy(s)"
                  [title]="ui()?.codeHacks?.copy | localize"
                  class="absolute right-2.5 top-2.5 grid h-[30px] w-[34px] place-items-center rounded-lg border border-[#243352] bg-[#0f1a30] text-muted transition hover:border-teal hover:text-teal"
                  [class.text-teal]="copiedId() === s.id"
                >
                  @if (copiedId() === s.id) {
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" /></svg>
                  } @else {
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></svg>
                  }
                </button>
                <pre class="m-0 overflow-auto p-[18px] font-mono text-[12.5px] leading-[1.7] text-[#cdd9f3]"><code [innerHTML]="highlight(s.code)"></code></pre>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="mt-6 py-10 text-center text-muted">{{ ui()?.codeHacks?.noResults | localize }}</div>
      }
    </section>
  `,
  styles: [
    `
      .codebox { background: var(--bg2); }
      :host-context(html[data-theme='light']) .codebox { background: #0d1830; }
    `,
  ],
})
export class CodeHacksComponent {
  svc = inject(PortfolioService);
  private sanitizer = inject(DomSanitizer);
  ui = this.svc.ui;

  query = signal('');
  activeTag = signal('all');
  copiedId = signal<string | null>(null);

  /** Unique tags across all snippets, prefixed with the "all" pseudo-tag. */
  tags = computed(() => {
    const set = new Set<string>();
    this.svc.snippets().forEach((s) => s.tags.forEach((t) => set.add(t)));
    return ['all', ...set];
  });

  /** Reactive search + tag filtering — recomputes when query/tag/locale change. */
  filtered = computed<Snippet[]>(() => {
    const q = this.query().toLowerCase().trim();
    const tag = this.activeTag();
    const loc = this.svc.locale();
    return this.svc.snippets().filter((s) => {
      const tagOk = tag === 'all' || s.tags.includes(tag);
      const haystack = `${s.title} ${s.summary[loc]} ${s.tags.join(' ')} ${s.code}`.toLowerCase();
      return tagOk && haystack.includes(q);
    });
  });

  async copy(s: Snippet): Promise<void> {
    try {
      await navigator.clipboard.writeText(s.code);
    } catch {}
    this.copiedId.set(s.id);
    setTimeout(() => this.copiedId.set(null), 1400);
  }

  /**
   * Lightweight single-pass syntax highlighter.
   * One combined regex with alternation so injected <span class="..."> markup
   * is never re-scanned (a multi-pass approach corrupts on its own `class=`).
   */
  highlight(code: string): SafeHtml {
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const re =
      /(#[^\n]*|\/\/[^\n]*)|('[^']*'|"[^"]*"|`[^`]*`)|\b(import|from|export|function|return|const|let|var|class|new|public|private|filter|orderBy)\b|\b(\d+)\b/g;
    const html = escaped.replace(re, (m, com, str, kw, num) => {
      if (com) return `<span class="tk-com">${com}</span>`;
      if (str) return `<span class="tk-str">${str}</span>`;
      if (kw) return `<span class="tk-key">${kw}</span>`;
      if (num) return `<span class="tk-num">${num}</span>`;
      return m;
    });
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
