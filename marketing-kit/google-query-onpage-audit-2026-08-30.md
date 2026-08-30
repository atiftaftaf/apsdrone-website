# APS Drone Search Query On-Page Audit

Verified: August 30, 2026

The target set comes from actual APS Drone Search Console impressions. Each query is mapped to one substantive page rather than a collection of thin or repetitive city pages.

| Search Console query | Primary page | Title/H1 alignment | Supporting intent |
| --- | --- | --- | --- |
| `dallas drone services` | `/dallas-drone-services/` | Title and H1 use “Dallas Drone Services” | Real estate, commercial, construction, roof, FPV and thermal services |
| `drone services dallas` | `/dallas-drone-services/` | Same natural-language topic without keyword duplication | $249 starting price, FAA Part 107 and DFW service scope |
| `dallas drone videographer` | `/dallas-drone-videography/` | Title and H1 use “Dallas Drone Videographer” and “Aerial Video” | 4K video, vertical reels, real estate, commercial property and construction |
| `commercial drone services` | `/commercial-drone-photography-dfw/` | Title and H1 use “Commercial Drone Services DFW” | Industrial, retail, office, multifamily, venue and development-site coverage |
| `fort worth drone photography` | `/fort-worth-drone-services/` | Title and H1 lead with “Fort Worth Drone Photography & Video” | Location-verified property and thermal proof, 4K video and recurring progress documentation |

## Validation rules

- Every mapped page has one unique canonical URL, one substantive H1 and a unique meta description.
- All three updated titles are 57 characters or fewer.
- All three updated meta descriptions are 155 characters or fewer.
- No keyword-stuffed city-page variants were created.
- Sitemap `lastmod` was updated where the older Fort Worth page changed.
- All 23 JSON-LD blocks still parse after the on-page changes.

## Measurement

Recheck these exact queries in Search Console after Google recrawls the pages. Evaluate impressions, CTR, average position and qualified GA4 lead events together; do not judge success from rank alone.

## Dallas page internal-link follow-up

- Added contextual links from each Dallas service card to the matching substantive real-estate, commercial, construction-progress, roof, videography and thermal page.
- Linked the Dallas commercial and Irving roof project images to their exact case-study anchors and added a contextual link to the dedicated crawlable vertical-reel watch page.
- Added one clear route from the Dallas page to all seven location-verified DFW case studies.
- Refreshed the Dallas page sitemap modification date to `2026-08-30`.
- Local validation found three valid JSON-LD blocks, twelve unique relative destinations and zero missing internal targets.

## Page-filtered Search Console evidence

Authenticated Search Console was filtered to exactly `https://apsdrone.com/dallas-drone-services/` for July 27–August 28, 2026. The page recorded **257 impressions, 0 clicks, 0% CTR and average position 50.3**.

| Query routed to the Dallas services page | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `dallas drone services` | 0 | 46 | 0% | 20.7 |
| `dallas drone videographer` | 0 | 31 | 0% | 64.8 |
| `drone videography dallas` | 0 | 28 | 0% | 62.0 |
| `drone services dallas` | 0 | 17 | 0% | 31.2 |
| `commercial drone services` | 0 | 12 | 0% | 50.8 |
| `aerial drone services in dfw` | 0 | 8 | 0% | 72.3 |
| `drone photography dallas` | 0 | 7 | 0% | 74.6 |
| `dallas drone photography` | 0 | 5 | 0% | 59.4 |
| `drone companies in dallas` | 0 | 5 | 0% | 60.2 |
| `aerial videography dallas tx` | 0 | 5 | 0% | 80.8 |

Interpretation: Google is already testing the broad Dallas page for the primary service phrase, while video and commercial variants also reach it. The new internal links give those narrower intents a clear crawl path to their stronger specialist pages without adding repetitive doorway pages. Reassess after recrawl; the current sample is too small to justify keyword repetition or a title rewrite.

GitHub Pages deployment for commit `8ab735b` completed successfully. A cache-busted live check confirmed the commercial-service link, exact Dallas case-study anchor, vertical-reel watch link and the Dallas sitemap modification date.

## Fort Worth evidence and depth follow-up

- Search Console recorded 10 impressions at average position 57.7 for `fort worth drone photography`, identifying the existing Fort Worth page as a real but weak-ranking opportunity.
- Rebuilt the same canonical page instead of creating additional city variants. The page now includes three location-verified Fort Worth images, privacy-safe property and thermal proof, six linked service paths, quote-input guidance, four visible FAQs and one valid Service/Breadcrumb/FAQ JSON-LD graph.
- The title and H1 retain the exact natural topic while the page explains deliverables, limitations, airspace review and project-fit details for people—not just search engines.
- Local validation found zero missing links or media, 16 links, four images and valid structured data. Desktop and mobile renders were visually reviewed. Isolated mobile Lighthouse scored 97 Performance and 100 each for Accessibility, Best Practices and SEO, with zero CLS and 20 ms total blocking time.
