# APS Drone Google Ads DFW Launch Gate

Prepared: August 30, 2026

This is a campaign blueprint, not authorization to create or spend on a campaign. Launch only after the owner approves a daily/monthly budget and the account shows no unresolved policy, billing or Business Profile issue.

## Conversion objective

Optimize for qualified customer actions, in this order:

1. `generate_lead` — completed quote form.
2. `click_call` — phone intent during staffed hours.
3. `click_text` or `click_whatsapp` — direct project inquiry intent.
4. `click_email` — secondary contact intent.

`click_quote` and `form_start` are diagnostic funnel events, not sufficient proof of a qualified lead. Page views, impressions and ordinary clicks must never be treated as business outcomes.

## Initial campaign structure

Use one Search campaign restricted to people physically present in the approved Dallas-Fort Worth service area. Do not use broad nationwide targeting or Display expansion.

| Ad group | High-intent exact/phrase themes | Landing page |
|---|---|---|
| Dallas drone services | `[dallas drone services]`, `"drone services dallas"`, `[drone photography dallas]`, `"dallas aerial photography"` | `https://apsdrone.com/dallas-drone-services/` |
| Real estate | `[real estate drone photography dallas]`, `"drone photography for real estate"`, `"aerial listing photography dallas"` | `https://apsdrone.com/real-estate-drone-photography-dallas/` |
| Commercial property | `[commercial drone services]`, `"commercial drone photography dallas"`, `"commercial aerial photography dfw"` | `https://apsdrone.com/commercial-drone-photography-dfw/` |
| Construction progress | `[construction drone photography dallas]`, `"drone construction progress"`, `"aerial progress photography dfw"` | `https://apsdrone.com/construction-progress-drone-dfw/` |
| Fort Worth | `[fort worth drone photography]`, `"drone services fort worth"`, `"fort worth aerial photography"` | `https://apsdrone.com/fort-worth-drone-services/` |

Keep thermal, roof and FPV in separate later tests only after the core campaign produces qualified leads. Their intent and pricing differ too much to mix into the first budget.

## Required negative keywords

Apply account/campaign negatives before launch and expand them from the Search terms report.

### Employment and training

`job`, `jobs`, `career`, `careers`, `salary`, `hiring`, `internship`, `course`, `courses`, `class`, `classes`, `school`, `training`, `certification`, `part 107 test`, `license study`

### Shopping, repair and hobby intent

`buy drone`, `drone for sale`, `used drone`, `amazon`, `walmart`, `best drone`, `cheap drone`, `drone repair`, `parts`, `battery`, `propeller`, `controller`, `firmware`, `manual`, `dji app`, `simulator`, `racing drone kit`, `hobby`

### Free or reusable media intent

`free`, `free footage`, `stock footage`, `download`, `wallpaper`, `royalty free`, `youtube video`, `sample images`, `drone music`

### Irrelevant APS/defense intent

`active protection system`, `anti drone`, `counter drone`, `military`, `tank`, `weapon`, `radar`, `school security`, `aps defense`, `arizona public service`

### Consumer/informational intent

`what is`, `definition`, `how to fly`, `rules`, `laws`, `faa complaint`, `shoot down a drone`, `drone spying`, `near airport rules`

Do not automatically exclude `price`, `cost`, `quote`, `company`, `service`, `realtor`, `commercial`, `construction`, `roof` or `inspection`; those can represent legitimate buying intent.

## Location and schedule controls

- Target presence, not interest: people in or regularly in the selected DFW locations.
- Exclude locations outside the practical service area until travel pricing is intentionally added.
- Initially show call-forwarding ads only during hours when APS Drone can answer or respond quickly.
- Keep form traffic available outside call hours only if the landing page clearly sets response expectations.
- Do not claim an office in Dallas, Fort Worth or another city; APS Drone is a DFW service-area business.

## Ad-message guardrails

Use only verified claims:

- FAA Part 107 certified.
- Insured; COI available where appropriate.
- DFW service area.
- Real-estate aerial photos from $249.
- Photos plus vertical reel from $499.
- Typical edited-photo delivery in 24–48 hours after a successful flight.
- Commercial, construction, thermal, roof and FPV work quoted by scope.

Never promise same-day availability, guaranteed airspace approval, guaranteed findings, survey-grade accuracy, engineering conclusions or a number-one ranking.

## UTM convention

Use a final URL suffix or tracking template that preserves Google click identifiers and adds:

`utm_source=google&utm_medium=cpc&utm_campaign=dfw_search_core&utm_content={adgroupid}-{creative}&utm_term={keyword}`

The website already stores UTM and Google click identifiers in the quote-form submission and sends GA4 contact events.

## Launch checklist

- [ ] Owner approves the maximum daily and monthly budget.
- [ ] Billing and policy status are clean.
- [ ] GA4 and Google Ads are linked and the chosen conversion actions import correctly.
- [ ] Only `generate_lead` and carefully qualified contact actions are Primary; diagnostic events remain Secondary.
- [ ] Search only; Display Network and broad expansion disabled.
- [ ] Presence-based DFW location targeting verified.
- [ ] Exact/phrase themes and required negatives loaded.
- [ ] Each ad group uses its matching landing page.
- [ ] Call schedule matches staffed response hours.
- [ ] Ads, assets and landing pages use the same verified pricing and service claims.
- [ ] No private street/unit address appears.

## First-week operating rules

1. Review Search terms every business day and add irrelevant terms as negatives.
2. Do not make bid, keyword, ad and landing-page changes simultaneously; preserve attribution for each change.
3. Mark leads qualified only after a real project conversation confirms service, location and intent.
4. Record spend, qualified leads and booked revenue; calculate cost per qualified lead, not cost per click alone.
5. Pause any ad group that repeatedly attracts employment, education, hobby, repair or unrelated APS/defense intent.
6. Do not increase budget merely because Google recommends it. Increase only when real qualified-lead economics justify it.

## Stop conditions

Immediately pause the affected campaign or ad group when any of these occurs:

- Conversion tracking stops or produces duplicate/unverifiable leads.
- A policy, billing or account-access warning appears.
- Search terms are dominated by irrelevant or out-of-area intent.
- The approved spend limit is reached.
- Lead quality cannot be determined from the recorded data.
- Landing-page, phone, text or form functionality fails.

The correct launch decision depends on a user-approved budget and real lead economics. This document does not authorize ad spend.
