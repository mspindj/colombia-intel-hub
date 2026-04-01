

# Scroll Animations with Framer Motion

## Summary
Add framer-motion and implement subtle, premium scroll-triggered animations across all sections of the landing page. Only opacity and transform properties are animated. All animations respect `prefers-reduced-motion`.

## Changes

### 1. Install `framer-motion`
Add `"framer-motion": "^11.18.0"` to `package.json` dependencies.

### 2. Create animation utilities — `src/lib/animations.ts` (new file)
Centralized animation config to keep Index.tsx clean:
- `sectionVariants` — fade-in + slideY(30px→0), 0.7s, custom easing
- `heroChildVariants` — fade-in + slideY(20px→0), 0.6s, staggered via parent
- `staggerContainer(delay)` — parent variant that staggers children
- `slideFromLeft` / `slideFromRight` — for identity split columns
- `scaleReveal` — for bundle price (scale 0.9→1 + opacity)
- `reducedMotionCheck` — returns `{ initial: false }` props when `prefers-reduced-motion` is set
- Mobile-aware: reduce translateY values by 50% using a `useIsMobile()` check or CSS media query approach

### 3. Create `CountUp` component — `src/components/CountUp.tsx` (new file)
- Accepts `end: number`, `duration: number`, `suffix: string`
- Uses `useInView` from framer-motion to trigger
- Animates from 0 to `end` over 1.5s with ease-out
- Fires once only
- Renders formatted number with suffix

### 4. Rewrite `src/pages/Index.tsx`

**Imports**: Add `motion`, `useScroll`, `useMotionValueEvent` from framer-motion, plus the animation utilities and CountUp.

**Reduced motion hook**: Add `const prefersReducedMotion = useReducedMotion()` from framer-motion. When true, all `motion` elements get `initial={false} animate={false}`.

**NAV** (lines 195–215):
- Already has `transition-all duration-300` — no change needed, just confirm easing is smooth.

**HERO** (lines 218–283):
- Wrap hero content div in `motion.div` with stagger container (no scroll trigger — fires on mount)
- Each child (identity label, classified label, H1, subtitle, social proof, urgency, CTAs, micro-commitment) becomes `motion.p` / `motion.h1` / `motion.div` with `heroChildVariants` and incrementing custom delay (0.2s, 0.4s, 0.6s, 0.8s, 1.0s)
- Replace `2,847+` text with `<CountUp end={2847} suffix="+" />`, `4.9` with `<CountUp end={4.9} decimals={1} />`, `3` with `<CountUp end={3} />`
- Replace bouncing chevron with a pulsing opacity animation (0.4→1→0.4, 2s cycle) that hides after scroll passes hero using `useScroll` + `useMotionValueEvent`

**WHAT'S INSIDE** (lines 286–308):
- Wrap section header in `motion.div` with `sectionVariants`, `whileInView`, `viewport={{ once: true, amount: 0.15 }}`
- Wrap grid in `motion.div` stagger container (0.06s per child)
- Each chapter card becomes `motion.div` with fade+slideY(20px), 0.5s

**TESTIMONIALS** (lines 310–346):
- Same section reveal for header
- Grid becomes stagger container (0.1s per child)
- Each card: `motion.div` with fade+slideY(20px), 0.6s

**IDENTITY SPLIT** (lines 348–425):
- Section header: standard section reveal
- Left column: `motion.div` with `slideFromLeft` (translateX -20px→0)
- Right column: `motion.div` with `slideFromRight` (translateX 20px→0), 0.2s delay
- CTA below: standard fade-in

**CITY CARDS** (lines 427–508):
- Section header: standard section reveal
- Grid: stagger container (0.08s per child)
- Each available city card: `motion.div` with `whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(accent, 0.2)" }}` using city-specific accent colors
- Coming soon cards: no hover glow, just the stagger entrance

**BUNDLE** (lines 511–545):
- Section reveal for container
- `$51` price: appears first (delay 0)
- `$37` price: `motion.span` scale 0.9→1 + opacity 0→1, delay 0.3s

**FAQ** (lines 547–573):
- Standard section reveal for header + accordion container

**FOOTER** (lines 576–614):
- Simple fade-in on scroll

### 5. Performance
- All animations use only `opacity` and `transform`
- `will-change: transform` applied via style prop on animated elements
- All `whileInView` use `viewport={{ once: true }}`
- `useReducedMotion()` disables all animations for accessibility

## File Summary
| File | Action |
|------|--------|
| `package.json` | Add framer-motion dependency |
| `src/lib/animations.ts` | New — animation variants & config |
| `src/components/CountUp.tsx` | New — animated number counter |
| `src/pages/Index.tsx` | Wrap elements in motion components |

