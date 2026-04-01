

# Loss Aversion Rewrite — Identity Split Comparison

## Summary
Replace the current 3-stat-card Loss Aversion section (lines 363–397) with a 2-column identity comparison layout: "The Tourist" vs "The Prepared Traveler".

## Changes — `src/pages/Index.tsx` only

### 1. Remove `lossStats` data array
No longer needed — the comparison content will be inline.

### 2. Replace section (lines 363–397)

New structure:
```
{/* LOSS AVERSION — IDENTITY SPLIT */}
<section py-20 bg-card>
  <div max-w-5xl>
    <p> "INTEL COST ANALYSIS" — monospace, gold, tracking-wide </p>
    <h2> "Two types of travelers land in Colombia every day." </h2>

    <div grid grid-cols-1 md:grid-cols-2 gap-0>

      <!-- LEFT: The Tourist -->
      <div bg-background border border-border rounded-l-lg p-8>
        <h3 font-mono text-muted-foreground tracking-wide uppercase mb-6>THE TOURIST</h3>
        <ul space-y-4>
          4 items, each with red ✕ (text-[#c0392b]) + text-muted-foreground text-sm
        </ul>
        <p mt-6 text-xs text-[#c0392b]/80 font-mono>
          "Total cost of not knowing: $100+ and a ruined first impression"
        </p>
      </div>

      <!-- Vertical divider (hidden on mobile, shown md+) -->
      <!-- On mobile: horizontal <Separator /> between columns -->

      <!-- RIGHT: The Prepared Traveler -->
      <div bg-background border border-border rounded-r-lg p-8 border-l-[3px] border-l-primary>
        <h3 font-mono text-primary tracking-wide uppercase mb-6>THE PREPARED TRAVELER</h3>
        <ul space-y-4>
          4 items, each with gold ✓ (text-primary) + text-foreground text-sm
        </ul>
        <p mt-6 text-xs text-primary/80 font-mono>
          "Cost of preparation: $17 — less than that overpriced taxi ride"
        </p>
      </div>
    </div>

    <!-- CTA below -->
    <div text-center mt-12>
      <Button gold solid, scrolls to #cities or Gumroad>
        "BECOME THE PREPARED TRAVELER"
      </Button>
      <p font-mono text-xs text-muted-foreground mt-3>
        "Instant PDF download. Read it on the plane."
      </p>
    </div>
  </div>
</section>
```

### 3. Mobile responsiveness
- On mobile (`grid-cols-1`): columns stack vertically with a horizontal separator between them
- On desktop (`md:grid-cols-2`): side-by-side with the right column's left border acting as divider
- Left column gets `rounded-t-lg md:rounded-l-lg md:rounded-tr-none`, right gets `rounded-b-lg md:rounded-r-lg md:rounded-bl-none`

### 4. Cleanup
Remove the `lossStats` array from the data section (~lines 115–130).

