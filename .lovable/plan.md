

# Move Brevo API to Supabase Edge Function

## Summary
Move the Brevo API call from the frontend to a Supabase Edge Function so the API key stays server-side. This fixes the authentication error and is more secure.

## Steps

### 1. Add `BREVO_API_KEY` secret
The existing secret is `VITE_BREVO_API_KEY` (a runtime secret). We need a new secret called `BREVO_API_KEY` with the same Brevo API key value, since Edge Functions access secrets via `Deno.env.get("BREVO_API_KEY")`. We'll prompt you to provide it.

### 2. Create Edge Function `supabase/functions/subscribe/index.ts`
- Accepts POST with `{ email }`, validates format
- Calls Brevo API using server-side `BREVO_API_KEY`
- Handles duplicates as success
- CORS headers for public access
- No JWT verification required

### 3. Update `handleLeadSubmit` in `src/pages/Index.tsx` (lines 222-258)
Replace the direct Brevo API call with a call to the Edge Function:
```
fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe`, ...)
```
Remove all references to `VITE_BREVO_API_KEY` and any debug console.logs.

### 4. Deploy and test
Deploy the edge function and invoke it to verify it works.

## File Summary
| File | Action |
|------|--------|
| `supabase/functions/subscribe/index.ts` | Create — Edge Function proxy to Brevo |
| `src/pages/Index.tsx` | Update — call Edge Function instead of Brevo directly |

