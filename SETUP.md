# Find Your Own Snowboard — Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your affiliate ID when you get it

# 3. Run dev server
npm run dev
# → Open http://localhost:3000
```

## Deploy to Vercel (free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env variables in Vercel dashboard:
# EVO_AFFILIATE_ID = your Impact affiliate ID
```

## Project Structure

```
data/boards.json          ← ⭐ Core data — add/edit boards here
lib/
  types.ts                ← TypeScript types
  matcher.ts              ← Matching algorithm (scoring logic)
  translations.ts         ← EN/ZH UI strings
app/
  page.tsx                ← Home page (filter form)
  results/                ← Results page
  api/
    recommend/            ← GET /api/recommend?height=...
    redirect/[boardId]/   ← GET /api/redirect/burton-custom-2025
components/
  BoardCard.tsx           ← Board result card UI
```

## Adding / Updating Boards

Edit `data/boards.json`. Each board needs:

- `id`: unique slug (e.g. `burton-custom-2025`)
- `brand`, `name`, `year`
- `price_usd`, `lengths[]`, `flex` (1–10)
- `profile`, `shape`
- `terrain[]`, `style[]`, `level[]` — **these drive matching quality**
- `weight_range_kg`, `height_range_cm`
- `retailers.evo.url` — EVO product page URL

## Affiliate Setup (EVO via Impact)

1. Apply at https://www.evo.com/affiliate-program (powered by Impact.com)
2. Once approved, get your affiliate ID from the Impact dashboard
3. Add it to `.env.local`: `EVO_AFFILIATE_ID=your_id`
4. Update `buildAffiliateUrl()` in `app/api/redirect/[boardId]/route.ts`
   with the exact link format from Impact's dashboard

All user clicks to EVO go through `/api/redirect/[boardId]` — this is
where you can log analytics and attach affiliate parameters.

## Future: AI Explanations

Add to `.env.local`:
```
ANTHROPIC_API_KEY=your_key
```

Then create `app/api/explain/route.ts` to call Claude with board specs
and user profile to generate personalized explanations.
