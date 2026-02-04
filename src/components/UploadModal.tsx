"use client";
import { useState, useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
    loading: boolean;
    setLoading: (state: boolean) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess, loading, setLoading }: UploadModalProps) {
    const { t, locale } = useLanguage();
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (file: File | undefined) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFileChange(file);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const commentInput = e.currentTarget.querySelector('input[name="comment"]') as HTMLInputElement;
        if (commentInput) {
            formData.append('comment', commentInput.value);
        }

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                headers: { 'Accept-Language': locale } // Sprache mitschicken
            });

            if (res.ok) {
                onUploadSuccess();
                setPreview(null);
                setSelectedFile(null);
                onClose();
            } else {
                const errorData = await res.json();
                alert(t.errors.general + ": " + errorData.error);
            }
        } catch (err) {
            alert(t.errors.general + ": " + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div
                className="bg-white w-full max-w-md rounded-t-[2rem] sm:rounded-3xl p-8 shadow-2xl animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{t.uploadModal.title}</h2>
                    <button onClick={onClose} className="p-2 text-gray-400">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl transition-all flex flex-col items-center justify-center overflow-hidden h-60
                            ${isDragging ? 'border-pink-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-pink-500'}
                            ${preview ? 'border-gray-500' : ''}`}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center pointer-events-none px-4">
                                <p className="text-gray-900 font-semibold text-lg">Click or drop here</p>
                                <p className="text-gray-400 text-sm">JPG, PNG, WebP</p>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => handleFileChange(e.target.files?.[0])}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">{t.uploadModal.captionLabel}</label>
                        <input
                            type="text"
                            name="comment"
                            placeholder={t.uploadModal.placeholder}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl font-bold text-white bg-black hover:bg-pink-600 shadow-lg active:scale-95 disabled:bg-gray-300"
                    >
                        {loading ? t.uploadModal.uploading : t.uploadModal.submitBtn}
                    </button>
                </form>
            </div>
        </div>
    );
}