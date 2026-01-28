---
description: "Zero-Lie Deployment: Strict verification process including IAP & App Store release"
---

# Zero-Lie Deployment Protocol
This workflow enforces strict verification to prevent "fake completion". You MUST pass all gates before running `eas build`.

## Gate 1: Code Integrity (Static Analysis)
// turbo
1. Run `npx tsc --noEmit` to ensure Zero TypeScript Errors.
   - If exit code != 0, STOP. Fix errors immediately.
   - **Verification**: Output must be empty or "Found 0 errors".

## Gate 2: Code Quality (Lint)
// turbo
2. Run `npx eslint .` to check for potential runtime errors.
   - If critical errors exist, STOP.

## Gate 3: Native Compatibility (The Truth Moment)
3. Run `npx expo run:ios` (or android) to simulate a real build.
   - This validates native modules (like IAP, Sensors) and permissions (Info.plist).
   - **CRITICAL**: Do not proceed until you see "Build Succeeded" or the app launches in the simulator.
   - **FORBIDDEN**: Do not run `eas build` if this step fails.

## Gate 4: IAP & Payment Verification (Business Critical)
4. Manually verify `lib/iap.ts` and `purchase.tsx`:
   - [ ] Is `purchaseUpdatedListener` registered? (Required for Async/Ask-to-Buy transactions)
   - [ ] Is `finishTransaction` called after receipt validation? (Prevents missing items/deadlocks)
   - [ ] Is there a Fail-Safe for reviewers/testers (e.g. Beta Access)?
   - **STOP**: If any of these are missing, DO NOT DEPLOY.

## Gate 5: Final Submission
5. Only after Gate 3 & 4 pass, run `eas build --platform ios --auto-submit`.
   - Ensure `app.json` version is bumped if needed.

## Gate 6: Post-Release Verification (Definition of Done)
6. The task is NOT done until the app is "Waiting for Review" or "Ready for Sale".
   - Monitor EAS/TestFlight status.
   - Verify IAP products are loaded in TestFlight (even if purchase fails, products must load).
