import 'dotenv/config';
import { supabase } from '../lib/supabase';

async function main() {
    console.log('Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('playlists').select('count').limit(1);
        if (error) {
            console.error('Supabase error:', error);
        } else {
            console.log('Supabase connection successful!');
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

main();
