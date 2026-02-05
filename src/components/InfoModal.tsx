"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
    const { t } = useLanguage();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with focal blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[60]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="fixed inset-x-6 bottom-12 max-w-md mx-auto bg-zinc-950 border border-zinc-800 p-10 rounded-[44px] z-[70] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]"
                    >
                        <div className="text-center">
                            <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-8 opacity-40" />

                            <h2 className="text-white text-2xl font-black mb-6 tracking-tight">
                                {t.infoModal.title}
                            </h2>

                            <div className="space-y-4 text-zinc-400 text-sm leading-relaxed mb-10">
                                <p>
                                    {t.infoModal.textPart1}
                                </p>
                                <p>
                                    {t.infoModal.textPart2}
                                </p>
                                <p className="text-zinc-200 font-medium">
                                    {t.infoModal.textPart3}
                                </p>
                            </div>

                            <a
                                href="https://www.paypal.com/donate/?hosted_button_id=H2JEUQQ8MS92Q"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full py-4 bg-white text-black rounded-full font-bold active:scale-95 transition-all mb-6 shadow-lg shadow-white/5"
                            >
                                {t.infoModal.paypalBtn}
                            </a>

                            <button
                                onClick={onClose}
                                className="text-white text-[10px] uppercase tracking-[0.2em] hover:text-zinc-400"
                            >
                                {t.infoModal.closeBtn}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}