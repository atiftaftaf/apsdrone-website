# APS Drone Google Video Indexing Verification

Verified: August 30, 2026, 12:51–12:53 PM Central

## Search Console stored state

- Overview reported **1 video page not indexed** and **0 videos indexed**.
- A second authenticated check later on August 30 showed the same totals. The report's last stored update was August 26, before the four new watch pages were deployed.
- The one stored failure remains `Video isn't on a watch page`; it is an older URL record and does not contradict the four successful live watch-page tests below.
- The four new watch-page URLs were not in Google's stored index at the time of inspection and were reported as unknown/not indexed.
- The stored record did not yet detect a referring sitemap for the inspected new URLs.

## Live URL Inspection results

Search Console's live test fetched each public watch page. No indexing request was submitted during this verification.

| Watch page | Stored index state | Live page availability | Live video discovery | Structured video result |
| --- | --- | --- | --- | --- |
| `https://apsdrone.com/dfw-residential-drone-video/` | Not indexed / unknown to Google | URL is available to Google | Video detected | 1 valid item detected |
| `https://apsdrone.com/dfw-commercial-drone-video/` | Not indexed / unknown to Google | URL is available to Google | Video detected | 1 valid item detected |
| `https://apsdrone.com/dfw-fpv-business-tour-video/` | Not indexed / unknown to Google | URL is available to Google | Video detected | 1 valid item detected |
| `https://apsdrone.com/dfw-real-estate-vertical-drone-reel/` | Not indexed / unknown to Google | URL is available to Google | Video detected | 1 valid item detected |

## Conclusion

The four pages pass Google's current live eligibility and video-detection checks. The remaining issue is discovery/index processing, not a demonstrated technical VideoObject or crawlability failure.

## Next action

1. Submit `https://apsdrone.com/video-sitemap.xml` in the authenticated Search Console property.
2. Request indexing once for each of the four watch pages.
3. Recheck the Video indexing report after Google has time to process the sitemap and requests.
4. Do not repeatedly resubmit the same URLs; repeated requests do not increase queue priority.

## Submission readiness

- Search Console currently lists only `/sitemap.xml`, submitted and last read August 30 with `Success`, 13 discovered pages and 0 discovered videos.
- The authenticated APSDroneTX sitemap form is filled with `video-sitemap.xml`; the final Submit control is enabled but has not been clicked.
- The final sitemap submission and four indexing requests remain external Google actions and were intentionally left pending action-time confirmation.
