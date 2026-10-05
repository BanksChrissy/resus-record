# Resus Record

[Open the app](https://bankschrissy.github.io/resus-record/)

Tablet-first resuscitation event documentation with quick CPR controls, staff color attribution, a collapsible event log, and PDF export.

## Testing build

Clinical validation is pending. This is not an AHA-endorsed product. References summarize 2025 AHA guidance; independent clinical review and testing on the intended tablet are required before live care.

## Use

Open the app online and wait for **Offline ready**. Keep the page open during a run. Use **Export PDF** to download the event log before refreshing or closing the page.

Runs and team rosters exist only in browser memory. They are not uploaded to GitHub or saved between sessions. Only the application files are cached for offline use. Browser cache eviction may remove offline availability. Keep run labels and free text non-identifying.

## Hosting

The static app files are at the repository root. GitHub Pages publishes the `main` branch root. No build step or backend is needed. Serve over HTTPS or localhost; opening index.html directly as a file will not support the app properly.

PDF-LIB is vendored with its license in PDF-LIB-LICENSE.md.
