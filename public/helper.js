const zFill = (string = '', length = 2) => {
    string = String(string)
    while (string.length < length) string = '0' + string
    return string
}

const formatDuration = duration => {
    const oneSecond = 1e3
    const oneMinute = 60 * oneSecond
    const result = []

    Array(oneMinute, oneSecond)
        .reduce((remain, unit) => {
            const value = Math.floor(remain / unit)
            result.push(value)
            return remain - value * unit
        }, duration || 0)

    return result
        .map(value => zFill(value, 2))
        .join(':')
}

const shuffle = (list) => {
    const copy = list.slice()
    const output = []
    while (copy.length) {
        const index = Math.floor(Math.random() * copy.length)
        const [value] = copy.splice(index, 1)
        output.push(value)
    }
    return output
}

export {
    formatDuration,
    shuffle,
}