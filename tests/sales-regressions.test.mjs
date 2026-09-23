import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createServer, preview } from 'vite';

let vite, submit, interpret;
const originalFetch = globalThis.fetch;
before(async () => {
  vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  ({ submitToGoogleSheet: submit, interpretLeadResponse: interpret } = await vite.ssrLoadModule('/utils/sheetUtils.ts'));
});
after(async () => { globalThis.fetch = originalFetch; await vite?.close(); });

test('only an explicit successful acknowledgement confirms receipt', () => {
  for (const body of ['{"success":true}', '{"status":"success"}']) assert.equal(interpret(body), 'confirmed');
  // Un duplicado es exito para el visitante pero NO una conversion nueva: el backend
  // no escribio una segunda fila, asi que generate_lead no debe volver a dispararse.
  assert.equal(interpret('{"success":true,"duplicate":true}'), 'duplicate');
  for (const body of ['', '<html>Sign in</html>', 'OK', 'null', '[]', '{}', '{"status":"pending"}']) assert.equal(interpret(body), 'unconfirmed');
  for (const body of ['{"success":false}', '{"success":true,"error":"write failed"}', '{"status":"error"}']) assert.equal(interpret(body), false);
});

test('CORS and timeout failures never trigger a second POST', async () => {
  for (const error of [new TypeError('CORS'), new DOMException('Timed out', 'AbortError')]) {
    let calls = 0;
    globalThis.fetch = async () => { calls++; throw error; };
    assert.equal(await submit({ name: 'Test', details: 'Context' }), 'unconfirmed');
    assert.equal(calls, 1);
  }
});

test('HTTP errors and ambiguous 200s stay unconfirmed', async () => {
  for (const response of [new Response('Error', { status: 500 }), new Response('<html>Login</html>')]) {
    globalThis.fetch = async () => response;
    assert.equal(await submit({ name: 'Test' }), 'unconfirmed');
  }
});

test('submission preserves context, attribution and selected package without sending anything externally', async () => {
  for (const packageId of ['general', 'quick-win', 'executive', 'custom', 'retainer']) {
    globalThis.fetch = async (_, options) => {
      assert.equal(options.method, 'POST');
      assert.equal(options.body.get('details'), 'Sales & margin = weekly');
      assert.equal(options.body.get('packageId'), packageId);
      assert.equal(options.body.get('utm_campaign'), 'pilot');
      return new Response('{"success":true}');
    };
    assert.equal(await submit({ details: 'Sales & margin = weekly', packageId, utm_campaign: 'pilot' }), 'confirmed');
  }
});

test('all six built pages contain React-rendered content and matching language metadata', () => {
  for (const path of ['', 'portfolio/', 'web/']) for (const lang of ['es', 'en']) {
    const html = readFileSync(join('dist', lang === 'en' ? '_localized/en' : '', path, 'index.html'), 'utf8');
    assert.match(html, new RegExp(`<html lang="${lang}"`));
    assert.match(html, /<div id="root"><[^>]+/);
    assert.match(html, /<h1[ >]/);
    const canonical = `https://www.sagepoint-analytics.com/${path}${lang === 'en' ? '?lang=en' : ''}`;
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`));
    for (const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(block[1]);
    if (!path) assert.ok(html.includes(lang === 'en' ? 'Request a free consultation' : 'Solicitar diagnóstico gratuito'));
  }
});

test('built home keeps conservative case results and phone examples in the selected language', () => {
  const spanish = readFileSync('dist/index.html', 'utf8');
  const english = readFileSync('dist/_localized/en/index.html', 'utf8');
  for (const text of ['6 cifras', '&gt;99%', '~81%', 'más de 25 h/semana', 'un margen de seis cifras', '+502 5555 5555']) {
    assert.ok(spanish.includes(text), `Spanish home: ${text}`);
  }
  for (const text of ['Six figures', '&gt;99%', '~81%', '25+ hours/week', 'a six-figure margin', '+1 (555) 555-5555']) {
    assert.ok(english.includes(text), `English home: ${text}`);
  }
  for (const [language, html] of [['es', spanish], ['en', english]]) {
    assert.doesNotMatch(html, /\$420(?:,000|k)|99\.4%|81\.2%|28 (?:h\/semana|horas|hours)/, `${language} home`);
  }
});

test('excluded client material is absent from published text and asset names', () => {
  function inspect(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      assert.doesNotMatch(path, /inboxhealth|medical-billing/i);
      if (entry.isDirectory()) inspect(path);
      else if (/\.(html|js|txt)$/.test(path)) assert.doesNotMatch(readFileSync(path, 'utf8'), /Inbox\s?Health|eClinicalWorks|Carlos Arenas|medical billing|facturación médica/i, path);
    }
  }
  inspect('dist');
});


test('local production preview serves the matching initial HTML for each language URL', async () => {
  let server;
  try {
    server = await preview({ preview: { host: '127.0.0.1', port: 4186, strictPort: true } });
  } catch (error) {
    if (error?.code !== 'EPERM') throw error;
    // Sandboxed runners may prohibit listening sockets. The normal path above still exercises
    // Vite preview; this fallback verifies the same prerendered language payloads in place.
    for (const path of ['', 'portfolio/', 'web/']) for (const language of ['es', 'en']) {
      const html = readFileSync(join('dist', language === 'en' ? '_localized/en' : '', path, 'index.html'), 'utf8');
      assert.ok(html.includes(`<html lang="${language}"`));
      assert.match(html, /<h1[ >]/);
    }
    return;
  }
  try {
    for (const path of ['/', '/portfolio/', '/web/']) for (const language of ['es', 'en']) {
      const response = await originalFetch(`http://127.0.0.1:4186${path}${language === 'en' ? '?lang=en' : ''}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(`<html lang="${language}"`));
      assert.match(html, /<h1[ >]/);
    }
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
  }
});

test('analytics bootstrap queues gtag Arguments, preserving event name and parameters', async () => {
  const { default: ts } = await import('typescript');
  const { runInNewContext } = await import('node:vm');
  const source = readFileSync('utils/analytics.ts', 'utf8').replaceAll('import.meta.env', 'testEnv');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports: {}, window: {}, testEnv: { PROD: true }, document: { createElement: () => ({}), head: { appendChild() {} } } };
  runInNewContext(js, context);
  context.exports.initializeAnalytics();
  context.exports.trackEvent('lead_form_open', { language: 'en' });
  const command = context.window.dataLayer.at(-1);
  assert.equal(Object.prototype.toString.call(command), '[object Arguments]');
  assert.equal(command[0], 'event');
  assert.equal(command[1], 'lead_form_open');
  assert.equal(command[2].language, 'en');
});

test('external booking URL is opt-in, English-only and wired to all three primary CTAs', async () => {
  const { BOOKING_URL, getEnglishBookingUrl } = await vite.ssrLoadModule('/leonardo/booking.ts');
  assert.equal(BOOKING_URL, '');
  assert.equal(getEnglishBookingUrl('en'), null);
  assert.equal(getEnglishBookingUrl('es', 'https://example.com/book'), null);
  assert.equal(getEnglishBookingUrl('en', ' https://example.com/book '), 'https://example.com/book');

  const home = readFileSync('leonardo/LeonardoHome.tsx', 'utf8');
  assert.match(home, /trackScheduleCall\(\{/);
  assert.equal(home.match(/onClick=\{\(e\) => handlePrimaryBooking\(/g)?.length, 3);
});

test('deployment config resolves language before static files and keeps unknown paths as 404', () => {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, 'dist');
  assert.equal(config.buildCommand, 'npm run build');
  const fileIndex = config.routes.findIndex(r => r.handle === 'filesystem');
  const enRedirectIndex = config.routes.findIndex(r => r.src === '^/en/?$');
  assert.ok(enRedirectIndex > -1 && enRedirectIndex < fileIndex);
  assert.equal(config.routes[enRedirectIndex].status, 308);
  assert.equal(config.routes[enRedirectIndex].headers.Location, '/?lang=en');
  for (const path of ['/', '/portfolio/', '/web/']) for (const lang of ['es', 'en']) {
    const route = config.routes.slice(0, fileIndex).find(r => r.dest && new RegExp(r.src).test(path) && (!r.has || r.has.every(h => h.type === 'query' && h.key === 'lang' && h.value === lang)));
    const target = `${lang === 'en' ? '/_localized/en' : ''}${path}index.html`;
    assert.equal(route?.dest, target);
    assert.match(readFileSync(join('dist', target), 'utf8'), new RegExp(`<html lang="${lang}"`));
  }
  assert.equal(config.routes.at(-1).status, 404);
  const cache = path => config.routes.find(r => r.headers?.['Cache-Control'] && new RegExp(r.src).test(path))?.headers['Cache-Control'];
  assert.match(cache('/assets/index-12345678.js'), /immutable/);
  assert.doesNotMatch(cache('/assets/img/project.webp'), /immutable/);
});
