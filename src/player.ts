/**
 * 这个文件专门负责播放控制和播放控制组件状态切换
 */

import { Settings } from "./session";
import { Spectrum } from "./spectrum";
import { Stations } from "./stations";

let audioEl: HTMLAudioElement | null;
let currentStationId: string = "";
let currentProfileId: string = "";

const getCurrentProfileId = () => {
  return currentProfileId;
};

const getCurrentStationId = () => {
  return currentStationId;
};

const init = () => {
  audioEl = document.getElementById("thmr-radio") as HTMLAudioElement;
  const playIconEl = document.getElementById("thmr-controls-play-icon");
  const pauseIconEl = document.getElementById("thmr-controls-pause-icon");
  const volumeProg = document.getElementById("thmr-controls-volume-prog");
  const volumeProgValue = document.getElementById("thmr-controls-volume-value");
  if (audioEl) {
    audioEl.addEventListener("play", () => {
      if (!playIconEl || !pauseIconEl) return;
      playIconEl.style.display = "none";
      pauseIconEl.style.display = "block";
    });
    audioEl.addEventListener("pause", () => {
      if (!playIconEl || !pauseIconEl) return;
      playIconEl.style.display = "block";
      pauseIconEl.style.display = "none";
    });
    audioEl.addEventListener("volumechange", () => {
      if (!volumeProg || !audioEl || !volumeProgValue) return;
      volumeProg.style.setProperty(
        "--progress",
        `${(audioEl.volume * 100).toFixed(0)}%`,
      );
      volumeProgValue.textContent = `${(audioEl.volume * 100).toFixed(0)}`;
      Settings.setSettings("volume", audioEl.volume.toString());
    });
    audioEl.volume = 1;
    audioEl.crossOrigin = "anonymous";
    Spectrum.init(audioEl);
  }
};

const play = () => {
  if (audioEl) audioEl.play();
};

const playing = (): boolean => {
  if (!audioEl) return false;
  return !audioEl.paused;
};

const pause = () => {
  if (audioEl) audioEl.pause();
};

const paused = (): boolean => {
  if (!audioEl) return false;
  return audioEl.paused;
};

const volume = (v?: number): number => {
  if (!audioEl) return 0;
  if (v && v <= 100 && v >= 0) {
    audioEl.volume = v;
  }
  return audioEl.volume;
};

let lastVolume = 100;

const mute = () => {
  if (!audioEl) return;
  lastVolume = audioEl.volume;
  audioEl.volume = 0;
};

const unmute = () => {
  if (!audioEl) return;
  audioEl.volume = lastVolume;
};

const changeSource = (station: string, profile: string) => {
  if (!audioEl) return;
  try {
    console.log(station, profile);
    audioEl.src = `https://radio.yunmoan.cn/live/${station}/${profile}`;
    currentStationId = station;
    currentProfileId = profile;
    audioEl.play();
    Stations.refreshStationStatus();
  } catch (error) {
    console.error("illegal arguments!");
  }
};

export const Player = {
  init,
  play,
  playing,
  pause,
  paused,
  volume,
  mute,
  unmute,
  changeSource,
  getCurrentProfileId,
  getCurrentStationId,
};
