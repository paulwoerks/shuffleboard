import { useState, useEffect, useRef } from 'react';

export function useStoryTimer(duration: number, onComplete: () => void, activeKey: string) {
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const requestRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const pausedAtRef = useRef<number>(0);

    const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current + pausedAtRef.current;
        const currentProgress = Math.min((elapsed / duration) * 100, 100);

        setProgress(currentProgress);

        if (currentProgress < 100) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            onComplete();
        }
    };

    useEffect(() => {
        if (!isPaused) {
            requestRef.current = requestAnimationFrame(animate);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (startTimeRef.current) {
                pausedAtRef.current += performance.now() - startTimeRef.current;
            }
            startTimeRef.current = null;
        }
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [isPaused, activeKey]);

    useEffect(() => {
        setProgress(0);
        pausedAtRef.current = 0;
        startTimeRef.current = null;
    }, [activeKey]);

    return { progress, isPaused, setIsPaused };
}