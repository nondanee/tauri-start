import Alpine from 'https://unpkg.com/alpinejs/dist/module.esm.js'

import {
    getPlayListDetail,
    getSongDetail,
    getSongUrl,
} from './service.js'

import {
    formatDuration,
    shuffle,
    rgbToHsl,
    formatHslColor,
} from './helper.js'

const player = () => ({
    audio: new Audio(),
    background: '',

    playing: false,

    current: NaN,
    total: NaN,

    loop: 0,
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
    onLoopChange() {
        this.loop = (this.loop + 1) % 3
    },

    onMouseDown(event) {
        const { paused } = this.audio
        if (!paused) this.audio.pause()

        const { currentTarget } = event
        const { x, width } = currentTarget.getBoundingClientRect()
        const cursorWidth = currentTarget.children[1].offsetWidth
        const cursorOffset = cursorWidth / 2

        const maxMove = width - cursorWidth

        const onMouseMove = (event) => {
            const { pageX } = event
            const move = Math.max(0, Math.min(pageX - x - cursorOffset, maxMove))
            const progress = move / maxMove
            this.current = progress * this.total
        }

        const onMouseUp = (event) => {
            onMouseMove(event)
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)

            this.audio.currentTime = this.current / 1000
            if (!paused) this.audio.play()
        }

        onMouseMove(event)
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
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

        this.$watch('song', async () => {
            const image = document.querySelector('img')
            image.crossOrigin = true
            if (!image.completed) await new Promise(resolve => image.addEventListener('load', resolve))

            const colorThief = new ColorThief()
            const [r, g, b] = colorThief.getColor(image)
            const [h, s, l] = rgbToHsl(r, g, b)

            const start = formatHslColor(h, s, l + 0.1)
            const end = formatHslColor(h, s, l - 0.2)

            this.background = `linear-gradient(170deg, ${start}, ${start} 60%, ${end})`
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
            const { loop, index, queue } = this
            if (loop === 2) {
                this.audio.currentTime = 0
                this.audio.play()
            } else {
                if (loop === 0 && index === queue.length - 1) {
                    this.audio.currentTime = 0
                    this.audio.pause()
                } else {
                    this.onNext()
                }
            }
        }

        const data = await getPlayListDetail(2829896389)
        this.queue = data.trackIds.map(({ id }) => id)
        this.index = 0
    }
})

Alpine.data('player', player)

Alpine.start()