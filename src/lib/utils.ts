/**
 * Formatiert einen ISO-Zeitstempel in Bangkok-Zeit
 * z.B. "20.01.2026, 10:45"
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
        hour12: false,
        timeZone: 'Asia/Bangkok'
    }).format(date);
}