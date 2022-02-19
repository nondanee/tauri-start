import Alpine from 'https://unpkg.com/alpinejs/dist/module.esm.js'

const player = () => ({
    cover: '',
    name: '',
    extra: '',

    paused: true,

    current: NaN,
    total: NaN,

    mode: 0,
    random: false,

    get currentText() {
        return '--:--'
    },

    get totalText() {
        return '--:--'
    },

    onPlay() {
        this.paused = false
    },
    onPause() {
        this.paused = true
    },
    onNext() {

    },
    onPrevious() {

    },
    onRandomChange() {
        this.random = !this.random
    },
    onModeChange() {
        this.mode = (this.mode + 1) % 3
    },
})

Alpine.data('player', player)

Alpine.start()