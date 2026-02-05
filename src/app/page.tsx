"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import StoryPlayer from '@/components/StoryPlayer';
import UploadModal from '@/components/UploadModal';
import InfoModal from '@/components/InfoModal';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false); // State hinzugefügt

  const [contentList, setContentList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchContent() {
      /** Get 9 newest images */
      const { data: latestData } = await supabase
        .from('content')
        .select('*')
        .order('id', { ascending: false })
        .limit(9);

      /** Original Post */
      const { data: originalImage } = await supabase
        .from('content')
        .select('*')
        .eq('id', 1)
        .single();

      if (latestData) {
        /** filter original post to prevent duplicate display */
        const filteredLatest = latestData.filter(item => item.id !== 1);

        const combined = originalImage
          ? [...filteredLatest, originalImage]
          : filteredLatest;

        setContentList(combined);
        setCurrentIndex(0);
      }
    }
    fetchContent();
  }, [refreshKey]);

  return (
    <main className="h-screen w-screen bg-black flex flex-col p-[5px] overflow-hidden">

      {/* HEADER */}
      <header className="w-full py-6 px-4 flex items-center">
        {/* Title + Description */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h1 className="text-white text-2xl font-black tracking-tighter drop-shadow-md break-words">
            {t.home.title}
          </h1>
          <p className="text-zinc-400 text-sm mt-1 break-words">
            {t.home.description}
          </p>
        </div>

        {/* Infobutton */}
        <button
          onClick={() => setIsInfoOpen(true)}
          className="w-12 h-12 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-black font-bold shadow-xl active:scale-95 transition-all ml-4"
        >
          <span className="text-lg">i</span>
        </button>
      </header>

      {/* Story Display */}
      <section className="flex-1 relative w-full overflow-hidden">
        {contentList && contentList.length > 0 ? (
          <StoryPlayer
            imageUrl={`https://gieuqsxsplewidaxpzkd.supabase.co/storage/v1/object/public/images/${contentList[currentIndex].image_url}`}
            comment={contentList[currentIndex].comment}
            timestamp={contentList[currentIndex].updated_at}
            onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, contentList.length - 1))}
            onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            currentIndex={currentIndex}
            total={contentList.length}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-bold uppercase tracking-widest">
            {t.home.loading}
          </div>
        )}
      </section>

      {/* Upload Button */}
      <footer className="w-full py-6 px-4 shrink-0">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-4 bg-[#A35042] text-white rounded-2xl font-bold shadow-2xl hover:bg-[#8c4037] active:scale-95 transition-all z-50 relative"
        >
          {t.home.uploadBtn}
        </button>
      </footer>

      {/* MODALS */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={() => setRefreshKey(Date.now())}
        loading={loading}
        setLoading={setLoading}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </main>
  );
}