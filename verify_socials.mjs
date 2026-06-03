import { chromium } from './node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1440, height: 900 });
await p.goto('http://localhost:4200', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
// Hero in view — top-right social icons should be visible
await p.screenshot({ path: '/tmp/socials_hero.png', clip: { x: 0, y: 0, width: 1440, height: 200 } });
// Scroll to experience section
await p.evaluate(() => document.querySelector('#experience').scrollIntoView({ behavior: 'instant' }));
await p.waitForTimeout(800);
await p.screenshot({ path: '/tmp/socials_sidebar.png', clip: { x: 0, y: 0, width: 400, height: 900 } });
await b.close();
console.log('done');
