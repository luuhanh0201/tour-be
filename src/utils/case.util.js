// Utilities to convert object keys between snake_case and camelCase

function snakeToCamelKey(s) {
    return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelToSnakeKey(s) {
    return s.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function isPlainObject(v) {
    return v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date);
}

export function toCamel(value) {
    if (Array.isArray(value)) return value.map(toCamel);
    if (isPlainObject(value)) {
        const out = {};
        for (const k of Object.keys(value)) {
            const v = value[k];
            out[snakeToCamelKey(k)] = toCamel(v);
        }
        return out;
    }
    return value;
}

export function toSnake(value) {
    if (Array.isArray(value)) return value.map(toSnake);
    if (isPlainObject(value)) {
        const out = {};
        for (const k of Object.keys(value)) {
            const v = value[k];
            out[camelToSnakeKey(k)] = toSnake(v);
        }
        return out;
    }
    return value;
}

export default { toCamel, toSnake };
