import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { dictionaries, Locale } from '@/lib/i18n/dicitionaries';
import { APP_CONFIG } from '@/lib/config';
import { cleanupOldContent } from '@/lib/cleanup';

export async function POST(request: Request) {
    const lang = (request.headers.get('accept-language') || 'en') as Locale;
    const t = dictionaries[lang] || dictionaries.en;

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const comment = (formData.get('comment') as string) || "";

        // 1. Validierung
        if (!file || !APP_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({ error: t.errors.fileType || "Invalid file" }, { status: 400 });
        }

        // 2. Dateinamen generieren
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;

        // 3. Upload (Storage)
        const arrayBuffer = await file.arrayBuffer();
        const { error: uploadError } = await supabaseAdmin.storage
            .from(APP_CONFIG.STORAGE_BUCKET)
            .upload(fileName, arrayBuffer, { contentType: file.type });

        if (uploadError) throw uploadError;

        // 4. Eintrag erstellen (Database)
        const { error: dbError } = await supabaseAdmin
            .from('content')
            .insert({
                comment: comment.substring(0, APP_CONFIG.MAX_COMMENT_LENGTH),
                image_url: fileName
            });

        if (dbError) throw dbError;

        // 5. Cleanup (Wird getriggert, aber wir müssen nicht zwingend darauf warten)
        // cleanupOldContent(APP_CONFIG.MAX_IMAGES); // Ohne await = schnellerer Response für User
        await cleanupOldContent(APP_CONFIG.MAX_IMAGES);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("API UPLOAD ERROR:", error);
        return NextResponse.json({ error: t.errors.general }, { status: 500 });
    }
}