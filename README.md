# Hannah Gabion — Marketing & Multimedia

A responsive React + TypeScript portfolio with a featured gallery, separate
school/freelance collections, accessible project viewers, and playable videos.

## Deliverables

- `../DELIVERY/site/`: ready-to-upload static website. Upload **this entire folder**.
- `../DELIVERY/Hannah-Gabion-Website.zip`: the same website as a ZIP archive.
- This `website/` folder: editable source, media preparation scripts, and tests.

The original `SCHOOL PROJECTS` and `FREELANCE WORKS` folders are unchanged.
All 18 original works are represented once, alongside six YouTube
videos: 9 featured projects and 15 additional projects. The family bonding video
is excluded at the user’s request.

## Preview and edit

Requires Node.js 22.12+ and pnpm. Use `pnpm install`, then `pnpm dev`.
For a production preview, run `pnpm build` and `pnpm preview`.
Use an HTTP server; opening `index.html` with `file://` cannot load the app or HLS.

Edit `src/content.ts` to update the biography, contacts, project titles, categories,
descriptions, featured selection, social links, and tool list. Styling lives in
`src/styles.css`. `src/media-index.json` records dimensions, durations, and the
original file mapped to each project.

## Deployment

The GitHub Pages deployment target is https://hannahgabion.github.io/.
Source repository: https://github.com/hannahgabion/hannahgabion.github.io.

The public repository contains this website source and its optimized viewing
assets. It excludes original source media, `.tools`, local speech models,
temporary audio, browser reports, `node_modules`, and local credentials.

Pushes to `main` run `.github/workflows/deploy-pages.yml`. The workflow installs
pinned dependencies, checks the content manifest, builds the portfolio, and
publishes the build through GitHub Pages. Deployment status is visible in the
repository's Actions tab. To update the website, edit locally, run the checks,
commit, and push to `main`.

`PORTFOLIO_BASE_PATH` defaults to `/`. The workflow obtains the correct base path
from GitHub Pages, so all navigation, images, captions, and video streams also
work if the site is later deployed as a repository subpath. Set
`PORTFOLIO_SITE_URL` to the full public site URL when building for absolute
social metadata and canonical links.

For another static host, upload `../DELIVERY/site/`. `netlify.toml` provides an
alternative source-build configuration. No database, API keys, or paid services
are required by the website itself. Hosting provider plan limits apply.

## Media and captions

Local video files are H.264/AAC HLS streams, with short segments under 25 MiB.
Safari uses native HLS; other compatible browsers load `hls.js` on demand.
Original high-resolution videos and images are not part of the public build.
The build is approximately 215 MB; it includes every local video's viewing copy.

Local captions/transcripts were generated from the actual audio with a local,
multilingual Whisper model. Transcription mistakes were corrected where clear;
remaining automatic text is visibly labelled and should receive a final listening
review, particularly the English/Filipino documentary. This is not a claim of
fully human-verified captions or complete WCAG conformance.

`public/captions/<project-id>.json` supplies readable transcripts. Local `.vtt`
files supply caption tracks. Keep the two files consistent when correcting text.
Bite the Beach uses its YouTube creator-supplied English captions. The other
five YouTube companions use labelled automatic captions. Background soundtrack
lyrics are represented as music cues rather than reproduced in the transcript.

To regenerate images and HLS streams, install `Pillow`, `av`, and `imageio-ffmpeg`
in `.tools/python`, then run `scripts/prepare-media.py` from this source folder.
The script expects originals in the parent portfolio folder and the original
portrait attachment at its recorded path. Existing completed HLS streams are
reused. Install `faster-whisper` there to run `scripts/prepare-captions.py`.
The speech model, temporary WAV files, downloaded metadata, caches, and Python
packages live in `.tools/` and are never included in the public build.

## Checks

- `pnpm build`: TypeScript and production build.
- `pnpm test`: gallery completeness, original-to-project mappings, captions,
  HLS completion, segment availability, résumé, logos, and hosting asset limits.
- Serve `dist/` at `http://127.0.0.1:4173`, then run
  `node scripts/browser-check.mjs`: accessibility scans, responsive layouts,
  keyboard/focus behavior, all video players, transcripts, and seeking.
- Set `PORTFOLIO_TEST_URL` to test another HTTP origin. Browser reports and
  screenshots are kept in `.qa/` (not published).

## Credits

- Project media, portrait, biography, and résumé: Hannah Michelle E. Gabion.
- Premiere Pro, Photoshop, Canva, and Figma logos: SVGL's brand asset library,
  https://github.com/pheralb/svgl. CapCut icon: Usertoop, Wikimedia Commons,
  https://commons.wikimedia.org/wiki/File:Capcut-icon.svg (public-domain geometry).
  Brand marks identify the software Hannah uses; no affiliation is implied.
- DM Sans and Cormorant Garamond: Google Fonts, SIL Open Font License;
  self-hosted to avoid a visitor dependency on Google's font service.
- Interface icons: Lucide (ISC license).

The Himala and Hey Babe! pieces are identified as school poster studies. Film
and cast credits embedded in those original artworks are retained.
