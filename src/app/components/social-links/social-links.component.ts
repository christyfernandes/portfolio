import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PortfolioService } from '../../services/portfolio.service';

const ICONS: Record<string, string> = {
  github:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.5-2.5-.3-5.2-1.3-5.2-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11 11 0 016 0C17 5.5 18 5.8 18 5.8c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5V9h3zM6.5 7.7a1.8 1.8 0 110-3.5 1.8 1.8 0 010 3.5zM19 19h-3v-5.3c0-3.6-4-3.3-4 0V19h-3V9h3v1.8c1.4-2.6 7-2.8 7 2.5z"/></svg>',
  medium:
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.8 7.3a.9.9 0 00-.3-.8L.7 4.4V4h5.7l4.4 9.6L14.9 4H20v.4l-1.5 1.5a.4.4 0 00-.2.4v11.4a.4.4 0 00.2.4l1.5 1.5v.4h-7.4v-.4l1.5-1.5c.2-.2.2-.2.2-.4V8.2l-4.3 10.9h-.6L4.5 8.2v7.3c0 .4 0 .7.3 1l2 2.4v.4H1v-.4l2-2.4a1 1 0 00.3-1z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
};

@Component({
  selector: 'app-social-links',
  standalone: true,
  template: `
    <div
      class="fixed top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3.5 xl:flex"
      [style.left]="'max(18px, calc(50vw - 600px))'"
    >
      @for (s of svc.profile()?.socials || []; track s.platform) {
        <a
          [href]="s.url"
          target="_blank"
          rel="noopener"
          [title]="s.platform"
          class="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted transition hover:-translate-y-1 hover:border-teal hover:text-teal [&>svg]:h-[18px] [&>svg]:w-[18px]"
          [innerHTML]="icon(s.icon)"
        ></a>
      }
    </div>
  `,
})
export class SocialLinksComponent {
  svc = inject(PortfolioService);
  private sanitizer = inject(DomSanitizer);

  icon(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[key] ?? ICONS['mail']);
  }
}
