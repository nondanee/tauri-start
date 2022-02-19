import Alpine from 'https://unpkg.com/alpinejs/dist/module.esm.js';

const player = {    
    cover: '',
    name: '',
    extra: '',

    paused: false,

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

    get mode() {
        return 'single';
    },
    
    onPlay() {
        this.paused = false;
    },
    onPause() {
        this.paused = true;
    },
    onPrevious() {

    },
    onRandomChange() {

    },
    onModeChange() {

    },
}

Alpine.data('player', () => player)

Alpine.start()