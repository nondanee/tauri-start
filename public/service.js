const { fetch: tauriFetch } = window.__TAURI__.http

const stringify = (object) => {
    object = { ...object }
    const pairs = []
    for (const key in object) {
        pairs.push([key, object[key]].map(encodeURIComponent).join('='))
    }
    return pairs.join('&')
}

const Fetch = async (path, data) => {
    const result = await tauriFetch(`https://music.163.com${path}`, {
        method: 'POST',
        body: stringify(data),
    })  
        .then(_ => _.json())

    console.log(result);
}

const getPlayListDetail = id => Fetch(
    '/api/playlist/detail',
    { id, offset: 0, total: true, limit: 1000, n: 1 },
)

const getSongDetail = id => Fetch(
    '/api/song/enhance/player/url',
    { c: JSON.stringify([{ id }]) },
)

const getSongUrl = id => Fetch(
    '/api/song/enhance/player/url',
    { ids: JSON.stringify([id]), br: 999999 },
)

export {
    getPlayListDetail,
    getSongDetail,
    getSongUrl,
}