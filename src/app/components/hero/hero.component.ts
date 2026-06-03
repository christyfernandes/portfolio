import { Component, inject, signal, effect, OnDestroy } from '@angular/core';
import { PortfolioService } from '../../services/portfolio.service';
import { LocalizePipe } from '../../shared/localize.pipe';

const HOT = new Set([
  'Apache Kafka',
  'Apache Flink',
  'Apache Druid',
  'PySpark',
  'AI-Assisted Dev (Claude, Copilot)',
]);

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LocalizePipe],
  template: `
    @if (svc.profile(); as p) {
      <header #heroEl id="home" class="relative mx-auto max-w-6xl px-6 pb-20 pt-20"
              [class.hero-in]="heroIn()">

        <!-- flex-col-reverse: portrait on top on mobile; grid swaps to side-by-side on lg -->
        <div class="flex flex-col-reverse gap-8 lg:grid lg:grid-cols-[1fr_280px] lg:items-center lg:gap-14">

          <!-- ── Left: text ── -->
          <div>
            <!-- Greeting -->
            <div class="hero-el el-0 mb-5 font-mono text-[13px] font-semibold uppercase tracking-[0.2em] text-muted">
              {{ ui()?.hero?.greeting | localize }}
            </div>

            <!-- Name — typewriter -->
            <h1 class="hero-el el-1 font-display font-extrabold leading-[1.05] tracking-tight"
                style="font-size:clamp(2.6rem,8vw,5.5rem)">
              {{ displayFirst() }}<span class="type-cursor"
                [style.visibility]="phase() === 'first' ? 'visible' : 'hidden'">|</span>
              <br>
              <span class="grad-text">{{ displayLast() }}</span><span
                class="type-cursor grad-cursor"
                [style.visibility]="phase() === 'last' ? 'visible' : 'hidden'">|</span>
            </h1>

            <!-- Headline -->
            <div class="hero-el el-2 mt-5 font-display font-semibold opacity-90"
                 style="font-size:clamp(1rem,2.4vw,1.4rem)">
              {{ p.headline | localize }}
            </div>

            <p class="hero-el el-2 mt-4 max-w-[540px] text-[15px] leading-relaxed text-muted">
              {{ p.tagline | localize }}
            </p>

            <!-- Stats -->
            <div class="hero-el el-3 mt-8 flex flex-wrap items-center gap-0">
              <div class="pr-6">
                <div class="grad-text font-display text-[2rem] font-extrabold leading-none">11+</div>
                <div class="mt-1 text-[11px] font-medium uppercase tracking-wider text-dim">Years building</div>
              </div>
              <div class="border-l border-border px-6">
                <div class="grad-text font-display text-[2rem] font-extrabold leading-none">1.5M+</div>
                <div class="mt-1 text-[11px] font-medium uppercase tracking-wider text-dim">Users served</div>
              </div>
              <div class="border-l border-border pl-6">
                <div class="grad-text font-display text-[2rem] font-extrabold leading-none">64</div>
                <div class="mt-1 text-[11px] font-medium uppercase tracking-wider text-dim">TPS peak load</div>
              </div>
            </div>

            <!-- CTAs -->
            <div class="hero-el el-4 mt-9 flex flex-wrap gap-3.5">
              <a [href]="p.resumeUrl" download class="btn btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
                </svg>
                {{ ui()?.hero?.downloadResume | localize }}
              </a>
              <a href="#contact" class="btn btn-ghost">{{ ui()?.hero?.contactMe | localize }}</a>
            </div>

            <!-- Skills -->
            <div class="hero-el el-5 mt-9 flex max-w-2xl flex-wrap gap-2">
              @for (skill of p.skills; track skill) {
                <span
                  class="rounded-lg border bg-surface px-2.5 py-1.5 text-xs font-medium transition-transform duration-150 hover:-translate-y-0.5"
                  [class.text-teal]="isHot(skill)"
                  [class.border-border]="!isHot(skill)"
                  [class.text-muted]="!isHot(skill)"
                  [style.border-color]="isHot(skill) ? 'color-mix(in srgb, var(--teal) 40%, var(--border))' : null"
                >{{ skill }}</span>
              }
            </div>
          </div>

          <!-- ── Right: portrait (visible on all sizes) ── -->
          <div class="hero-el el-1 flex justify-center">
            <div class="portrait-blob">
              @if (!imgFailed()) {
                <img
                  src="assets/images/profile.HEIC"
                  alt="Christopher Fernandes"
                  class="portrait-img"
                  (error)="imgFailed.set(true)"
                >
              } @else {
                <div class="portrait-fallback">{{ p.initials }}</div>
              }
            </div>
          </div>

        </div>
      </header>
    }
  `,
  styles: [`
    /* ── Entrance animations ── */
    .hero-el {
      opacity: 0;
      transform: translateY(22px);
      transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .hero-in .hero-el { opacity: 1; transform: none; }
    .el-0 { transition-delay: 0.04s; }
    .el-1 { transition-delay: 0.14s; }
    .el-2 { transition-delay: 0.32s; }
    .el-3 { transition-delay: 0.50s; }
    .el-4 { transition-delay: 0.65s; }
    .el-5 { transition-delay: 0.80s; }

    /* ── Typewriter cursor ── */
    .type-cursor {
      display: inline-block;
      font-weight: 200;
      color: var(--teal);
      animation: cursor-blink 0.65s step-end infinite;
      margin-left: 2px;
    }
    /* Gradient cursor sits inside a grad-text span, so we override fill */
    .grad-cursor {
      -webkit-text-fill-color: var(--teal);
      color: var(--teal);
      background: none;
    }
    @keyframes cursor-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }

    /* ── Portrait ── */
    .portrait-blob {
      position: relative;
      width: 190px;
      height: 190px;
      border-radius: 42% 58% 52% 48% / 46% 42% 58% 54%;
      padding: 3px;
      background: var(--grad);
      animation: morph 9s ease-in-out infinite;
      flex-shrink: 0;
    }
    @media (min-width: 1024px) {
      .portrait-blob { width: 270px; height: 270px; }
    }
    .portrait-blob::before {
      content: '';
      position: absolute;
      inset: -14px;
      border-radius: inherit;
      background: var(--grad);
      opacity: 0.12;
      filter: blur(22px);
      animation: morph 9s ease-in-out infinite reverse;
    }
    .portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
      background: var(--surface);
      display: block;
    }
    .portrait-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Sora', sans-serif;
      font-size: clamp(2.5rem, 8vw, 4rem);
      font-weight: 900;
      color: #06121f;
      letter-spacing: -0.02em;
      border-radius: inherit;
    }
    @keyframes morph {
      0%,100% { border-radius: 42% 58% 52% 48% / 46% 42% 58% 54%; }
      33%      { border-radius: 56% 44% 38% 62% / 60% 56% 44% 40%; }
      66%      { border-radius: 48% 52% 62% 38% / 54% 60% 40% 46%; }
    }
  `],
})
export class HeroComponent implements OnDestroy {
  svc = inject(PortfolioService);
  ui = this.svc.ui;

  heroIn       = signal(false);
  displayFirst = signal('');
  displayLast  = signal('');
  /** 'first' | 'last' | 'done' — drives cursor visibility */
  phase        = signal<'first' | 'last' | 'done'>('first');
  imgFailed    = signal(false);

  private _animated = false;
  private typeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Trigger entrance + typewriter as soon as profile data lands.
    // We use effect() instead of AfterViewInit because the <header> is inside
    // @if(profile), so ViewChild isn't available until after data loads.
    effect(() => {
      const profile = this.svc.profile();
      if (!profile || this._animated) return;
      this._animated = true;
      // One rAF lets Angular flush the @if block into the DOM first
      requestAnimationFrame(() => {
        this.heroIn.set(true);
        this.runTypewriter(profile.name);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.typeTimer) clearTimeout(this.typeTimer);
  }

  /**
   * Letter-by-letter typewriter.
   * Frame index i:
   *   0..first.length        → typing first name
   *   first.length+1..total  → typing last name (with a 200 ms pause between)
   */
  private runTypewriter(name: string): void {
    const first = name.split(' ')[0];
    const last  = name.split(' ').slice(1).join(' ');
    const ms    = 52;
    // total = last frame index where last name is fully shown
    const total = first.length + 1 + last.length;
    let i = 0;

    const tick = () => {
      if (i <= first.length) {
        this.displayFirst.set(first.slice(0, i));
        this.phase.set('first');
      } else {
        this.displayFirst.set(first);
        const li = i - first.length - 1;   // offset into last name
        this.displayLast.set(last.slice(0, li));
        this.phase.set(li >= last.length ? 'done' : 'last');
      }

      if (i < total) {
        const delay = i === first.length ? 200 : ms; // brief pause after first name
        i++;
        this.typeTimer = setTimeout(tick, delay);
      }
    };

    this.typeTimer = setTimeout(tick, 350); // initial delay before typing starts
  }

  isHot = (s: string): boolean => HOT.has(s);
}
