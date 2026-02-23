import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const checks = {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        GROQ_API_KEY: !!process.env.GROQ_API_KEY,
    };

    const allPresent = Object.values(checks).filter(Boolean).length;
    const critical = checks.NEXT_PUBLIC_SUPABASE_URL && checks.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return NextResponse.json({
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        checks,
        summary: {
            total: Object.keys(checks).length,
            present: allPresent,
            criticalOk: critical,
        },
        message: critical 
            ? 'All critical Supabase variables are configured ✓'
            : '❌ Missing critical Supabase environment variables',
    });
}
