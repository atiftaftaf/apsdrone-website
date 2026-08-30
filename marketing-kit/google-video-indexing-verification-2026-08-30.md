# APS Drone Google Video Indexing Verification

Verified: August 30, 2026, 12:51–12:53 PM Central

## Search Console stored state

- Overview reported **1 video page not indexed** and **0 videos indexed**.
- A second authenticated check later on August 30 showed the same totals. The report's last stored update was August 26, before the four new watch pages were deployed.
- The one stored failure remains `Video isn't on a watch page`; it is an older URL record and does not contradict the four successful live watch-page tests below.
- The four new watch-page URLs were not in Google's stored index at the time of inspection and were reported as unknown/not indexed.
- The stored record did not yet detect a referring sitemap for the inspected new URLs.
- A later August 30 recheck confirmed that the Video indexing report itself was still dated August 26 and still contained only the homepage `hero-dfw.mp4` example. It therefore does not yet reflect the four August 30 watch pages or the now-successful video sitemap.

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

## Completed discovery actions

- Submitted `https://apsdrone.com/video-sitemap.xml` once in the authenticated APSDroneTX Search Console property.
- Search Console accepted the sitemap with `Success` and reported four discovered pages and four discovered videos.
- Requested indexing once for each of the four watch pages after its successful live URL test.
- No duplicate sitemap or URL request was submitted.

## Processing follow-up

1. Wait for Google to recrawl and process the already submitted sitemap and watch pages.
2. Recheck both the Video indexing report and the Videos enhancement report after their stored dates advance beyond the August 30 deployment.
3. Do not treat the older homepage hero-video warning as a watch-page validation target.
4. Do not repeatedly resubmit the same URLs; repeated requests do not increase queue priority.
