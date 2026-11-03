# Tension Mapun 😂

A Bangla/Banglish entertainment web app: pick your tensions, answer silly questions, watch a dramatic reveal, and get a fictional score, prescription, share card, and crazy poster. Not a mental health tool.

## Run

```bash
npm install
npm run dev
```

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) in production so Open Graph images and share previews use your domain.

## What's inside

- `/` landing, `/tension` category picker + questionnaire, `/result` reveal + dashboard + share cards
- `/prescription` Mapun Clinic prescription (PNG download)
- `/poster` poster studio: WANTED, Bangla cinema, and missing-notice templates with name, details, and optional photo (the photo never leaves the device)
- `/tools/roulette`, `/tools/salary-calculator`, `/battle` (challenge links, no accounts), `/tools/more` (horoscope, boss mood, future simulator, ex detector, excuses, news, sound board, scripted chat)
- `/og?r=<code>` per-result preview image used by shared result links

## How results work

`src/lib/scoring.ts` builds the quiz from the selected categories and turns answers into a share code like `ac-342x3313`. The score and every joke are derived deterministically from that code, so the same answers always give the same result. When you add questions or options, append them to the end of the lists in `src/data/questions.ts` so old links keep working.

## Sound

All sound is synthesized with Web Audio and muted by default. To use your own clips, see `public/sounds/README.md`. Only add audio you have the rights to.
