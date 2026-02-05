import { supabaseAdmin } from '@/lib/supabase';

/**
 * Deletes old images from the database and storage, keeping only the most recent ones up to the specified limit.
 * @param maxItems The maximum number of images to keep (excluding the original image with ID 1)
 */
export async function cleanupOldContent(maxImages: number) {
    // 1. count total images (excluding the protected one with ID 1)
    const { count } = await supabaseAdmin
        .from('content')
        .select('*', { count: 'exact', head: true })
        .neq('id', 1);

    if (count && count > maxImages) {
        // 2. delete the oldest image (the one with the smallest created_at timestamp, excluding ID 1)
        const { data: oldest } = await supabaseAdmin
            .from('content')
            .select('id, image_url')
            .neq('id', 1)
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        if (oldest) {
            await supabaseAdmin.storage.from('images').remove([oldest.image_url]);
            await supabaseAdmin.from('content').delete().eq('id', oldest.id);
        }
    }
}