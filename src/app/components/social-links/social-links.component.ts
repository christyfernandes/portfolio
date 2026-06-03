import { Component, inject, signal, OnDestroy, afterNextRender } from '@angular/core';
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
    <!--
      Top-right horizontal row — visible while the hero section is on screen.
      Fades + slides down from above when it enters.
    -->
    <div class="socials-top" [class.show]="heroInView()">
      @for (s of svc.profile()?.socials || []; track s.platform) {
        <a
          [href]="s.url"
          target="_blank"
          rel="noopener"
          [title]="s.platform"
          class="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted transition-[transform,border-color,color] duration-150 hover:-translate-y-1 hover:border-teal hover:text-teal [&>svg]:h-[18px] [&>svg]:w-[18px]"
          [innerHTML]="icon(s.icon)"
        ></a>
      }
    </div>

    <!--
      Left sidebar vertical column — slides in from the left once the hero
      has scrolled out of view.
    -->
    <div class="socials-side" [class.show]="!heroInView()">
      @for (s of svc.profile()?.socials || []; track s.platform) {
        <a
          [href]="s.url"
          target="_blank"
          rel="noopener"
          [title]="s.platform"
          class="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface text-muted transition-[transform,border-color,color] duration-150 hover:-translate-y-1 hover:border-teal hover:text-teal [&>svg]:h-[18px] [&>svg]:w-[18px]"
          [innerHTML]="icon(s.icon)"
        ></a>
      }
    </div>
  `,
  styles: [`
    /* Neither group is visible below xl — same as before */
    .socials-top,
    .socials-side {
      display: none;
    }

    @media (min-width: 1280px) {
      /* ── Top-right row ─────────────────────────────────── */
      .socials-top {
        display: flex;
        position: fixed;
        /* Align right edge with the navbar's inner-right edge:
           navbar is max-w-5xl (1024 px) + px-6 (24 px) centred,
           so its right edge sits at (50vw + 488 px) from the left,
           i.e. (50vw - 488 px) from the viewport right. */
        right: max(24px, calc(50vw - 488px));
        top: 76px;     /* 12 px clear below the ~64 px navbar */
        z-index: 40;
        flex-direction: row;
        gap: 10px;

        /* Default = hidden, slides up out of view */
        opacity: 0;
        transform: translateY(-16px);
        pointer-events: none;
        transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .socials-top.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      /* ── Left sidebar ──────────────────────────────────── */
      .socials-side {
        display: flex;
        position: fixed;
        /* Push far enough left so it doesn't crowd the max-w-6xl hero:
           hero left edge ≈ (50vw - 552 px); sidebar at (50vw - 660 px)
           leaves ~108 px gap on a 1440 px screen. */
        left: max(18px, calc(50vw - 660px));
        top: 50%;
        z-index: 40;
        flex-direction: column;
        gap: 14px;

        /* Default = hidden, parked off to the left */
        opacity: 0;
        transform: translateX(-56px) translateY(-50%);
        pointer-events: none;
        transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .socials-side.show {
        opacity: 1;
        transform: translateX(0) translateY(-50%);
        pointer-events: auto;
      }
    }
  `],
})
export class SocialLinksComponent implements OnDestroy {
  svc = inject(PortfolioService);
  private sanitizer = inject(DomSanitizer);

  heroInView = signal(true);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      const hero = document.querySelector('#home');
      if (!hero) return;
      this.observer = new IntersectionObserver(
        ([entry]) => this.heroInView.set(entry.isIntersecting),
        { threshold: 0.05 },
      );
      this.observer.observe(hero);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  icon(key: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[key] ?? ICONS['mail']);
  }
}
