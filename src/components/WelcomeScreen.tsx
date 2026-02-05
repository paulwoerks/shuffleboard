"use client";
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/hooks/useLanguage'; // Import für Übersetzungen

interface WelcomeScreenProps {
    onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    const { t } = useLanguage(); // Hook nutzen
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Konfetti-Knall beim Start
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#A35042', '#ffffff', '#50fa7b']
        });
    }, []);

    const handleExit = () => {
        setIsExiting(true);
        setTimeout(() => {
            onStart();
        }, 600);
    };

    return (
        <div className={`
            fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ease-in-out
            ${isExiting ? 'opacity-0 scale-110 blur-md pointer-events-none' : 'opacity-100'}
        `}>
            <div className={`max-w-md space-y-6 transition-transform duration-700 ${isExiting ? '-translate-y-20' : 'translate-y-0'}`}>

                {/* TITEL */}
                <h1 className="animate-banger text-4xl font-black text-white tracking-tighter">
                    {t.welcomeScreen.title}
                </h1>

                {/* UNTERSCHRIFT */}
                <div className="animate-text-reveal space-y-4">
                    <p className="text-white text-lg font-medium leading-tight">
                        {t.welcomeScreen.description1}<br /><br />
                        {t.welcomeScreen.description2}
                    </p>
                </div>

                {/* BUTTON */}
                <div className="animate-button-reveal">
                    <button
                        onClick={handleExit}
                        className="w-full py-4 bg-[#A35042] text-white rounded-2xl font-bold shadow-2xl active:scale-95 transition-all mt-4"
                    >
                        {t.welcomeScreen.startBtn}
                    </button>
                </div>

            </div>
        </div>
    );
}