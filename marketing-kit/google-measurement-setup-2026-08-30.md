# APS Drone Google Measurement Setup — August 30, 2026

## Live configuration

- Google Analytics account: APS Drone
- GA4 property: APS Drone Website
- Web stream: `https://apsdrone.com`
- Measurement ID: `G-81SXN88RSB`
- Stream ID: `15528039443`
- Reporting time zone: Chicago / U.S. Central
- Business objectives: Generate leads; Understand web and/or app traffic
- Enhanced measurement: enabled

## Connected Google products

- Search Console URL-prefix property `https://apsdrone.com/` linked successfully on August 30, 2026.
- Google Business Profile listing `APS Drone` linked successfully on August 30, 2026.

## Website events

The site sends standard page views plus these lead and contact events:

- `form_start`
- `form_submit`
- `generate_lead`
- `form_error`
- `click_quote`
- `click_call`
- `click_text`
- `click_whatsapp`
- `click_email`
- `click_booking`
- `booking_landing`

The quote form also stores first-touch campaign attribution in hidden Formspree fields: landing page, referrer, UTM values, Google click identifiers, Meta click identifier and TikTok click identifier.

`click_booking` records site links that open the dedicated quote route. `booking_landing` records successful browser arrival on `/request-a-quote/`, including the stored/default traffic source, medium and campaign. The landing event covers Google Business booking traffic because clicks happen on Google's surface before the visitor reaches APSDrone.com.

The five pages mapped to current Search Console opportunities now send quote actions into the same measured route with distinct organic campaign names: `dallas_drone_services`, `dallas_drone_videographer`, `commercial_drone_services`, `fort_worth_drone_photography` and `real_estate_drone_photography`. Arlington uses `arlington_drone_services`. Canonical Offer schema URLs remain clean and untagged.

## Verification status

- The GA4 script is deployed on every public HTML page.
- The live `analytics.js` returned HTTP 200 after deployment.
- The live page contained both the local Analytics loader and the injected `googletagmanager.com/gtag/js` resource.
- GA4 Realtime showed live APS Drone website traffic on August 30, 2026: five active users in the previous 30 minutes and page views on the case-study, commercial-video, vertical-reel and home pages.
- A controlled live-site QA visit using `utm_source=codex_test`, `utm_medium=qa` and `utm_campaign=ga4_validation` produced the custom Realtime events `click_quote` and `form_start`. The form was not submitted, so no false lead was created.
- Commit `5df96a2` deployed the cache-busted booking-route tracking update successfully. Live HTTP checks confirmed `click_booking` in `analytics.js`, the new Analytics version on `/request-a-quote/`, and the updated quote-form build. `node scripts/verify_conversion_tracking.js` executes the production scripts against deterministic DOM stubs and verifies call, booking, quote and attributed `booking_landing` events without sending a form or creating a lead.
- The current query-mapped service-page conversion update passed both `verify_site_integrity.js` and `verify_conversion_tracking.js`: 20 sitemap pages, 253 valid internal links, 25 parseable JSON-LD blocks and all measured quote-route events green.
- The following lead/contact events are configured and server-visible in the GA4 Key events table: `generate_lead`, `click_call`, `click_text`, `click_whatsapp`, `click_email` and `click_quote`.
- No arbitrary monetary value was assigned to `click_email` or `click_quote`; they retain any real event value supplied by the website.
- Ordinary page views, `form_start`, `form_submit` and `form_error` are not marked as key events.

## Privacy

The public privacy notice now identifies Google Analytics, the purpose of measurement and Google's partner-sites privacy explanation. No private unit number is published.
