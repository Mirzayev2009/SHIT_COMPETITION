# Browser verification

Checked the rendered landing page, input workspace, and demo results at 320, 390, 768, 1024, and 1440 pixels in English, Uzbek, and Russian. The 45 measurements in `responsive-checks.json` show no horizontal document overflow. Also checked the landing page in 844 × 390 landscape.

Verified mobile navigation and section links; sample analysis; language switching; temporary checklist; exact source highlighting; mobile source drawer; drawer closing on resize to desktop; quiz feedback and all three questions; completion state; and questions-copy success feedback. Browser error log was empty during these checks.

Mobile input uses 16px text. Results use 15px body text and controls with 44px minimum touch targets. At 1024px, results show the original source beside the care plan. Narrower screens use the source drawer with fixed close/back controls and an independently scrolling document.

Screenshots are in this directory. This is browser viewport testing, not a claim of physical-device testing on iOS or Android. No real patient data or paid AI request was used. The live provider path was checked using mocked SDK responses in the source/API tests.
