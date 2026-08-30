const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const origin = 'https://apsdrone.com';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function textOnly(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function localPathForUrl(url) {
  const parsed = new URL(url, origin);
  if (parsed.origin !== origin) return null;
  const pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/') return 'index.html';
  const clean = pathname.replace(/^\/+/, '');
  if (pathname.endsWith('/')) return path.join(clean, 'index.html');
  return clean;
}

function jsonLdObjects(html, page) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return blocks.map((match, index) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`${page} JSON-LD block ${index + 1} is invalid: ${error.message}`);
    }
  });
}

function flattenSchema(value, output = []) {
  if (!value || typeof value !== 'object') return output;
  if (Array.isArray(value)) {
    value.forEach((item) => flattenSchema(item, output));
    return output;
  }
  output.push(value);
  Object.values(value).forEach((item) => flattenSchema(item, output));
  return output;
}

const sitemap = read('sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/apsdrone\.com\/[^<]*)<\/loc>/g)].map((match) => match[1]);
assert.equal(sitemapUrls.length, 19, 'the canonical sitemap should contain 19 indexable pages');
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'sitemap URLs must be unique');

const pages = new Map();
const titles = new Map();
const descriptions = new Map();
let jsonLdCount = 0;

for (const url of sitemapUrls) {
  const relativePath = localPathForUrl(url);
  assert.ok(relativePath && fs.existsSync(path.join(root, relativePath)), `${url} must map to a local HTML file`);
  const html = read(relativePath);
  pages.set(url, { relativePath, html });

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descriptionMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => textOnly(match[1]));

  assert.ok(titleMatch, `${relativePath} must have a title`);
  assert.ok(descriptionMatch, `${relativePath} must have a meta description`);
  assert.ok(canonicalMatch, `${relativePath} must have a canonical URL`);
  assert.equal(canonicalMatch[1], url, `${relativePath} canonical must match sitemap URL`);
  assert.equal(h1s.length, 1, `${relativePath} must have exactly one H1`);
  assert.match(html, /analytics\.js\?v=20260830-2/, `${relativePath} must load the current Analytics build`);

  const title = textOnly(titleMatch[1]);
  const description = decodeHtml(descriptionMatch[1]).trim();
  assert.ok(!titles.has(title), `duplicate title: ${title}`);
  assert.ok(!descriptions.has(description), `duplicate meta description: ${description}`);
  titles.set(title, relativePath);
  descriptions.set(description, relativePath);

  const objects = jsonLdObjects(html, relativePath);
  jsonLdCount += objects.length;
  pages.get(url).schema = flattenSchema(objects);
}

const queryTargets = [
  ['/dallas-drone-services/', 'Dallas Drone Services'],
  ['/dallas-drone-videography/', 'Dallas Drone Videographer'],
  ['/commercial-drone-photography-dfw/', 'Commercial Drone Services'],
  ['/fort-worth-drone-services/', 'Fort Worth Drone Photography']
];
for (const [pathname, phrase] of queryTargets) {
  const pageUrl = `${origin}${pathname}`;
  const page = pages.get(pageUrl);
  assert.ok(page, `${pathname} must be indexable`);
  const title = textOnly(page.html.match(/<title>([\s\S]*?)<\/title>/i)[1]);
  const h1 = textOnly(page.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)[1]);
  assert.ok(title.includes(phrase), `${pathname} title must contain ${phrase}`);
  assert.ok(h1.includes(phrase), `${pathname} H1 must contain ${phrase}`);
}

const adjacency = new Map(sitemapUrls.map((url) => [url, new Set()]));
let internalLinksChecked = 0;
for (const [pageUrl, page] of pages) {
  const hrefs = [...page.html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)].map((match) => decodeHtml(match[1]));
  for (const href of hrefs) {
    if (/^(?:mailto:|tel:|sms:|javascript:)/i.test(href) || href.startsWith('#')) continue;
    const destination = new URL(href, pageUrl);
    if (destination.origin !== origin) continue;
    destination.hash = '';
    destination.search = '';
    const target = localPathForUrl(destination.href);
    assert.ok(target && fs.existsSync(path.join(root, target)), `${page.relativePath} has missing internal target ${href}`);
    internalLinksChecked += 1;
    const canonicalDestination = `${origin}${destination.pathname}`;
    if (adjacency.has(canonicalDestination)) adjacency.get(pageUrl).add(canonicalDestination);
  }
}

const reached = new Set([`${origin}/`]);
const queue = [`${origin}/`];
while (queue.length) {
  const current = queue.shift();
  for (const next of adjacency.get(current) || []) {
    if (reached.has(next)) continue;
    reached.add(next);
    queue.push(next);
  }
}
assert.equal(reached.size, sitemapUrls.length, 'every indexable page must be reachable from the homepage link graph');

const watchPages = [
  '/dfw-residential-drone-video/',
  '/dfw-commercial-drone-video/',
  '/dfw-fpv-business-tour-video/',
  '/dfw-real-estate-vertical-drone-reel/'
];
for (const pathname of watchPages) {
  const page = pages.get(`${origin}${pathname}`);
  assert.ok(page, `${pathname} must be in the main sitemap`);
  const video = page.schema.find((item) => {
    const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
    return types.includes('VideoObject');
  });
  assert.ok(video, `${pathname} must contain VideoObject data`);
  assert.ok(video.contentUrl, `${pathname} VideoObject needs contentUrl`);
  assert.ok(video.thumbnailUrl, `${pathname} VideoObject needs thumbnailUrl`);
  for (const assetUrl of [video.contentUrl, video.thumbnailUrl]) {
    const target = localPathForUrl(Array.isArray(assetUrl) ? assetUrl[0] : assetUrl);
    assert.ok(target && fs.existsSync(path.join(root, target)), `${pathname} references missing video asset ${assetUrl}`);
  }
}

const videoSitemap = read('video-sitemap.xml');
const videoPageUrls = [...videoSitemap.matchAll(/<loc>(https:\/\/apsdrone\.com\/[^<]*)<\/loc>/g)].map((match) => match[1]);
assert.equal(videoPageUrls.length, watchPages.length, 'video sitemap should contain all four watch pages');
assert.deepEqual(new Set(videoPageUrls), new Set(watchPages.map((pathname) => `${origin}${pathname}`)));

console.log(JSON.stringify({
  sitemapPages: sitemapUrls.length,
  uniqueTitles: titles.size,
  uniqueDescriptions: descriptions.size,
  jsonLdBlocks: jsonLdCount,
  internalLinksChecked,
  homepageReachablePages: reached.size,
  videoWatchPages: watchPages.length
}, null, 2));
console.log('Site integrity verification passed.');
