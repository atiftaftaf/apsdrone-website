# APS Drone Weekly Google Monitoring Log — 2026

Use this log once per week, preferably Monday morning, with the same Search Console date comparison and GA4 reporting window. Do not react to a single-day rank fluctuation.

## Baseline — August 30, 2026

| Signal | Verified baseline | Source |
|---|---:|---|
| Main sitemap | Success; 13 pages reported by Google | Search Console Sitemaps |
| Current live sitemap | 19 indexable URLs | Live `sitemap.xml` and local crawl |
| Video discovery | Dedicated video sitemap submitted successfully; 4 pages and 4 videos discovered; stored index report still awaiting Google processing | Search Console Sitemaps and Video pages |
| External links | 0 | Search Console Links |
| Dallas services page | 257 impressions; 0 clicks; 0% CTR; average position 50.3 | Search Console page filter, July 27–August 28 |
| `dallas drone services` | 46 impressions; average position 20.7 | Search Console query filter |
| `drone services dallas` | 17 impressions; average position 31.2 | Search Console query filter |
| `commercial drone services` | 12 impressions; average position 50.8 | Search Console query filter |
| `fort worth drone photography` | 10 impressions; average position 57.7 | Search Console query filter |
| GA4 key events | `generate_lead`, `click_call`, `click_text`, `click_whatsapp`, `click_email`, `click_quote` configured | GA4 Admin / Key events |
| Google Business Profile views | 331 total, March–August 2026: 91 Maps desktop, 81 Search desktop, 80 Maps mobile, 79 Search mobile | Google Business Profile Performance |
| Google Business Profile interactions | 1 website click in July; 0 calls, 0 bookings and 0 chat clicks; August currently 0 | Google Business Profile Performance |
| Google Business Profile searches | Fewer than 50; disclosed query `aps photography` is fewer than 15 | Google Business Profile Performance |
| Bing Places | Google-verified; weekly sync enabled; Pending publish with 7–12 day estimate | Bing Places owner dashboard |
| Bing Webmaster Tools | `apsdrone.com` imported with Administrator role; both sitemaps Success; 23 URLs discovered; 0 errors and 0 warnings | Bing Webmaster Tools |
| Bing Site Scan | Completed; 20 live pages scanned; 0 errors; 0 warnings | Bing Webmaster Tools Site Scan |
| IndexNow | Live key HTTP 200; 27 unique URLs accepted with HTTP 202 | GitHub Actions run `33330895103` and live key check |

## Weekly review sequence

1. Verify the Search Console property is exactly `https://apsdrone.com/` and compare the latest complete 28 days with the preceding 28 days.
2. Record total clicks, impressions, CTR and average position; then inspect queries and pages separately.
3. Prioritize pages with meaningful impressions in positions 8–30 or strong impressions with unusually low CTR.
4. Inspect Page indexing, Video pages, Sitemaps, Core Web Vitals, Enhancements and Security/manual-action reports for new problems.
5. In GA4, record qualified `generate_lead` events separately from click-only key events. Never create test form submissions that look like real leads.
6. Note Google Business Profile website/call/message activity when available and preserve UTM attribution on every post or product link.
7. Make one evidence-based change at a time. Record the URL, change and deployment commit so the next comparison has a clear cause.

## August 30 action checkpoint

- Search Console accepted `video-sitemap.xml` with four discovered pages and four discovered videos.
- One-time indexing requests were confirmed for the residential, commercial, FPV and vertical real-estate watch pages.
- The Google Business Profile product catalog was expanded from one to seven service cards; new cards may remain Pending during Google review.
- Four October posts were submitted with original project media and tracked Learn more links. Combined with the five existing scheduled posts, the future queue covers nine weekly dates from August 31 through October 26.
- The Business Profile now saves the verified Instagram, active Facebook and TikTok identities. The public business number was submitted as the primary SMS chat destination and is in Google's short review queue.
- The March–August Google Business baseline is 331 profile views and one website click. There are no reported calls, bookings or chat clicks yet, so future growth should be evaluated from these real zero/one baselines rather than impressions alone.
- Bing Places imported and verified the canonical APS Drone Google profile, enabled weekly synchronization and entered Pending publish.
- Bing Webmaster Tools imported the verified site and both sitemaps from Google Search Console. Its first technical scan completed across 20 live pages with 0 errors and 0 warnings.
- A root ownership key and deployment workflow were added for IndexNow. The live key returned HTTP 200 and the first workflow run submitted 27 unique sitemap URLs, accepted with HTTP 202.

## Decision thresholds

- **Position 8–20 with impressions but weak CTR:** improve title/description and search-result promise without changing the page's real scope.
- **Position 20–40 with rising impressions:** strengthen project evidence, FAQs and internal links before considering a new page.
- **Multiple queries routed to the wrong broad page:** improve contextual links to the specialist page; do not create repetitive doorway pages.
- **Indexed-page decline or sitemap error:** diagnose immediately before publishing new content.
- **Video detected but not indexed:** recheck watch-page eligibility, thumbnail stability and video sitemap status; avoid repeated indexing requests.
- **No qualified lead events:** validate the conversion path and traffic intent before spending on ads.
- **Negative review or customer issue:** respond professionally and resolve the service issue; never suppress, incentivize or fabricate reviews.

## Weekly entry template

### Week ending: YYYY-MM-DD

- Search Console comparison window:
- Clicks / impressions / CTR / average position:
- Queries gaining impressions:
- Queries in positions 8–30:
- Low-CTR pages:
- Indexing or sitemap changes:
- Video-indexing changes:
- Core Web Vitals / enhancement errors:
- External-link changes:
- GA4 qualified leads:
- GA4 call / text / WhatsApp / email / quote clicks:
- Google Business Profile activity:
- Change made this week:
- Deployment commit and live verification:
- Next evidence-based action:

## Guardrails

- Rankings vary by location, device and personalization; use Search Console trend data rather than manual spot checks alone.
- Never promise a number-one ranking or create fake searches, clicks, reviews, leads or engagement.
- Never expose a private address, customer identity or exact project location in public reporting.
- Keep Google Ads paused until real conversion data can support cost-per-qualified-lead decisions.
