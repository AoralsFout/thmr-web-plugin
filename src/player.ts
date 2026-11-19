let audioEl: HTMLAudioElement | null;
const init = () => {
    audioEl = window.document.getElementById("thmr-radio") as HTMLAudioElement;
}

const play = () => {
    if (audioEl) audioEl.play();
}

const playing = (): boolean => {
    if (!audioEl) return false;
    return !audioEl.paused;
}

const pause = () => {
    if (audioEl) audioEl.pause();
}

const paused = (): boolean => {
    if (!audioEl) return false;
    return audioEl.paused;
}

const volume = (v?: number): number => {
    if (!audioEl) return 0;
    if (v && v <= 100 && v >= 0) {
        audioEl.volume = v;
    }
    return audioEl.volume;
}

let lastVolume = 100;

const mute = () => {
    if (!audioEl) return;
    lastVolume = audioEl.volume;
    audioEl.volume = 0;
}

const unmute = () => {
    if (!audioEl) return;
    audioEl.volume = lastVolume;
}

const changeSource = (s: string) => {
    if (!audioEl) return;
    try {
        audioEl.src = s;
    } catch (error) {
        console.error("illegal arguments!")
    }
}

export const Player = {
    init,
    play,
    playing,
    pause,
    paused,
    volume,
    mute,
    unmute,
    changeSource
}