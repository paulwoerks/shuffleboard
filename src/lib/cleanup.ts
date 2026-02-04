import { supabaseAdmin } from '@/lib/supabase';

/**
 * Löscht alte Einträge und Bilder, wenn das Limit überschritten wird.
 * @param maxItems Die maximale Anzahl an Bildern, die behalten werden sollen.
 */
export async function cleanupOldContent(maxItems: number) {
    try {
        const { data: allContent } = await supabaseAdmin
            .from('content')
            .select('id, image_url')
            .order('id', { ascending: false });

        if (allContent && allContent.length > maxItems) {
            const toDelete = allContent.slice(maxItems);
            const idsToDelete = toDelete.map(item => item.id);
            const filesToDelete = toDelete.map(item => item.image_url);

            // Parallel löschen für bessere Performance
            const [dbResult, storageResult] = await Promise.all([
                supabaseAdmin.from('content').delete().in('id', idsToDelete),
                supabaseAdmin.storage.from('images').remove(filesToDelete)
            ]);

            if (dbResult.error) console.error("DB Cleanup Error:", dbResult.error);
            if (storageResult.error) console.error("Storage Cleanup Error:", storageResult.error);

            return { success: true, count: idsToDelete.length };
        }
        return { success: true, count: 0 };
    } catch (error) {
        console.error("Critical Cleanup Error:", error);
        return { success: false, error };
    }
}