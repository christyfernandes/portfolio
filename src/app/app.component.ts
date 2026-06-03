import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, inject } from '@angular/core';
import { PortfolioService } from './services/portfolio.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SocialLinksComponent } from './components/social-links/social-links.component';
import { HeroComponent } from './components/hero/hero.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CodeHacksComponent } from './components/code-hacks/code-hacks.component';
import { ContactComponent } from './components/contact/contact.component';
import { ScifiViewComponent } from './components/scifi-view/scifi-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent,
    SocialLinksComponent,
    HeroComponent,
    TimelineComponent,
    ProjectsComponent,
    CodeHacksComponent,
    ContactComponent,
    ScifiViewComponent,
  ],
  template: `
    @if (svc.viewMode() === 'scifi') {
      <app-scifi-view />
    } @else {
      <app-navbar />
      <app-social-links />
      <main class="relative z-[1]">
        <app-hero />
        <app-timeline class="reveal" />
        <app-projects class="reveal" />
        <app-code-hacks class="reveal" />
        <app-contact class="reveal" />
      </main>
    }
  `,
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  svc = inject(PortfolioService);
  private zone = inject(NgZone);

  private revealIO?: IntersectionObserver;
  private mutationObs?: MutationObserver;

  ngOnInit(): void {
    this.svc.load();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // IntersectionObserver — adds .visible when element enters viewport
      this.revealIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              this.revealIO!.unobserve(e.target);
            }
          });
        },
        { threshold: 0.06, rootMargin: '0px 0px -40px 0px' },
      );

      const observe = () => {
        document.querySelectorAll('.reveal:not(.reveal-tracked)').forEach((el) => {
          el.classList.add('reveal-tracked');
          this.revealIO!.observe(el);
        });
      };

      // MutationObserver catches .reveal elements added after data loads
      this.mutationObs = new MutationObserver(observe);
      this.mutationObs.observe(document.body, { childList: true, subtree: true });
      observe();
    });
  }

  ngOnDestroy(): void {
    this.revealIO?.disconnect();
    this.mutationObs?.disconnect();
  }
}
