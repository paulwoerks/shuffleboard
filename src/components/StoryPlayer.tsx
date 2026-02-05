"use client";
import { useRef } from 'react';
import { formatTimestamp } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryTimer } from '@/hooks/useStoryTimer';
import { StoryProgress } from './StoryProgress';
import { useLanguage } from '@/hooks/useLanguage';

interface StoryPlayerProps {
    isActive: boolean;
    isPausedExternal?: boolean;
    imageUrl: string;
    comment: string;
    timestamp: string;
    onNext: () => void;
    onPrev: () => void;
    currentIndex: number;
    total: number;
}

const STORY_DURATION = 7500;

export default function StoryPlayer({
    isActive, isPausedExternal = false, imageUrl, comment, timestamp, onNext, onPrev, currentIndex, total
}: StoryPlayerProps) {
    const { t, locale } = useLanguage();
    const pressStartTimeRef = useRef<number>(0);

    const { progress, isPaused, setIsPaused } = useStoryTimer(
        STORY_DURATION,
        onNext,
        imageUrl,
        isActive && !isPausedExternal
    );

    const handlePointerDown = () => {
        pressStartTimeRef.current = Date.now();
        setIsPaused(true);
    };

    const handlePointerUp = (action: 'next' | 'prev') => {
        const pressDuration = Date.now() - pressStartTimeRef.current;
        setIsPaused(false);
        if (pressDuration < 250) {
            action === 'next' ? onNext() : onPrev();
        }
    };

    return (
        <div
            className="w-full h-full relative rounded-[32px] overflow-hidden bg-black shadow-2xl select-none touch-none"
            onPointerDown={handlePointerDown}
            onPointerLeave={() => !isPausedExternal && setIsPaused(false)}
        >
            <StoryProgress total={total} currentIndex={currentIndex} progress={progress} />

            <div className="absolute inset-0 z-30 flex">
                <div className="w-1/3 h-full cursor-pointer" onPointerUp={() => handlePointerUp('prev')} />
                <div className="w-2/3 h-full cursor-pointer" onPointerUp={() => handlePointerUp('next')} />
            </div>

            <div className="absolute inset-0 z-10 bg-zinc-950">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={imageUrl}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute inset-0"
                    >
                        <img src={imageUrl} className="w-full h-full object-cover" alt="Story" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-10 left-8 right-8 text-white z-20 pointer-events-none font-sans">
                <div className="mb-3 opacity-60 flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest">
                        {formatTimestamp(timestamp, locale)}
                    </span>
                </div>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={comment}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xl font-bold leading-tight"
                    >
                        {comment || "..."}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    );
}