# APS Drone Google Video Indexing Verification

Verified: August 30, 2026, 12:51–12:53 PM Central

## Search Console stored state

- Overview reported **1 video page not indexed** and **0 videos indexed**.
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
