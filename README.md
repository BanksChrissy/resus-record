# Resus Record

Tablet-first, single-operator resuscitation documentation. Static app, no backend, no run persistence. Only the application shell is stored in the service-worker cache. Export is a client-generated PDF.

## Clinical scope

This is a testing build, not a clinically validated medical device or an AHA-endorsed product. Adult and pediatric references are independently implemented summaries of the linked 2025 AHA / AHA-AAP sources in `dist/clinical.mjs`. Neonatal resuscitation at birth is excluded. Cause-specific medicines remain protocol-specific rather than receiving invented universal doses.

Dose and energy calculations are references, never automatic orders or administrations. Enter actual medication status, dose, units, route, concentration and volume. The device clock supplies event times. The app cannot detect clinical state or verify entered values against the patient.

## Offline and privacy behavior

Load the app online and wait for **Offline ready**. The app then works without internet, including PDF export. Source links require internet. Browser storage eviction can remove the cached app. No patient identifier fields are provided. Free-text entries must remain non-identifying; the app cannot guarantee their contents.

Run data lives in JavaScript memory only. Reloading, closing, browser eviction or a crash loses the run. Leave-page warnings depend on browser behavior. Export and verify the PDF before leaving. Timers are foreground visual reminders; device sleep or browser suspension can delay display. Wake lock is requested where supported.

## Local development

Serve `dist/` on localhost with a static server. JavaScript modules and service workers require HTTP localhost or HTTPS, not a file URL. No installation or build step is required. PDF-LIB is vendored with its license, avoiding an online dependency at runtime.

## Validation

Calculator boundary checks cover weight requirements, adult/pediatric distinctions, drug maxima, repeat-dose limits, energy ceilings and dose/volume conversion. Browser tests exercise documentation, corrections, closure, no persistent run storage, PDF export offline, offline reload and tablet/mobile layouts. Real tablet Safari and Android browser evaluation and independent clinical validation remain necessary before live care.

The optional section-navigation WebMCP interface is feature-detected. Native WebMCP was unavailable in the local test browser; that optional interface could not be validated in a supported context.

## Quick logging and team attribution (v1.1)

CPR start, pause, resume and stop, ROSC, rearrest and compressor changes log at the tap time. Optional details can be added from the confirmation strip or timeline without changing that timestamp. Undo records an audit-preserving void and restores the effective timer state.

Add staff names / initials with colors under Add team. Select the person who performed the action in the persistent team strip; each form can override the performer for that entry. The recorder remains separate. Event names and colors are snapshots, so renaming or removing a teammate does not rewrite historical attribution. The PDF includes the roster, color markers, names and amendment history. Neither roster nor run survives reload.

The updated service worker activates the new application shell without automatically reloading an open run. Export any active run before reloading to see an update.

## Rapid entry update

The live screen logs common events in one or two taps. Any event starts a run without mandatory setup. Rhythm, airway, access, and medication choices log on selection. Full forms remain available under Full forms & assessments. Finish details lists quick entries needing review; later details preserve event timestamps and performer snapshots. Unknown medication doses are excluded from totals and explicitly flagged in the PDF.

## Hot medication presets

The Epinephrine timer card and the three hot medication buttons open explicit dose-and-route selections before recording. Selecting one records a single administered cardiac-arrest bolus, timestamp, performer snapshot, preset source and any weight calculation. Closing the picker records nothing. Further details are optional; different doses/routes use the full entry form.

Adult presets from user-supplied Meds.pdf (pages 1, 2, 4): epinephrine 1 mg IV or IO using 0.1 mg/mL; amiodarone 300 or 150 mg IV or IO; lidocaine 1 or 0.5 mg/kg IV or IO. Weight-dependent choices require a weight and measured/estimated basis. They display calculated mg, not just mg/kg. There is no automatic dose sequencing or repeat-dose recommendation.

Pediatric arrest presets use 2025 AHA PALS: epinephrine 0.01 mg/kg capped at 1 mg; amiodarone 5 mg/kg capped at 300 mg first / 150 mg subsequent; lidocaine 1 mg/kg. Adult fixed doses never appear in pediatric mode. This does not represent independent clinical validation of the full user-provided medication document.

Sources checked: https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Accessible/Algorithm-ACLS-CA-LngDscrp-250725-Ed.pdf and https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Accessible/Algorithm-PALS-CA-LngDscrp-250729-Ed.pdf
