"use client";
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useContent } from '@/hooks/useContent';
import StoryPlayer from '@/components/StoryPlayer';
import UploadModal from '@/components/UploadModal';
import InfoModal from '@/components/InfoModal';

export default function ExplorePage() {
    const { t } = useLanguage();
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { contentList, currentIndex, setCurrentIndex, isLoadingContent } = useContent(refreshKey);

    return (
        <main className="h-screen w-screen bg-black flex flex-col p-[5px] overflow-hidden relative">

            <header className="w-full py-6 px-4 flex items-center shrink-0">
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h1 className="text-white text-2xl font-black tracking-tighter uppercase italic">
                        {t.home.title}
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1 leading-tight">
                        {t.home.description}
                    </p>
                </div>

                <button
                    onClick={() => setIsInfoOpen(true)}
                    className="w-12 h-12 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-black font-bold shadow-xl active:scale-95 transition-all ml-4"
                >
                    <span>i</span>
                </button>
            </header>

            <section className="flex-1 relative w-full overflow-hidden">
                {!isLoadingContent && contentList.length > 0 ? (
                    <StoryPlayer
                        isActive={true}
                        isPausedExternal={isModalOpen || isInfoOpen}
                        imageUrl={`https://gieuqsxsplewidaxpzkd.supabase.co/storage/v1/object/public/images/${contentList[currentIndex].image_url}`}
                        comment={contentList[currentIndex].comment}
                        timestamp={contentList[currentIndex].updated_at}
                        onNext={() => setCurrentIndex((prev) => Math.min(prev + 1, contentList.length - 1))}
                        onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                        currentIndex={currentIndex}
                        total={contentList.length}
                    />
                ) : (
                    /* Stylischer Loader */
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-[#A35042] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-zinc-600 text-xs font-black uppercase tracking-widest animate-pulse">
                            Berge Echos...
                        </p>
                    </div>
                )}
            </section>

            <footer className="w-full py-6 px-4 shrink-0">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-[#A35042] text-white rounded-2xl font-bold shadow-2xl active:scale-95 transition-all"
                >
                    {t.home.uploadBtn}
                </button>
            </footer>

            <UploadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUploadSuccess={() => setRefreshKey(Date.now())}
                loading={loading}
                setLoading={setLoading}
            />
            <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
        </main>
    );
}