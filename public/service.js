const { http } = window.__TAURI__ || {}

const stringify = (object) => {
    object = { ...object }
    const pairs = []
    for (const key in object) {
        pairs.push([key, object[key]].map(encodeURIComponent).join('='))
    }
    return pairs.join('&')
}

const Fetch = async (path, data) => (
    http.fetch(`https://music.163.com${path}`, {
        method: 'POST',
        body: http.Body.text(stringify(data)),
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        responseType: 1 // JSON
    })
        .then(_ => _.data)
)

const getPlayListDetail = id => Fetch(
    '/api/playlist/detail',
    { id, offset: 0, total: true, limit: 1000, n: 1 },
)

const getSongDetail = id => Fetch(
    '/api/v3/song/detail',
    { c: JSON.stringify([{ id }]) },
)   
    .then(_ => _.songs[0])

const getSongUrl = id => Fetch(
    '/api/song/enhance/player/url',
    { ids: JSON.stringify([id]), br: 999999 },
)
    .then(_ => _.data[0].url)

export {
    getPlayListDetail,
    getSongDetail,
    getSongUrl,
}