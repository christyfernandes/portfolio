import { Component, OnInit, inject } from '@angular/core';
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
        <app-timeline />
        <app-projects />
        <app-code-hacks />
        <app-contact />
      </main>
    }
  `,
})
export class AppComponent implements OnInit {
  svc = inject(PortfolioService);

  ngOnInit(): void {
    this.svc.load();
  }
}
