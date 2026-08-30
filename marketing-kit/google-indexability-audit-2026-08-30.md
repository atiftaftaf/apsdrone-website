# APS Drone Sitemap and Indexability Audit

Verified: August 30, 2026

## Sitemap coverage

- Main sitemap: `https://apsdrone.com/sitemap.xml`
- Sitemap URL count: **21**
- Public directory-based HTML pages: **20**
- Additional sitemap URL: `https://apsdrone.com/privacy.html`
- Public pages missing from the sitemap: **0**

## Page-level checks

- Canonical URL mismatches: **0**
- Pages with a `noindex` directive: **0**
- Pages missing a `<title>` or `<h1>`: **0**
- JSON-LD parse errors across 23 structured-data blocks: **0**

## Internal-link reachability

- Public pages reachable from the homepage through the internal-link graph: **20 of 20**
- Direct internal page links from the homepage: **15**
- Orphan public pages: **0**

## Search Console discrepancy

The authenticated Search Console Sitemaps report currently shows `/sitemap.xml` as successful with 13 discovered pages. The live/local sitemap contains 21 valid URLs and all 20 content pages pass the coverage, canonical and internal-link checks above. This points to an outdated Search Console processing state rather than a missing-page sitemap defect.

## Next action

Submit/resubmit the current main sitemap and submit `video-sitemap.xml` once, then allow Google time to process them. Do not repeatedly submit the same sitemap or URLs.
