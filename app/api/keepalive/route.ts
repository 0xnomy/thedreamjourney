import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl) {
            throw new Error('SUPABASE_URL is not configured');
        }

        if (!supabaseServiceKey) {
            throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        const { error } = await supabaseAdmin.from('playlists').select('id').limit(1);

        if (error) {
            throw error;
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Supabase keepalive failed', error);
        return NextResponse.json({ status: 'error' }, { status: 500 });
    }
}
