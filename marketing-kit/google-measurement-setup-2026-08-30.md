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

The quote form also stores first-touch campaign attribution in hidden Formspree fields: landing page, referrer, UTM values, Google click identifiers, Meta click identifier and TikTok click identifier.

## Verification status

- The GA4 script is deployed on every public HTML page.
- The live `analytics.js` returned HTTP 200 after deployment.
- The live page contained both the local Analytics loader and the injected `googletagmanager.com/gtag/js` resource.
- Google can take time to change the new stream from “No data received” to active. Recheck Realtime and Recent events after normal public traffic appears.
- Once events appear, mark `generate_lead`, `click_call`, `click_text`, `click_whatsapp` and `click_email` as key events. Do not mark ordinary page views or generic clicks as conversions.

## Privacy

The public privacy notice now identifies Google Analytics, the purpose of measurement and Google's partner-sites privacy explanation. No private unit number is published.
