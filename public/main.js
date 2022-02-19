import Alpine from 'https://unpkg.com/alpinejs/dist/module.esm.js'

import {
    getPlayListDetail,
    getSongDetail,
    getSongUrl,
} from './service.js'

const player = () => ({
    audio: new Audio(),

    cover: '',
    name: '',
    extra: '',

    paused: true,

    current: NaN,
    total: NaN,

    mode: 0,
    random: false,

    queue: [],
    index: -1,

    get id() {
        if (!this.queue.length) return
        return this.queue[this.index]
    },

    get currentText() {
        return '--:--'
    },

    get totalText() {
        return '--:--'
    },

    onPlay() {
        if (!this.queue.length) return
        // this.paused = false
        this.audio.play()
    },
    onPause() {
        if (!this.queue.length) return
        // this.paused = true
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

        this.$watch('id', async (id) => {
            if (!id) return
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
            this.audio.src = url
            // this.audio.play()
        })

        this.audio.onpause = () => this.paused = true
        this.audio.onplay = () => this.paused = false
        this.audio.ontimeupdate = () => this.current = this.audio.currentTime
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