import {
  Component,
  inject,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe, MdBoldPipe } from '../../shared/localize.pipe';
import { SUPPORTED_LOCALES } from '../../models/portfolio.model';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  hue: number;
}

const HOT = new Set([
  'Apache Kafka',
  'Apache Flink',
  'Apache Druid',
  'PySpark',
  'AI-Assisted Dev (Claude, Copilot)',
]);

@Component({
  selector: 'app-scifi-view',
  standalone: true,
  imports: [LocalizePipe, MdBoldPipe],
  template: `
    <!-- Particle canvas background -->
    <canvas #bgCanvas class="bg-canvas"></canvas>
    <!-- CRT scanline overlay -->
    <div class="scanlines"></div>

    <!-- ── HUD Header ──────────────────────────────── -->
    <header class="hud-header">
      <div class="hud-inner">
        <div class="hud-logo">
          <span class="bracket">[</span>
          <span class="logo-id">{{ svc.profile()?.initials || 'CF' }}</span>
          <span class="bracket">]</span>
        </div>

        <nav class="hud-nav">
          <a href="#sf-home"     class="hud-link">HOME</a>
          <a href="#sf-exp"      class="hud-link">EXPERIENCE</a>
          <a href="#sf-projects" class="hud-link">PROJECTS</a>
          <a href="#sf-contact"  class="hud-link">CONTACT</a>
        </nav>

        <div class="hud-controls">
          <div class="locale-switcher">
            @for (loc of locales; track loc.code) {
              <button
                type="button"
                (click)="svc.setLocale(loc.code)"
                [class.active]="svc.locale() === loc.code"
                class="locale-btn"
              >{{ loc.label }}</button>
            }
          </div>

          <button
            type="button"
            (click)="svc.toggleViewMode()"
            class="mode-btn"
            title="Classic view"
            aria-label="Switch to classic view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- ── Main content ────────────────────────────── -->
    <main class="sf-main">

      <!-- ── HERO ── -->
      @if (svc.profile(); as p) {
        <section id="sf-home" class="sf-hero">
          <div class="orb orb-a"></div>
          <div class="orb orb-b"></div>
          <div class="orb orb-c"></div>

          <div class="hero-inner">

            @if (p.status.available) {
              <div class="status-badge">
                <span class="status-dot"></span>
                <span>{{ p.status.label | localize }}</span>
              </div>
            }

            <div class="hero-eyebrow">SYSTEM.IDENTIFY</div>

            <h1 class="hero-name">
              <span class="name-first">{{ firstName(p.name) }}</span>
              <span class="name-last">{{ lastName(p.name) }}</span>
            </h1>

            <p class="hero-headline">{{ p.headline | localize }}</p>
            <p class="hero-tagline">{{ p.tagline | localize }}</p>

            <div class="hero-stats">
              <div class="stat">
                <div class="stat-val">11+</div>
                <div class="stat-lbl">YEARS BUILD</div>
              </div>
              <div class="stat-divider">//</div>
              <div class="stat">
                <div class="stat-val">1.5M+</div>
                <div class="stat-lbl">USERS SERVED</div>
              </div>
              <div class="stat-divider">//</div>
              <div class="stat">
                <div class="stat-val">64 TPS</div>
                <div class="stat-lbl">PEAK LOAD</div>
              </div>
            </div>

            <div class="hero-ctas">
              <a [href]="p.resumeUrl" download class="btn-primary">
                <span>▼</span>
                {{ ui()?.hero?.downloadResume | localize }}
              </a>
              <a href="#sf-contact" class="btn-ghost">
                {{ ui()?.hero?.contactMe | localize }}
              </a>
            </div>

            <div class="skill-cloud">
              @for (skill of p.skills; track skill) {
                <span class="skill-tag" [class.hot]="isHot(skill)">{{ skill }}</span>
              }
            </div>
          </div>
        </section>
      }

      <!-- ── EXPERIENCE ── -->
      <section id="sf-exp" class="sf-section">
        <div class="eyebrow">02 / NEURAL.LOG</div>
        <h2 class="sec-title">{{ ui()?.sections?.experienceTitle | localize }}</h2>

        <div class="timeline">
          @for (e of svc.experience(); track e.id; let last = $last) {
            <div class="tl-row">
              <div class="tl-rail">
                <div class="tl-dot"></div>
                @if (!last) { <div class="tl-line"></div> }
              </div>

              <div class="glass tl-card">
                <div class="card-top">
                  <div>
                    <div class="card-role">{{ e.role | localize }}</div>
                    <div class="card-company">&#64; {{ e.company }}</div>
                  </div>
                  <div class="card-meta">
                    @if (e.current) {
                      <span class="badge-now">● NOW</span>
                    }
                    <span class="card-period">{{ e.period }}</span>
                  </div>
                </div>

                <p class="card-summary">{{ e.summary | localize }}</p>

                <ul class="highlights">
                  @for (h of e.highlights; track $index) {
                    <li [innerHTML]="(h | localize) | mdBold"></li>
                  }
                </ul>

                <div class="tech-row">
                  @for (t of e.tech; track t) {
                    <span class="tech-tag">{{ t }}</span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ── PROJECTS ── -->
      <section id="sf-projects" class="sf-section">
        <div class="eyebrow">03 / MISSION.FILES</div>
        <h2 class="sec-title">{{ ui()?.sections?.projectsTitle | localize }}</h2>

        <div class="proj-grid">
          @for (proj of svc.projects(); track proj.id) {
            <div class="glass proj-card" [class.featured]="proj.featured">
              <div class="proj-head">
                @if (proj.featured) {
                  <span class="proj-badge">FEATURED</span>
                }
                <span class="proj-period">{{ proj.period }}</span>
              </div>

              <h3 class="proj-title">{{ proj.title }}</h3>
              <p class="proj-desc">{{ proj.description | localize }}</p>

              @if (proj.myRole) {
                <p class="proj-role">
                  <span class="role-lbl">ROLE:</span>
                  {{ proj.myRole | localize }}
                </p>
              }

              <div class="tech-row">
                @for (t of proj.tech; track t) {
                  <span class="tech-tag">{{ t }}</span>
                }
              </div>

              <div class="proj-links">
                @if (proj.repo) {
                  <a [href]="proj.repo" target="_blank" rel="noopener" class="proj-link">↗ REPO</a>
                }
                @if (proj.live) {
                  <a [href]="proj.live" target="_blank" rel="noopener" class="proj-link accent">↗ LIVE</a>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- ── CONTACT ── -->
      @if (svc.profile(); as p) {
        <section id="sf-contact" class="sf-contact">
          <div class="eyebrow">04 / ESTABLISH.LINK</div>
          <h2 class="contact-title">{{ ui()?.sections?.contactTitle | localize }}</h2>
          <p class="contact-intro">{{ ui()?.contact?.intro | localize }}</p>

          <div class="contact-ctas">
            <a [href]="'mailto:' + p.email" class="btn-primary">
              <span>✉</span>
              {{ ui()?.contact?.emailMe | localize }}
            </a>
          </div>

          <div class="social-row">
            @for (s of p.socials; track s.platform) {
              <a [href]="s.url" target="_blank" rel="noopener" class="social-pill">
                {{ s.platform }}
              </a>
            }
          </div>

          <div class="sf-footer">
            <span>{{ ui()?.footer?.builtWith | localize }}</span>
          </div>
        </section>
      }

    </main>
  `,
  styles: [`
    /* ─── Host / reset ──────────────────────────── */
    :host {
      display: block;
      position: relative;
      min-height: 100vh;
      background: #000814;
      color: #bdd5f0;
      font-family: 'IBM Plex Sans', 'Inter', sans-serif;
      overflow-x: hidden;
    }

    /* ─── Canvas + scanlines ─────────────────────── */
    .bg-canvas {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }
    .scanlines {
      position: fixed;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.022) 3px,
        rgba(0,0,0,0.022) 4px
      );
    }

    /* ─── HUD Header ─────────────────────────────── */
    .hud-header {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      background: rgba(0, 4, 18, 0.72);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid rgba(0, 210, 255, 0.1);
    }
    .hud-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 10px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .hud-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 17px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .bracket { color: rgba(0, 210, 255, 0.4); }
    .logo-id {
      color: #00d4ff;
      text-shadow: 0 0 14px rgba(0, 212, 255, 0.55);
    }
    .hud-nav {
      display: none;
      gap: 2px;
      margin-left: 12px;
    }
    @media (min-width: 768px) { .hud-nav { display: flex; } }
    .hud-link {
      padding: 6px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: rgba(150, 190, 240, 0.5);
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .hud-link:hover {
      color: #00d4ff;
      background: rgba(0, 212, 255, 0.06);
      text-shadow: 0 0 10px rgba(0, 212, 255, 0.4);
    }
    .hud-controls {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .locale-switcher {
      display: flex;
      background: rgba(0, 212, 255, 0.04);
      border: 1px solid rgba(0, 212, 255, 0.12);
      border-radius: 8px;
      padding: 3px;
      gap: 2px;
    }
    .locale-btn {
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      border-radius: 5px;
      border: none;
      background: transparent;
      color: rgba(150, 190, 240, 0.45);
      cursor: pointer;
      transition: all 0.18s;
    }
    .locale-btn.active {
      background: rgba(0, 212, 255, 0.14);
      color: #00d4ff;
      text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
    }
    .mode-btn {
      width: 34px; height: 34px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      border: 1px solid rgba(0, 212, 255, 0.18);
      background: rgba(0, 212, 255, 0.04);
      color: rgba(0, 212, 255, 0.7);
      cursor: pointer;
      transition: all 0.2s;
    }
    .mode-btn:hover {
      border-color: rgba(0, 212, 255, 0.45);
      background: rgba(0, 212, 255, 0.1);
      box-shadow: 0 0 14px rgba(0, 212, 255, 0.18);
      color: #00d4ff;
    }

    /* ─── Main wrapper ───────────────────────────── */
    .sf-main { position: relative; z-index: 2; padding-top: 56px; }

    /* ─── Hero ───────────────────────────────────── */
    .sf-hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 24px 60px;
      position: relative;
      overflow: hidden;
    }
    /* Ambient orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(90px);
    }
    .orb-a {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(0,90,255,0.07), transparent 70%);
      top: -160px; right: -240px;
      animation: orb-drift 14s ease-in-out infinite;
    }
    .orb-b {
      width: 450px; height: 450px;
      background: radial-gradient(circle, rgba(120,40,240,0.06), transparent 70%);
      bottom: -120px; left: -180px;
      animation: orb-drift 18s ease-in-out infinite reverse;
    }
    .orb-c {
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(0,210,255,0.05), transparent 70%);
      top: 40%; left: 30%;
      animation: orb-drift 11s ease-in-out infinite 3s;
    }
    @keyframes orb-drift {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(28px,-18px) scale(1.06); }
      66%      { transform: translate(-18px,14px) scale(0.94); }
    }

    .hero-inner {
      max-width: 920px;
      width: 100%;
      position: relative;
      z-index: 2;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      border: 1px solid rgba(0,212,255,0.22);
      border-radius: 100px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      color: rgba(0,212,255,0.65);
      background: rgba(0,212,255,0.04);
      margin-bottom: 22px;
      letter-spacing: 0.06em;
    }
    .status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #00ff88;
      box-shadow: 0 0 10px #00ff88;
      animation: blink 2.2s ease-in-out infinite;
    }
    @keyframes blink {
      0%,100% { opacity: 1; box-shadow: 0 0 10px #00ff88; }
      50%      { opacity: 0.4; box-shadow: 0 0 3px #00ff88; }
    }
    .hero-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.32em;
      color: rgba(0,212,255,0.42);
      margin-bottom: 16px;
      text-transform: uppercase;
    }
    .hero-name {
      font-family: 'Sora', 'IBM Plex Sans', sans-serif;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.025em;
      margin-bottom: 26px;
      display: flex;
      flex-direction: column;
    }
    .name-first {
      font-size: clamp(3.2rem, 9vw, 6.5rem);
      color: #ddeeff;
    }
    .name-last {
      font-size: clamp(3.2rem, 9vw, 6.5rem);
      background: linear-gradient(100deg, #00d4ff 0%, #7c3aed 55%, #c084fc 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 28px rgba(0,212,255,0.25));
    }
    .hero-headline {
      font-size: clamp(1rem, 2.4vw, 1.35rem);
      font-weight: 600;
      color: rgba(190, 220, 255, 0.88);
      margin-bottom: 10px;
    }
    .hero-tagline {
      font-size: 14.5px;
      color: rgba(150, 185, 225, 0.55);
      max-width: 520px;
      line-height: 1.75;
      margin-bottom: 36px;
    }

    /* Stats */
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
      margin-bottom: 36px;
    }
    .stat-val {
      font-family: 'Sora', sans-serif;
      font-size: 1.9rem;
      font-weight: 900;
      background: linear-gradient(120deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    .stat-lbl {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.22em;
      color: rgba(90,140,200,0.45);
      margin-top: 5px;
    }
    .stat-divider {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.1rem;
      color: rgba(0,212,255,0.2);
    }

    /* CTAs */
    .hero-ctas {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 11px 24px;
      background: linear-gradient(120deg, rgba(0,212,255,0.12), rgba(124,58,237,0.12));
      border: 1px solid rgba(0,212,255,0.32);
      border-radius: 9px;
      color: #00d4ff;
      font-size: 12.5px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.06em;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.24s;
    }
    .btn-primary:hover {
      background: linear-gradient(120deg, rgba(0,212,255,0.22), rgba(124,58,237,0.22));
      border-color: rgba(0,212,255,0.6);
      box-shadow: 0 0 22px rgba(0,212,255,0.18), 0 0 44px rgba(0,212,255,0.05);
      transform: translateY(-2px);
    }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      padding: 11px 24px;
      border: 1px solid rgba(150,175,240,0.18);
      border-radius: 9px;
      color: rgba(155,195,250,0.65);
      font-size: 12.5px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.06em;
      text-decoration: none;
      transition: all 0.24s;
    }
    .btn-ghost:hover {
      border-color: rgba(155,195,250,0.38);
      color: rgba(155,195,250,0.92);
      background: rgba(155,195,250,0.05);
      transform: translateY(-2px);
    }

    /* Skills */
    .skill-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }
    .skill-tag {
      padding: 4px 11px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      border-radius: 6px;
      border: 1px solid rgba(90,130,200,0.18);
      background: rgba(90,130,200,0.04);
      color: rgba(150,190,240,0.5);
      transition: all 0.18s;
      cursor: default;
    }
    .skill-tag:hover {
      border-color: rgba(0,212,255,0.28);
      color: rgba(0,212,255,0.75);
      background: rgba(0,212,255,0.05);
    }
    .skill-tag.hot {
      border-color: rgba(0,212,255,0.32);
      color: #00d4ff;
      background: rgba(0,212,255,0.06);
      text-shadow: 0 0 9px rgba(0,212,255,0.35);
    }

    /* ─── Section shell ──────────────────────────── */
    .sf-section {
      max-width: 1060px;
      margin: 0 auto;
      padding: 90px 24px;
    }
    .eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3em;
      color: rgba(0,212,255,0.45);
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    .sec-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(1.8rem, 4vw, 2.9rem);
      font-weight: 800;
      color: #ddeeff;
      margin-bottom: 52px;
      letter-spacing: -0.02em;
    }

    /* ─── Glass card ─────────────────────────────── */
    .glass {
      background: rgba(2, 10, 26, 0.62);
      backdrop-filter: blur(22px);
      border: 1px solid rgba(0, 180, 255, 0.1);
      border-radius: 16px;
      box-shadow:
        0 0 0 1px rgba(0,212,255,0.025),
        0 22px 46px rgba(0,0,0,0.45),
        inset 0 1px 0 rgba(255,255,255,0.038);
      transition: border-color 0.3s, box-shadow 0.3s;
    }
    .glass:hover {
      border-color: rgba(0,212,255,0.2);
      box-shadow:
        0 0 0 1px rgba(0,212,255,0.05),
        0 28px 56px rgba(0,0,0,0.5),
        0 0 36px rgba(0,212,255,0.04),
        inset 0 1px 0 rgba(255,255,255,0.055);
    }

    /* ─── Timeline ───────────────────────────────── */
    .timeline { display: flex; flex-direction: column; }
    .tl-row { display: flex; gap: 18px; align-items: flex-start; }
    .tl-rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      padding-top: 22px;
    }
    .tl-dot {
      width: 13px; height: 13px;
      border-radius: 50%;
      background: rgba(0,212,255,0.12);
      border: 2px solid rgba(0,212,255,0.5);
      box-shadow: 0 0 12px rgba(0,212,255,0.3);
      flex-shrink: 0;
    }
    .tl-line {
      width: 2px;
      flex: 1;
      min-height: 28px;
      background: linear-gradient(to bottom, rgba(0,212,255,0.28), rgba(124,58,237,0.28));
      margin: 6px 0;
    }
    .tl-card {
      flex: 1;
      padding: 24px;
      margin-bottom: 22px;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .card-role {
      font-family: 'Sora', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #ddeeff;
    }
    .card-company {
      font-size: 14px;
      font-weight: 600;
      color: rgba(0,212,255,0.78);
      text-shadow: 0 0 10px rgba(0,212,255,0.25);
    }
    .card-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
    }
    .badge-now {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: #00ff88;
      text-shadow: 0 0 10px rgba(0,255,136,0.5);
    }
    .card-period {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: rgba(90,140,200,0.55);
    }
    .card-summary {
      font-size: 14px;
      color: rgba(150,185,230,0.65);
      line-height: 1.65;
      margin-bottom: 12px;
    }
    .highlights {
      list-style: none;
      padding: 0;
      margin: 0 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .highlights li {
      font-size: 13.5px;
      color: rgba(155,195,240,0.7);
      padding-left: 16px;
      position: relative;
      line-height: 1.55;
    }
    .highlights li::before {
      content: '▹';
      position: absolute;
      left: 0;
      color: rgba(0,212,255,0.45);
    }
    .highlights ::ng-deep strong {
      color: #ddeeff;
      font-weight: 600;
    }

    /* Tech tags (shared) */
    .tech-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .tech-tag {
      padding: 3px 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      border-radius: 5px;
      border: 1px solid rgba(90,130,200,0.16);
      background: rgba(90,130,200,0.04);
      color: rgba(130,170,220,0.55);
    }

    /* ─── Projects ───────────────────────────────── */
    .proj-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    }
    .proj-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 11px;
      transition: transform 0.3s ease, border-color 0.3s, box-shadow 0.3s;
    }
    .proj-card:hover {
      transform: perspective(700px) rotateY(3deg) rotateX(-2deg) translateY(-7px);
      border-color: rgba(0,212,255,0.24);
      box-shadow:
        0 0 0 1px rgba(0,212,255,0.07),
        0 32px 64px rgba(0,0,0,0.5),
        0 0 44px rgba(0,212,255,0.05);
    }
    .proj-card.featured {
      border-color: rgba(0,212,255,0.16);
      background: rgba(2,12,32,0.68);
    }
    .proj-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .proj-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: rgba(0,212,255,0.65);
      border: 1px solid rgba(0,212,255,0.22);
      border-radius: 4px;
      padding: 2px 8px;
    }
    .proj-period {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: rgba(90,140,200,0.45);
    }
    .proj-title {
      font-family: 'Sora', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #ddeeff;
      letter-spacing: -0.01em;
    }
    .proj-desc {
      font-size: 13.5px;
      color: rgba(150,185,230,0.6);
      line-height: 1.65;
      flex: 1;
    }
    .proj-role {
      font-size: 12.5px;
      color: rgba(130,175,240,0.55);
    }
    .role-lbl {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: rgba(0,212,255,0.38);
      letter-spacing: 0.1em;
    }
    .proj-links { display: flex; gap: 10px; padding-top: 4px; }
    .proj-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: rgba(130,172,240,0.55);
      text-decoration: none;
      padding: 5px 12px;
      border: 1px solid rgba(90,130,200,0.16);
      border-radius: 6px;
      transition: all 0.2s;
    }
    .proj-link:hover {
      color: rgba(130,172,240,0.9);
      border-color: rgba(90,130,200,0.35);
    }
    .proj-link.accent {
      color: rgba(0,212,255,0.65);
      border-color: rgba(0,212,255,0.22);
    }
    .proj-link.accent:hover {
      color: #00d4ff;
      border-color: rgba(0,212,255,0.5);
      box-shadow: 0 0 14px rgba(0,212,255,0.14);
    }

    /* ─── Contact ────────────────────────────────── */
    .sf-contact {
      text-align: center;
      padding: 110px 24px;
      position: relative;
    }
    .contact-title {
      font-family: 'Sora', sans-serif;
      font-size: clamp(2.2rem, 5.5vw, 3.8rem);
      font-weight: 900;
      background: linear-gradient(120deg, #00d4ff, #7c3aed, #c084fc);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
      letter-spacing: -0.025em;
    }
    .contact-intro {
      font-size: 16px;
      color: rgba(150,185,230,0.55);
      max-width: 480px;
      margin: 0 auto 44px;
      line-height: 1.75;
    }
    .contact-ctas {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 40px;
    }
    .social-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-bottom: 64px;
    }
    .social-pill {
      padding: 8px 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.1em;
      border: 1px solid rgba(90,130,200,0.18);
      border-radius: 100px;
      color: rgba(130,175,240,0.55);
      text-decoration: none;
      transition: all 0.24s;
      background: rgba(90,130,200,0.03);
    }
    .social-pill:hover {
      border-color: rgba(0,212,255,0.3);
      color: rgba(0,212,255,0.78);
      background: rgba(0,212,255,0.05);
      box-shadow: 0 0 14px rgba(0,212,255,0.1);
    }
    .sf-footer {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: rgba(90,130,200,0.32);
      letter-spacing: 0.06em;
    }
  `],
})
export class ScifiViewComponent implements AfterViewInit, OnDestroy {
  svc = inject(PortfolioService);
  ui = this.svc.ui;
  locales = SUPPORTED_LOCALES;

  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private rafId = 0;
  private particles: Particle[] = [];
  private resizeHandler = (): void => this.resizeCanvas();

  ngAfterViewInit(): void {
    this.resizeCanvas();
    this.spawnParticles();
    this.animate();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.resizeHandler);
  }

  isHot = (s: string): boolean => HOT.has(s);
  firstName = (n: string): string => n.split(' ')[0];
  lastName = (n: string): string => n.split(' ').slice(1).join(' ');

  private resizeCanvas(): void {
    const c = this.canvasRef?.nativeElement;
    if (!c) return;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
  }

  private spawnParticles(): void {
    const count = Math.min(110, Math.floor(window.innerWidth / 13));
    const hues = [180, 195, 210, 260, 275];
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.3 + 0.4,
      a: Math.random() * 0.45 + 0.15,
      hue: hues[Math.floor(Math.random() * hues.length)],
    }));
  }

  private animate(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const frame = (): void => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(0,180,255,0.022)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 68) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 68) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Connection lines
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i], b = this.particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 125) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,180,255,${(1 - d / 125) * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of this.particles) {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;

        // Soft glow halo
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        g.addColorStop(0, `hsla(${p.hue},100%,72%,${p.a * 0.35})`);
        g.addColorStop(1, `hsla(${p.hue},100%,72%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,78%,${p.a})`;
        ctx.fill();
      }

      this.rafId = requestAnimationFrame(frame);
    };

    this.rafId = requestAnimationFrame(frame);
  }
}
