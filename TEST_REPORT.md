# Toolzy - Functional Test Report

Date: 2026-09-14
Scope: All 9 tools, Home page, Premium/ad system, responsive layout, error handling.

## Summary

| Area | Result |
| --- | --- |
| Core PDF logic (pdf-lib operations) | 10/10 automated checks passed |
| UI wiring for all 9 tools (browser, real file upload -> action -> download) | 9/9 passed |
| Input validation / edge cases | Passed (with 1 bug found and fixed) |
| Error handling (corrupt/invalid file) | 2 bugs found and fixed; all tools now degrade gracefully |
| Premium toggle / ad-slot suppression | Passed |
| Responsive layout (320/375/768/1280px) | Passed (see prior session notes) |

**Overall: all 9 tools are functionally correct. 2 bugs were found during testing and have been fixed in this session (see "Bugs found and fixed" below).**

## Test method

1. **Deterministic logic tests** - `scripts/verify-pdf-lib.mts` (run via `npm run test:pdf-lib`) imports the actual
   `src/lib/pdfUtils.ts` functions and runs them in Node against generated fixture PDFs/images
   (`npm run test:gen-assets` -> `%TEMP%\pdf-toolkit-test-assets`). This validates output page counts and byte
   integrity without relying on browser download interception, which is inherently flaky.
2. **Browser/UI tests** - a live Vite dev server + browser automation (Playwright) driving the real UI: file
   inputs were set with the generated fixtures, buttons clicked, and resulting status text / DOM state asserted.
3. **Negative tests** - a hand-crafted invalid "PDF" (plain text with a `.pdf` extension) was uploaded to every
   tool that accepts a PDF, to verify errors are caught and surfaced instead of crashing the app.

Fixture files used: `sample-1page.pdf`, `sample-2page.pdf`, `sample-5page.pdf`, `red.png`, `white.jpg`, `corrupt.pdf`.

## Results by tool

### Merge PDF
- Uploading 2-3 PDFs renders an ordered file list with working Up/Down/Remove controls. PASS
- Merging 3 PDFs (1+2+5 pages) produced an 8-page output. PASS
- Merge button correctly disabled with < 2 files. PASS
- Uploading one corrupt file alongside a valid one surfaces "Failed to parse PDF document..." instead of crashing. PASS (after fix, see below)

### Split PDF
- Detects and displays page count on upload (5 pages). PASS
- "Extract page range" (pages 2-4) downloads successfully. PASS
- "Split every page (ZIP)" downloads a ZIP successfully. PASS
- From/To inputs clamp `end` to the real page count via `useEffect`. PASS
- Uploading a corrupt file: **found a bug (unhandled promise rejection, no user feedback) - fixed.**

### Remove Pages
- Page-spec parser correctly resolves `"2, 4-5"` -> `[2, 4, 5]`. PASS
- Guard against removing every page (`1-5` on a 5-page doc) disables the button and shows a warning. PASS
- Valid removal (`2, 4-5` on 5 pages) downloads a 3-page result. PASS
- Uploading a corrupt file: **found the same bug as Split PDF - fixed.**

### Rotate PDF
- Rotating a 2-page PDF by 180 degrees downloads successfully; verified via Node test that `PDFPage.getRotation().angle` is set correctly (90 deg case: both pages report angle 90). PASS
- Corrupt file upload: error is caught by the existing `useAsyncTask` wrapper around the Rotate button and displayed inline. PASS

### Compress PDF
- Compressing a 5-page text-only PDF completes and downloads. PASS
- **Behavioral finding (not a bug, but worth flagging):** on this small, already-minimal synthetic PDF, "compression" (pdf-lib object-stream re-serialization) actually *increased* file size (1.9 KB -> 3.3 KB). The UI clamps the displayed percentage to a minimum of 0% so it never shows a misleading negative number, but the downloaded file is objectively larger. This matches the documented limitation in the README ("does not re-encode embedded images... results vary"), but the real-world benefit is limited to PDFs that were not already optimized (e.g. scanned documents, unoptimized Office exports). Recommend clarifying this further in-product (see Recommendations).

### Add Watermark
- Watermarking a 1-page PDF with default text/opacity downloads successfully; output byte size increased as expected (indicates the watermark was actually embedded). PASS
- Empty watermark text correctly disables the "Add Watermark" button. PASS

### Add Page Numbers
- Adding page numbers to a 5-page PDF downloads successfully and preserves the page count. PASS

### Images to PDF
- Uploading a PNG + JPEG renders both thumbnails and converts to a 2-page PDF (1 page per image, both `embedPng`/`embedJpg` code paths exercised). PASS

### PDF to Images
- Single-page PDF -> PNG: converts and downloads a single image file (exercises the pdf.js worker + canvas render pipeline). PASS
- 5-page PDF -> JPEG: converts and downloads a ZIP of 5 images. PASS
- Corrupt file upload: caught by the existing `useAsyncTask` wrapper, shows "Invalid PDF structure." PASS

### Premium / Ad system
- "Simulate Premium Upgrade" flips `isPremium`, persists across a full page reload (localStorage), updates the header badge to "Premium active", and "exit" correctly reverts state. PASS
- With no `VITE_ADSENSE_CLIENT` configured (this repo's default/dev state), zero ad markup renders anywhere on Home or any tool page - confirmed via DOM snapshot. PASS (matches the intended "fail-safe, ads never block functionality" design)

## Bugs found and fixed this session

### Bug 1 & 2: Corrupt/invalid PDF crashes file selection silently (Split PDF, Remove Pages)

**Symptom:** Both `SplitPdf.tsx` and `DeletePages.tsx` called `getPageCount(file)` directly inside their file-select
handler, *outside* of the shared `useAsyncTask` try/catch wrapper. Selecting an invalid PDF caused an unhandled
promise rejection; the UI showed nothing at all (no error, no file, no way to recover except re-uploading a
different file into the same dropzone, which also silently failed).

**Fix:** Both handlers now run the initial `getPageCount` call through a dedicated `useAsyncTask` instance
(`loadTask`), kept separate from the action task (Split/Delete) so a successful load doesn't leak a stale "done"
status into the export button's success message. On failure, the UI now shows the underlying `pdf-lib` error
message plus a "choose another file" recovery action.

**Files changed:** [src/pages/tools/SplitPdf.tsx](src/pages/tools/SplitPdf.tsx), [src/pages/tools/DeletePages.tsx](src/pages/tools/DeletePages.tsx)

**Verified fixed:** re-ran the corrupt-file test against both tools post-fix; error now renders as
`"Failed to parse PDF document (line:0 col:107 offset=52): No PDF header found"` with a working recovery button,
and uploading a valid file afterward recovers correctly.

## Non-bugs verified as already-correct

- Rotate, Compress, Watermark, Page Numbers, PDF-to-Images, Merge all already wrapped their PDF-reading logic
  inside `useAsyncTask`'s `run()`, so corrupt-file uploads were already handled gracefully with no changes needed.
- `AdSlot`'s error boundary and `try/catch` around AdSense script loading were not exercised by these tests (no
  AdSense client configured in this environment) but the code path was reviewed and confirmed to fail closed
  (renders `null`) rather than throwing.

## Recommendations (not implemented, for future consideration)

1. Add a visible caveat on the Compress PDF page when the output would be larger than the input (compare
   `compressed.byteLength` vs `file.size` and show a "this file was already optimized" message instead of "0%
   smaller").
2. Consider adding a lightweight automated browser test suite (e.g. Playwright test files committed to the repo)
   so the UI-level checks performed manually in this session can be re-run in CI. Currently only the pure-logic
   layer (`npm run test:pdf-lib`) is committed as a repeatable script.

## How to re-run these tests

```bash
npm run test:gen-assets   # regenerates fixture PDFs/images into %TEMP%\pdf-toolkit-test-assets
npm run test:pdf-lib      # runs the 10 deterministic pdf-lib checks (Node, no browser needed)
npm run build             # full type-check + production build
```
