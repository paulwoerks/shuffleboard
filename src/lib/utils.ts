/**
 * formats a timestamp into a human-readable format based on the specified locale.
 * @param timestamp The ISO string timestamp to format.
 * @param locale The locale code (e.g., 'de' for German) to format the date. Default is 'de'.
 * @returns A formatted date string according to the specified locale.
 *
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