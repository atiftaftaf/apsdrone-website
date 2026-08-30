# APS Drone Sitemap and Indexability Audit

Verified: August 30, 2026

## Sitemap coverage

- Main sitemap: `https://apsdrone.com/sitemap.xml`
- Sitemap URL count: **21 indexable content pages**
- Public directory-based HTML pages: **23 total; 21 indexable and 2 intentionally `noindex,follow` legacy city pages**
- The privacy notice remains linked for users but is intentionally `noindex,follow` and excluded from the sitemap.
- Indexable public pages missing from the sitemap: **0**

## Page-level checks

- Canonical URL mismatches: **0**
- Indexable sitemap pages with a `noindex` directive: **0**
- Intentional non-sitemap `noindex,follow` pages: **3** (`Plano`, `Frisco`, and the privacy notice)
- Pages missing a `<title>` or `<h1>`: **0**
- JSON-LD parse errors across 25 structured-data blocks: **0**

## Internal-link reachability

- Indexable sitemap pages reachable from the homepage through the internal-link graph: **20 of 20**
- Direct indexable sitemap links from the homepage: **15**
- Orphan public pages: **0**

## Search Console discrepancy

The authenticated Search Console Page indexing report was last updated August 20 and still lists four discovered-but-not-indexed URLs: Arlington, Plano, Frisco and the privacy notice. Arlington has now been expanded with location-verified project proof and remains in the sitemap. The repetitive Plano and Frisco pages, plus the non-ranking privacy notice, are now `noindex,follow` and excluded from the sitemap. The authenticated Sitemaps report still shows the older `/sitemap.xml` processing result of 13 discovered pages, so Google has not yet processed the current 21-URL sitemap state.

## Next action

Allow Google to re-read the already submitted main and video sitemaps, then monitor Arlington and the four watch pages after recrawl. The video sitemap was submitted once and accepted with four discovered pages and four discovered videos; all four watch pages received one-time indexing requests. Do not repeatedly submit the same sitemap or URLs.
