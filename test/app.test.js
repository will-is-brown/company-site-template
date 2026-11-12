import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../server.js';

const call = (path) => handleRequest(new Request(`http://localhost${path}`));

test('landing page returns 200 with HTML and UTF-8 charset', async () => {
  const res = await call('/');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html;\s*charset=utf-8/);
  const text = await res.text();
  assert.match(text, /<!doctype html>/i);
  assert.match(text, /<title>/);
});

test('/healthz returns 200 JSON with status ok', async () => {
  const res = await call('/healthz');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /application\/json/);
  const json = await res.json();
  assert.equal(json.status, 'ok');
  assert.equal(typeof json.version, 'string');
});

test('every self-hosted font is served with immutable cache headers', async () => {
  const fonts = [
    '/assets/fonts/archivo-100-900.woff2',
    '/assets/fonts/big-shoulders-100-900.woff2',
    '/assets/fonts/space-mono-400.woff2',
    '/assets/fonts/space-mono-700.woff2',
  ];
  for (const path of fonts) {
    const res = await call(path);
    assert.equal(res.status, 200, `${path} should be served`);
    assert.equal(res.headers.get('content-type'), 'font/woff2');
    assert.equal(res.headers.get('cache-control'), 'public, max-age=31536000, immutable');
    const buffer = Buffer.from(await res.arrayBuffer());
    assert.equal(buffer.subarray(0, 4).toString(), 'wOF2');
  }
});

test('the landing page loads no external third-party scripts, styles or fonts', async () => {
  const res = await call('/');
  const html = await res.text();
  // No CDNs, no Google Fonts, no tracking pixels.
  assert.doesNotMatch(html, /https?:\/\/(?!www\.w3\.org|example\.com)/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});

test('the page declares a single theme and never inverts to dark mode', async () => {
  const res = await call('/');
  const html = await res.text();
  assert.match(html, /name="color-scheme" content="light only"/);
  assert.doesNotMatch(html, /prefers-color-scheme:\s*dark/);
});

test('the page includes accessible ARIA markup', async () => {
  const res = await call('/');
  const html = await res.text();
  assert.match(html, /role="status"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="nav-links"/);
  assert.match(html, /aria-label=/);
});

test('every input has an associated label', async () => {
  const res = await call('/');
  const html = await res.text();
  const ids = [...html.matchAll(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(ids.length >= 5, 'the booking form should have at least five fields');
  for (const id of ids) {
    assert.match(html, new RegExp(`<label[^>]*for="${id}"`), `missing label for #${id}`);
  }
});

test('CSS ships Blueprint tokens, the accent override and a reduced-motion query', async () => {
  const res = await call('/page.css');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/css/);
  const css = await res.text();
  assert.match(css, /--t-accent:/);
  assert.match(css, /--t-accent-deep:/);
  assert.match(css, /--t-accent-tint:/);
  assert.match(css, /--t-accent-grid:/);
  assert.match(css, /--t-paper:/);
  assert.match(css, /--t-ink:/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  // Blueprint forbids blurred shadows and pill buttons.
  assert.doesNotMatch(css, /border-radius:\s*999px/);
});

test('the accent is never used as a page or section background', async () => {
  const res = await call('/page.css');
  const css = await res.text();

  // The body canvas and section surfaces must stay paper or ink.
  const bodyRule = css.match(/body\s*\{[^}]*\}/s);
  assert.ok(bodyRule, 'body rule should exist');
  assert.doesNotMatch(bodyRule[0], /background[^;]*var\(--t-accent\)/);

  // No section-level rule may paint itself with the accent.
  for (const rule of css.matchAll(/section[^{]*\{[^}]*\}/g)) {
    assert.doesNotMatch(rule[0], /background[^;]*var\(--t-accent\)/);
  }
});

test('the page footer is scoped to the page, not to quote attribution', async () => {
  const res = await call('/page.css');
  const css = await res.text();
  // A bare `footer { }` rule would repaint the <footer> inside every quote
  // card as an ink block. The site footer must be scoped, so no selector may
  // be exactly "footer" on its own.
  assert.doesNotMatch(css, /(^|\n)\s*footer\s*\{/m, 'footer rules must be scoped, not bare');
  assert.match(css, /body\s*>\s*footer\s*\{/);
});

test('the page never paints a quote attribution as a dark surface', async () => {
  const res = await call('/index.html');
  const html = await res.text();
  // Quotes carry a <footer> for attribution; it must not be styled as a band.
  const quoteFooterStyles = await call('/page.css');
  const css = await quoteFooterStyles.text();
  const quoteRule = css.match(/\.quote\s+footer\s*\{[^}]*\}/);
  assert.ok(quoteRule, 'a .quote footer rule should exist');
  assert.doesNotMatch(quoteRule[0], /background/, 'quote attribution must not carry a background');
});

test('the reveal animation has a static escape hatch and a print fallback', async () => {
  const js = await (await call('/page.js')).text();
  // A renderer that captures the page without scrolling would otherwise
  // strand the lower sections invisible. ?static reveals everything.
  assert.match(js, /has\('static'\)/);

  const css = await (await call('/page.css')).text();
  // Printing must show every service, price and question.
  assert.match(css, /@media print/);
  const printBlock = css.match(/@media print\s*\{[^@]*\}/s);
  assert.ok(printBlock, 'a print block should exist');
  assert.match(printBlock[0], /\.js \.rise\s*\{[^}]*opacity:\s*1/);
});

test('unknown routes return 404', async () => {
  const res = await call('/nonexistent-page-path');
  assert.equal(res.status, 404);
});
