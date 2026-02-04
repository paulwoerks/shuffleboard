/**
 * Formatiert einen ISO-Zeitstempel in ein schönes, 
 * lokales Format (z.B. "20:45" oder "20. Jan, 10:30").
 */
export function formatTimestamp(timestamp: string | undefined): string {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    // Prüfen, ob das Datum von heute ist
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        // Nur Uhrzeit anzeigen: "20:45"
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        // Datum und Uhrzeit anzeigen: "20. Jan, 10:30"
        return date.toLocaleString([], {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}