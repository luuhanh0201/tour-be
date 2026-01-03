export const trimOrNull = (value) => (value === null || value === undefined) ? null : String(value).trim();
export const isBlockOrNull = isBlock => {
    if (isBlock === null || isBlock === undefined) return null
    if (isBlock === true || isBlock === 1 || isBlock === "1" || String(isBlock).toLowerCase() === "true") return 1;
    return 0;
}
export const setRoleOrNull = role => {
    if (role === null || role === undefined) return null;
    const r = String(role).trim().toLowerCase();
    return (r === "admin" || r === "guide") ? r : null;
}


