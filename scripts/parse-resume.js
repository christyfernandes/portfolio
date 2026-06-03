#!/usr/bin/env node
/**
 * scripts/parse-resume.js
 * ------------------------------------------------------------------
 * Local-only utility (never runs in production — GitHub Pages is static).
 *
 * Turns a plain-text résumé into the structured JSON the Angular app
 * consumes from src/assets/data/. It pre-fills the English (`en`) locale
 * and stubs `hi` / `kn` with the English text so you can translate in place.
 *
 * USAGE
 *   1) Paste your résumé text into  scripts/resume.txt
 *   2) Run:  node scripts/parse-resume.js
 *   3) Review & translate the generated *.json files in src/assets/data/
 *
 * The parser is intentionally heuristic — it gives you a correct SHAPE to
 * edit, not a perfect autoextraction. Sections are detected by headings:
 *   SUMMARY / EXPERIENCE / PROJECTS / SKILLS
 * ------------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../src/assets/data');
const INPUT = path.resolve(__dirname, 'resume.txt');

/** Wrap a plain English string into the {en,hi,kn} shape (stub translations). */
const loc = (en) => ({ en, hi: en, kn: en });

function read() {
  if (!fs.existsSync(INPUT)) {
    console.error(`\n  Missing ${path.relative(process.cwd(), INPUT)}.`);
    console.error('  Create it and paste your résumé text, then re-run.\n');
    process.exit(1);
  }
  return fs.readFileSync(INPUT, 'utf8');
}

/** Split into sections keyed by uppercase headings. */
function sectionize(text) {
  const lines = text.split(/\r?\n/);
  const sections = {};
  let current = 'HEADER';
  sections[current] = [];
  const HEAD = /^(SUMMARY|PROFILE|EXPERIENCE|WORK|PROJECTS|SKILLS|EDUCATION|CERTIFICATIONS)\b/i;
  for (const line of lines) {
    if (HEAD.test(line.trim())) {
      current = line.trim().toUpperCase().split(/\s+/)[0];
      sections[current] = [];
    } else {
      sections[current].push(line);
    }
  }
  return sections;
}

function nonEmpty(arr) {
  return arr.map((l) => l.trim()).filter(Boolean);
}

function buildProfile(sections) {
  const header = nonEmpty(sections.HEADER || []);
  const name = header[0] || 'Your Name';
  const headline = header[1] || 'Your Role';
  const summary = nonEmpty(sections.SUMMARY || sections.PROFILE || []).join(' ');
  const skills = nonEmpty(sections.SKILLS || [])
    .join(',')
    .split(/[,•|]/)
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    name,
    initials: name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase(),
    headline: loc(headline),
    tagline: loc(summary || headline),
    status: { available: true, label: loc('Open to new opportunities') },
    location: '',
    email: (text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [''])[0],
    phone: (text.match(/\+?\d[\d\s-]{7,}\d/) || [''])[0],
    resumeUrl: 'assets/Your_Resume.pdf',
    socials: [
      { platform: 'GitHub', url: 'https://github.com/your-username', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle', icon: 'linkedin' },
      { platform: 'Email', url: 'mailto:you@example.com', icon: 'mail' },
    ],
    skills: skills.slice(0, 24),
  };
}

/** EXPERIENCE blocks separated by blank lines: line1 = "Role @ Company (period)". */
function buildExperience(sections) {
  const raw = (sections.EXPERIENCE || sections.WORK || []).join('\n');
  const blocks = raw.split(/\n\s*\n/).map(nonEmpty).filter((b) => b.length);
  return blocks.map((b, i) => {
    const head = b[0] || '';
    const period = (head.match(/\(?([\d]{4}.*(present|\d{4}))\)?/i) || [, ''])[1];
    const [role, company] = head.replace(/\(.*\)/, '').split(/[@|—–-]/).map((s) => s.trim());
    return {
      id: `exp-${i + 1}`,
      role: loc(role || head),
      company: company || '',
      location: '',
      period: period || '',
      current: /present/i.test(period || ''),
      summary: loc(b[1] || ''),
      highlights: b.slice(2).map((h) => loc(h.replace(/^[-•▹]\s*/, ''))),
      tech: [],
    };
  });
}

function buildProjects(sections) {
  const raw = (sections.PROJECTS || []).join('\n');
  const blocks = raw.split(/\n\s*\n/).map(nonEmpty).filter((b) => b.length);
  return blocks.map((b, i) => ({
    id: `proj-${i + 1}`,
    title: b[0] || `Project ${i + 1}`,
    featured: i < 2,
    period: '',
    description: loc(b.slice(1).join(' ')),
    tech: [],
    repo: '',
    live: '',
  }));
}

function writeJson(file, data) {
  const out = path.join(DATA_DIR, file);
  fs.writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
  console.log('  ✓ wrote', path.relative(process.cwd(), out));
}

const text = read();
const sections = sectionize(text);

console.log('\n  Generating data files from résumé…\n');
writeJson('profile.json', buildProfile(sections));
writeJson('experience.json', buildExperience(sections));
writeJson('projects.json', buildProjects(sections));
console.log(
  '\n  Done. snippets.json and ui.json are hand-maintained (not derived from the résumé).'
);
console.log('  Next: open the generated files and fill in hi/kn translations + tech tags.\n');
