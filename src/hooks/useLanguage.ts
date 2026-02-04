// hooks/useLanguage.ts
"use client";
import { useState, useEffect } from 'react';
import { dictionaries, Locale, Dictionary } from '@/lib/i18n/dicitionaries';

export function useLanguage() {
    const [locale, setLocale] = useState<Locale>('en');

    useEffect(() => {
        // Check browser language
        const browserLang = navigator.language.split('-')[0] as Locale;

        if (dictionaries[browserLang]) {
            setLocale(browserLang);
        }
    }, []);

    return {
        locale,
        t: dictionaries[locale], // "t" steht traditionell für "translate"
        setLocale
    };
}