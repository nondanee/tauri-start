import Alpine from 'https://unpkg.com/alpinejs/dist/module.esm.js'

import {
    getPlayListDetail,
    getSongDetail,
    getSongUrl,
} from './service.js'

import {
    formatDuration,
    shuffle,
} from './helper.js'

const player = () => ({
    audio: new Audio(),

    playing: false,

    current: NaN,
    total: NaN,

    mode: 0,
    random: false,

    queue: [],
    backup: [],
    index: -1,
    song: null,

    get id() {
        if (!this.queue.length) return
        return this.queue[this.index]
    },

    get info() {
        if (!this.song) return {}
        const { name, al, ar } = this.song

        return {
            cover: (al || {}).picUrl + '?param=320y320',
            name,
            extra: (ar || []).map(_ => (_ || {}).name).filter(Boolean).join('/')
        }
    },

    get progress() {
        const { current, total } = this
        if (!total) return 0
        return current / total || 0
    },

    formatDuration,

    onPlay() {
        if (!this.queue.length) return
        this.audio.play()
    },
    onPause() {
        if (!this.queue.length) return
        this.audio.pause()
    },
    onNext() {
        const { length } = this.queue
        if (!length) return
        this.index = (this.index + 1) % length
    },
    onPrevious() {
        const { length } = this.queue
        if (!length) return
        this.index = (this.index - 1) % length
    },
    onRandomChange() {
        this.random = !this.random
    },
    onModeChange() {
        this.mode = (this.mode + 1) % 3
    },

    async init() {
        // debug
        window.audio = this.audio

        this.$watch('id', async (id, prev) => {
            if (!id || id === prev) return
            const [song, url] = await Promise.all([
                getSongDetail(id),
                getSongUrl(id),
            ])
                .catch(() => {})

            if (!url) {
                this.onNext()
                return
            }

            this.song = song
            this.total = song.dt
            const { paused } = this.audio
            this.audio.src = url
            if (!paused) this.audio.play()
        })

        this.$watch('random', (value) => {
            if (value) {
                const { id, queue } = this
                const list = shuffle(queue)
                const index = list.indexOf(id)
                this.queue = list
                this.index = index
                this.backup = queue
            } else {
                const { id, backup } = this
                const index = backup.indexOf(id)
                this.queue = backup
                this.index = index
            }
        })

        this.audio.onabort = () => this.playing = false
        this.audio.onpause = () => this.playing = false
        this.audio.onplay = () => this.playing = true

        this.audio.ontimeupdate = () => {
            this.current = this.audio.currentTime * 1000
        }
        this.audio.onloadedmetadata = () => {
            this.current = 0
            this.total = this.audio.duration * 1000
        }

        this.audio.onended = () => {
            if (this.mode === 2) {
                this.audio.currentTime = 0
                this.audio.play()
            } else {
                this.onNext()
            }
        }

        const data = await getPlayListDetail(2829896389)
        this.queue = data.trackIds.map(({ id }) => id)
        this.index = 0
    }
})

Alpine.data('player', player)

Alpine.start()