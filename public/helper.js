const zFill = (string = '', length = 2) => {
    string = String(string)
    while (string.length < length) string = '0' + string
    return string
}

const formatDuration = (duration) => {
    if (isNaN(duration)) return '--:--'

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

// https://stackoverflow.com/a/9493060
const rgbToHsl = (r, g, b) => {
    r /= 255, g /= 255, b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
        h = s = 0 // achromatic
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: {
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            }
            case g: {
                h = (b - r) / d + 2
                break
            }
            case b: {
                h = (r - g) / d + 4
                break
            }
        }
        h /= 6
    }

    return [h, s, l]
}

const formatHslColor = (h, s, l) => {
    const hsl = [
        (h * 360).toFixed(0),
        (s * 100).toFixed(1) + '%',
        (l * 100).toFixed(1) + '%',
    ]
    return `hsl(${hsl})`
}

export {
    formatDuration,
    shuffle,
    rgbToHsl,
    formatHslColor,
}