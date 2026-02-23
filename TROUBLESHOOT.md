# Troubleshooting Guide

## Issue: "Failed to load archive collections"

### Environment Variables Checklist

**In your Vercel dashboard, you MUST have ALL FOUR of these:**

1. `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon/public key
3. `SUPABASE_URL` = same as #1
4. `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key

### Variable Usage Map

```
lib/supabase.ts → NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
app/sitemap.ts → NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY  
app/api/keepalive/route.ts → SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
```

### How to Verify on Vercel

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Check that all 4 variables exist
4. Make sure they're enabled for "Production" environment
5. Redeploy after adding/updating variables

### Common Mistakes

❌ Only adding `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
❌ Typos in variable names (case sensitive!)
❌ Missing the `NEXT_PUBLIC_` prefix for public variables
❌ Not redeploying after adding variables

### How to Test Locally

```bash
# Create .env.local file with:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Then run:
npm run dev
```

### Diagnostic Commands

```bash
# Test Supabase connection locally
npm run build

# If build succeeds locally but fails on Vercel:
# → Environment variable issue on Vercel

# If build fails locally:
# → Check .env.local file
```

### Where to Find Supabase Keys

1. Go to your Supabase project dashboard
2. Settings → API
3. Copy:
   - Project URL → for `*_SUPABASE_URL` variables
   - anon/public key → for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → for `SUPABASE_SERVICE_ROLE_KEY`

### After Adding Variables to Vercel

1. Trigger a new deployment (Vercel auto-deploys on push)
2. Wait for build to complete
3. Check deployment logs for any errors
4. Visit your site - collections should load

### Still Not Working?

Check the Vercel deployment logs:
1. Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. View "Build Logs" and "Function Logs"
4. Look for Supabase errors or missing env var warnings

### Edge Cases

**If you see "Missing Supabase environment variables":**
- The lazy proxy in lib/supabase.ts is catching missing vars
- Double-check variable names match exactly

**If collections show 0 items:**
- Supabase connection works, but database is empty
- Run `npm run sync` locally to populate data

**If build succeeds but site shows errors:**
- Environment variables might be missing from Production environment
- Go to Vercel Settings → Environment Variables
- Make sure variables are checked for "Production"
