

# Testimonials Section — Between "What's Inside" and "Loss Aversion"

## Summary
Add a testimonials section with 4 cards in a 2-column grid at line 284, between the chapters grid and the loss aversion section.

## Changes — `src/pages/Index.tsx` only

### 1. Add testimonials data array (after the existing data arrays, ~line 130)
Array of 4 testimonial objects with fields: `name`, `location`, `city`, `badge`, `badgeAccent`, `stars`, `quote`, `keyResult`.

### 2. Insert new section (line 284, between `</section>` of chapters and `{/* LOSS AVERSION */}`)

Structure:
```
{/* TESTIMONIALS */}
<section className="py-20 sm:py-28 bg-card">
  <div className="max-w-6xl mx-auto px-4 sm:px-6">
    <p> "FIELD REPORTS // POST-LANDING INTEL" — monospace, gold, tracking-wide </p>
    <h2> "They landed prepared. Here's what happened." </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map → card}
    </div>
  </div>
</section>
```

### 3. Testimonial card design
Each card:
- `bg-card border border-border rounded-lg p-6 border-l-[3px] border-l-primary hover:shadow-lg hover:shadow-primary/5 transition-all`
- Top row: city badge pill (accent-colored bg with white text, rounded-full, text-xs, monospace) + 5 gold stars (★ characters in text-primary)
- Quote in `text-muted-foreground text-sm leading-relaxed italic`
- Key result line below quote: `text-primary font-bold text-sm mt-3` — pulled out as separate element
- Bottom: name + location in `font-mono text-xs text-muted-foreground mt-4`

### 4. Badge accent mapping
Reuse existing `accentTextClass` or create badge bg classes:
- bogota → `bg-[#c0392b]/20 text-[#c0392b]`
- medellin → `bg-[#27ae60]/20 text-[#27ae60]`
- cartagena → `bg-[#2980b9]/20 text-[#2980b9]`

## Testimonial Data
| # | Name | Location | City | Badge | Key Result |
|---|------|----------|------|-------|------------|
| 1 | Jake R. | Austin, TX | Bogotá | BOG-72H (red) | Saved $32 in 10 minutes |
| 2 | Sarah L. | London, UK | Medellín | MDE-72H (green) | Knew exactly where to go on night one |
| 3 | Marcus W. | Toronto, CA | Cartagena | CTG-72H (blue) | Paid almost half what other tourists paid |
| 4 | Emma K. | Sydney, AU | Bogotá | BOG-72H (red) | Felt like I'd already been there |

