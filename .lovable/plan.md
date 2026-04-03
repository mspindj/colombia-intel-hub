

# Quick Fixes: Favicon, Hero H1 Line Break

## 1. Fix broken favicon tag — `index.html` line 16

The current favicon `<link>` tag is malformed — the `href` contains unescaped HTML entities and a broken SVG that leaks raw text (`pin " type="image/svg+xml" />`) onto the page. Replace line 16 with a properly formatted SVG data URI favicon:

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📍</text></svg>" type="image/svg+xml" />
```

## 2. Bundle URLs — Already correct

All 3 bundle links already point to `https://megustacomco.gumroad.com/l/explorer-bundle`. No changes needed.

## 3. Hero H1 mobile line break — `src/pages/Index.tsx` line 275–276

Add a `<br className="sm:hidden" />` before "You won't." so it wraps to its own line on mobile but stays inline on larger screens:

```tsx
Tourists get scammed, overpay, and waste their first 3 days.
<br className="sm:hidden" />
{" "}<span className="text-primary">You won't.</span>
```

## File Summary
| File | Change |
|------|--------|
| `index.html` | Fix malformed favicon link tag |
| `src/pages/Index.tsx` | Add responsive `<br />` in H1 |

