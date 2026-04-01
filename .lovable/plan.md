

# Hero Restructure Implementation

## Summary
Replace the current hero section (lines 182–230) with the new identity-framing copy, social proof, urgency, updated CTAs, and a 3-image crossfade background.

## Changes — `src/pages/Index.tsx` only

### 1. Imports (line 14)
- Add imports for `mdeBg` and `ctgBg` (medellin_background.jpg, cartagena_background.jpg)
- Create a `heroBgs` array: `[heroBg, mdeBg, ctgBg]`

### 2. State & Effect (after line 145)
- Add `const [bgIndex, setBgIndex] = useState(0)`
- Add `useEffect` with `setInterval(() => setBgIndex(i => (i + 1) % 3), 4000)` and `return () => clearInterval(id)` for proper cleanup

### 3. Hero Background (lines 184–188)
Replace single background div with 3 stacked absolute divs, each with:
- `bg-cover bg-center absolute inset-0 transition-opacity duration-1000`
- Active image: `opacity-100`, others: `opacity-0`
- Dark overlay div remains on top

### 4. Hero Content (lines 189–228)
Replace entirely with this structure:
1. **Identity filter**: "FOR TRAVELERS WHO REFUSE TO WING IT" — `font-mono text-xs tracking-[0.3em] uppercase text-primary/60`
2. **Classified label**: "CLASSIFIED // FIRST-TIMER PROTOCOL" — kept as-is
3. **New H1**: "Tourists get scammed, overpay, and waste their first 3 days. **You won't.**" — last two words in `text-primary`
4. **New subtitle**: "Every city has cheat codes the locals don't post online. We put them in a 72-hour tactical briefing — so you land prepared, not panicked."
5. **Social proof row**: `2,847+ briefed | ⭐ 4.9 avg rating | 3 cities covered` — monospace, text-xs, numbers in foreground, labels in muted, separated by `|` dividers
6. **Urgency**: "Your flight is booked. The clock started." — italic, text-sm, muted
7. **CTAs**: "GET YOUR CITY BRIEFING — $17" (solid, scrolls to cities) + "ALL 3 CITIES — $37 (SAVE 27%)" (outline, links to Gumroad)
8. **Micro-commitment**: "Takes 45 minutes to read. Covers your entire first 72 hours." — text-xs, monospace, muted
9. **Bouncing chevron** — kept

## Technical Notes
- Crossfade uses CSS `transition-opacity duration-1000` on 3 layered divs — no extra library needed
- Interval cleanup via `return () => clearInterval(id)` prevents memory leaks
- No other files modified

