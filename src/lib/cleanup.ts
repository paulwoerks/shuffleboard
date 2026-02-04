import { supabaseAdmin } from '@/lib/supabase';

/**
 * Löscht alte Einträge und Bilder, wenn das Limit überschritten wird.
 * @param maxItems Die maximale Anzahl an Bildern, die behalten werden sollen.
 */
export async function cleanupOldContent(maxImages: number) {
    // 1. Zähle alle Bilder außer dein Ur-Bild
    const { count } = await supabaseAdmin
        .from('content')
        .select('*', { count: 'exact', head: true })
        .neq('id', 1); // Dein geschütztes Bild ignorieren

    if (count && count > maxImages) {
        // 2. Lösche das älteste Bild, das NICHT ID 1 ist
        const { data: oldest } = await supabaseAdmin
            .from('content')
            .select('id, image_url')
            .neq('id', 1)
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        if (oldest) {
            // Datei aus Storage löschen
            await supabaseAdmin.storage.from('images').remove([oldest.image_url]);
            // Eintrag aus DB löschen
            await supabaseAdmin.from('content').delete().eq('id', oldest.id);
        }
    }
}