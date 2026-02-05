import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useContent(refreshKey: number) {
    const [contentList, setContentList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoadingContent, setIsLoadingContent] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            setIsLoadingContent(true);
            try {
                /** 9 neueste Bilder holen */
                const { data: latestData } = await supabase
                    .from('content')
                    .select('*')
                    .order('id', { ascending: false })
                    .limit(9);

                /** Original Post (ID 1) holen */
                const { data: originalImage } = await supabase
                    .from('content')
                    .select('*')
                    .eq('id', 1)
                    .single();

                if (latestData) {
                    /** Dubletten verhindern */
                    const filteredLatest = latestData.filter(item => item.id !== 1);
                    const combined = originalImage
                        ? [...filteredLatest, originalImage]
                        : filteredLatest;

                    setContentList(combined);
                    setCurrentIndex(0);
                }
            } catch (error) {
                console.error("Fehler beim Laden:", error);
            } finally {
                setIsLoadingContent(false);
            }
        }
        fetchContent();
    }, [refreshKey]);

    return {
        contentList,
        currentIndex,
        setCurrentIndex,
        isLoadingContent
    };
}