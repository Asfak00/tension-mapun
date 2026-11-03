# Tension Mapun 😂

A Bangla/Banglish entertainment web app: pick your tensions, answer silly questions, watch a dramatic reveal, and get a fictional score, prescription, share card, and crazy poster. Not a mental health tool.

Source: [github.com/Asfak00/tension-mapun](https://github.com/Asfak00/tension-mapun)

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion, Zustand, `html-to-image` for PNG downloads, and Vercel Analytics.

## Run

```bash
npm install
npm run dev
```

Other scripts: `npm run build`, `npm start`, `npm run lint`.

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) in production so Open Graph images and share previews use your domain.

## Deploy

Built for Vercel. Set `NEXT_PUBLIC_SITE_URL` in the project settings and enable Web Analytics in the Vercel dashboard. The `<Analytics />` component in `src/app/layout.tsx` only sends data from Vercel deployments, so local development is not tracked.

## What's inside

- `/` landing, `/tension` category picker + questionnaire, `/result` reveal + dashboard + share cards
- `/prescription` Mapun Clinic prescription (PNG download)
- `/poster` poster studio: WANTED, Bangla cinema, and missing-notice templates with name, details, and optional photo (the photo never leaves the device)
- `/tools/roulette`, `/tools/salary-calculator`, `/battle` (challenge links, no accounts), `/tools/more` (horoscope, boss mood, future simulator, ex detector, excuses, news, sound board, scripted chat)

## Share images

- `src/app/opengraph-image.tsx` and `twitter-image.tsx` render the site-wide preview.
- `/og?r=<code>` renders the per-result preview used by shared result links.
- Both use `OgFrame` and `ogImage` in `src/lib/og.tsx`, which load the Unbounded font from `src/assets/fonts` (SIL Open Font License). Text stays Latin because the `next/og` renderer cannot shape Bangla script.
- The footer bar shows the host from `NEXT_PUBLIC_SITE_URL`.

## How results work

`src/lib/scoring.ts` builds the quiz from the selected categories and turns answers into a share code like `ac-342x3313`. The score and every joke are derived deterministically from that code, so the same answers always give the same result. When you add questions or options, append them to the end of the lists in `src/data/questions.ts` so old links keep working.

## Sound

All sound is synthesized with Web Audio and muted by default. To use your own clips, see `public/sounds/README.md`. Only add audio you have the rights to.
