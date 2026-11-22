/**
 * 负责数据持久化保存
 */

import { Player } from "./player";
import { Spectrum } from "./spectrum";

let theme: "light" | "dark" | null = null;
let style: "glass" | "solid" | null = null;
let volume: number | null = null;
let reduceMotion: boolean = false;

const init = () => {
  theme = localStorage.getItem("theme") as "light" | "dark" | null;
  style = localStorage.getItem("style") as "glass" | "solid" | null;
  volume = localStorage.getItem("volume") as number | null;
  reduceMotion = localStorage.getItem("reduceMotion") === "true" ? true : false;
  if (!theme || !style || !volume) {
    // 初次加载
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    style = "solid";
    volume = 0.5;
  }

  setSettings("theme", theme);
  setSettings("style", style);
  setSettings("volume", volume.toString());
  setSettings("reduceMotion", reduceMotion.toString());

  // 监听系统设置变化
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (e.matches) {
        setSettings("theme", "dark");
      } else {
        setSettings("theme", "light");
      }
    });

  // 绑定按键
  const Options = [
    document.getElementById("thmr-settings-theme-light"),
    document.getElementById("thmr-settings-theme-dark"),
    document.getElementById("thmr-settings-style-glass"),
    document.getElementById("thmr-settings-style-solid"),
    document.getElementById("thmr-settings-reduceMotion-true"),
    document.getElementById("thmr-settings-reduceMotion-false"),
  ];

  Options.forEach((item) => {
    item?.addEventListener("click", () => {
      const key = item.getAttribute("key") as
        | "theme"
        | "volume"
        | "style"
        | "reduceMotion";
      const value = item.getAttribute("value") as string;
      setSettings(key, value);
    });
  });
};

const getSettings = (query: "theme" | "volume" | "style" | "reduceMotion") => {
  if (query === "theme") {
    return theme;
  }
  if (query === "volume") {
    return volume;
  }
  if (query === "style") {
    return style;
  }
  if (query === "reduceMotion") {
    return reduceMotion;
  }
};

const setSettings = (
  key: "theme" | "volume" | "style" | "reduceMotion",
  value: string,
) => {
  const themeLightOption = document.getElementById("thmr-settings-theme-light");
  const themeDarkOption = document.getElementById("thmr-settings-theme-dark");
  const styleGlassOption = document.getElementById("thmr-settings-style-glass");
  const styleSolidOption = document.getElementById("thmr-settings-style-solid");
  const reduceMotionTrueOption = document.getElementById(
    "thmr-settings-reduceMotion-true",
  );
  const reduceMotionFlaseOption = document.getElementById(
    "thmr-settings-reduceMotion-false",
  );
  switch (key) {
    case "theme":
      if (value !== "light" && value !== "dark") {
        return;
      }
      theme = value;
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      themeLightOption?.classList.remove("active");
      themeDarkOption?.classList.remove("active");
      theme === "light"
        ? themeLightOption?.classList.add("active")
        : themeDarkOption?.classList.add("active");
      break;
    case "reduceMotion":
      reduceMotion = value === "true";
      document.documentElement.setAttribute(
        "data-reduceMotion",
        reduceMotion.toString(),
      );
      localStorage.setItem("reduceMotion", reduceMotion.toString());
      reduceMotionFlaseOption?.classList.remove("active");
      reduceMotionTrueOption?.classList.remove("active");
      reduceMotion
        ? reduceMotionTrueOption?.classList.add("active")
        : reduceMotionFlaseOption?.classList.add("active");
      // 手动清理一次，避免残留。
      Spectrum.cleanCanvas();
      break;
    case "style":
      if (value !== "glass" && value !== "solid") {
        return;
      }
      style = value;
      document.documentElement.setAttribute("data-style", style);
      localStorage.setItem("style", style);
      styleGlassOption?.classList.remove("active");
      styleSolidOption?.classList.remove("active");
      style === "glass"
        ? styleGlassOption?.classList.add("active")
        : styleSolidOption?.classList.add("active");
      break;
    case "volume":
      volume = Number(value);
      localStorage.setItem("volume", volume.toString());
      Player.volume(volume);
      break;
    default:
      break;
  }
  updateOptions();
};

const updateOptions = () => {
  document
    .getElementById("thmr-settings-sections")
    ?.querySelectorAll(".active")
    .forEach((item) => {
      const slide = item.parentElement;
      const slideRect = slide!.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const thumb = slide?.querySelector(
        ".thmr-settings-slide-option-bg",
      ) as HTMLDivElement;
      thumb.style.left = `${itemRect.left - slideRect.left}px`;
      thumb.style.width = `${itemRect.width - 2}px`;
    });
};

export const Settings = {
  init,
  getSettings,
  setSettings,
};
