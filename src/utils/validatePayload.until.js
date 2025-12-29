export const validatePayload = (valid, payload) => {
    const { error } = valid.validate(payload, { abortEarly: false })
    if (error) {
        const errors = error.details.reduce((acc, cur) => {
            acc[cur.path[0]] = cur.message
            return acc
        }, {})
        return errors
    }
    return false
}