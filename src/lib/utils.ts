/**
 * Formatiert einen ISO-Zeitstempel in ein schönes, 
 * lokales Format (z.B. "20:45" oder "20. Jan, 10:30").
 */
export function formatTimestamp(timestamp: string, locale: string = 'de') {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
}