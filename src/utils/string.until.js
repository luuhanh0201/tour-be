
export function getInitials(text = '') {
    const str = String(text ?? '').trim();
    if (!str) return '';

    const words = str.split(/\s+/);
    const initials = words.map(w => {
        const m = w.match(/\p{L}/u);
        return m ? m[0].toUpperCase() : '';
    }).filter(Boolean).join('');

    return initials;
}

export default getInitials;