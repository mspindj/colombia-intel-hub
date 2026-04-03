

# Lead Magnet Email Capture Section

## Summary
Add a "Colombia Arrival Cheat Sheet" email capture section between the Loss Aversion split (ends line 538) and the City Cards section (starts line 542). Integrates with Brevo API for contact collection. Also updates nav and "coming soon" card links.

## Environment Variable
The Brevo API key will be stored as `VITE_BREVO_API_KEY`. Since this is a client-side key exposed in the bundle, it will be added via the secrets tool. The user will need to provide it.

## Changes — `src/pages/Index.tsx`

### 1. New state variables (around line 192)
- `leadEmail: string` — input value
- `leadStatus: 'idle' | 'loading' | 'success' | 'error'` — form state
- `leadError: string` — error message

### 2. `handleLeadSubmit` function (after `scrollToCity`)
- Client-side email validation (regex check)
- POST to `https://api.brevo.com/v3/contacts` with `api-key` header from `import.meta.env.VITE_BREVO_API_KEY`
- Body: `{ email, listIds: [3], updateEnabled: true }`
- Success: `response.ok` or `status === 204` → set status to `'success'`
- Duplicate (`duplicate_parameter` code in response body) → treat as success
- Other errors → set status to `'error'` with message

### 3. New section markup (between line 540 divider and Cities section)
Insert after the Loss Aversion gradient divider:

```
<div className="h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

<section id="free-intel" className="py-24 bg-card">
  <motion.div ...sectionVariants>
    <div className="max-w-xl mx-auto px-6 text-center">
      <!-- Mono label -->
      <p className="font-mono text-xs text-primary/70 tracking-[0.3em] uppercase mb-3">
        FREE INTEL // ARRIVAL CHEAT SHEET
      </p>
      <!-- Headline -->
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
        Land in Colombia like you've been before.
      </h2>
      <!-- Subtext -->
      <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
        Free 1-page PDF — airport hacks, taxi prices, first-day survival moves. No spam, just intel.
      </p>

      <!-- Form or Success -->
      {leadStatus === 'success' ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-primary text-2xl">✓</span>
          <p className="text-foreground font-semibold mt-2">Check your inbox — intel incoming.</p>
        </motion.div>
      ) : (
        <form onSubmit={...}>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="your@email.com" value={leadEmail} onChange={...}
              className="bg-[#0a0a0a] border-border" disabled={leadStatus === 'loading'} />
            <Button type="submit" className="font-mono tracking-wider whitespace-nowrap"
              disabled={leadStatus === 'loading'}>
              {leadStatus === 'loading' ? 'Sending...' : 'Send Me the Cheat Sheet'}
            </Button>
          </div>
          {leadStatus === 'error' && (
            <p className="text-xs text-destructive mt-3">{leadError}</p>
          )}
        </form>
      )}

      <!-- Trust line -->
      <p className="text-xs text-muted-foreground mt-6 font-mono">
        Join 2,847+ travelers who showed up prepared. Unsubscribe anytime.
      </p>
    </div>
  </motion.div>
</section>

<div className="h-px w-full bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
```

### 4. Import `Input` component
Add `import { Input } from "@/components/ui/input"` at top.

### 5. Update nav link (line 235–244)
Change "GET INTEL →" link to point to `#free-intel` with smooth scroll, or add a second nav link "FREE INTEL" alongside it. Will add a "FREE INTEL" link that scrolls to `#free-intel`, keeping the existing "GET INTEL →" for cities.

### 6. Update "coming soon" card links (line 642)
Change the `<span>` "Let us know →" to an `<a href="#free-intel">` so it scrolls to the lead capture section.

## File Summary
| File | Action |
|------|--------|
| `src/pages/Index.tsx` | Add lead capture section, state, submit handler, nav link, update coming-soon links |

