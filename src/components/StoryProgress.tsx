"use client";

interface StoryProgressProps {
    total: number;
    currentIndex: number;
    progress: number;
}

export function StoryProgress({ total, currentIndex, progress }: StoryProgressProps) {
    return (
        <div className="absolute top-6 inset-x-6 z-40 flex gap-1.5 px-1">
            {Array.from({ length: total }).map((_, i) => {
                const isCompleted = i < currentIndex;
                const isActive = i === currentIndex;

                return (
                    <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white"
                            style={{
                                width: isCompleted ? '100%' : isActive ? `${progress}%` : '0%',
                                transition: isCompleted ? 'width 0.2s ease-out' : 'none'
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}