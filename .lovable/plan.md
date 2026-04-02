

# Final CTA + Visual Polish

## Summary
Six improvements: final CTA section, gradient section dividers, back-to-top button, fixed social links, "coming soon" city card text, and SEO meta updates.

## Changes

### 1. Final CTA Section — between FAQ and Footer (after line 720)
New section with gradient background (`bg-gradient-to-b from-card to-background`):
- Monospace label: "FINAL BRIEFING" (gold)
- Headline: "Still scrolling? Your trip is closer than you think."
- Subtext paragraph
- Two CTA buttons: primary "$17" + outline "$37"
- Social proof line with CountUp for 2,847+
- Wrapped in `motion.div` with `sectionVariants`

### 2. Gradient Section Dividers
Create a reusable `<GradientDivider />` inline component — a `<div>` with `h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent`. Insert between every major section (after hero, after what's inside, after testimonials, after identity split, after cities, after bundle, after FAQ).

### 3. Back-to-Top Button
Add state `showBackToTop` using the existing `useScroll` + `useMotionValueEvent` (already in use for hero chevron). Renders a fixed `motion.button` at `bottom-6 right-6`, 40x40px, rounded-full, `bg-primary text-primary-foreground`, with `ChevronUp` icon. Fades in/out with `AnimatePresence`. Smooth scrolls to top on click.

### 4. Fix Footer Social Links (line 747)
- Pinterest URL → `https://www.pinterest.com/megustacolombia`
- Facebook/Instagram remain generic for now

### 5. Coming Soon City Cards — "Want this city?" text (after line 627)
Below the disabled "COMING SOON" button, add:
```
<p className="text-xs text-muted-foreground mt-2 font-mono">
  Want this city? <span className="text-primary cursor-pointer hover:underline">Let us know →</span>
</p>
```

### 6. SEO Meta Tags — `index.html`
- Update `og:image` to point to a city banner (use one of the uploaded images path)
- Update `meta description` to the new copy
- Add a favicon link (use a simple gold-themed SVG data URI for a map pin icon)

## File Summary
| File | Action |
|------|--------|
| `src/pages/Index.tsx` | Add final CTA section, gradient dividers, back-to-top button, fix social links, add coming-soon text |
| `index.html` | Update meta description, og:image, add favicon |

