/**
 * 这个文件负责组件音乐信息更新
 */
import type { stationStatus, widgetChanged } from "./types";

const updateWidget = (
  changed: widgetChanged,
  current: stationStatus | null,
) => {
  if (changed.cover) {
    const cover = document.getElementById("thmr-cover-img") as HTMLImageElement;
    cover.src = current?.current.coverUrl
      ? "https://radio.yunmoan.cn" + current?.current.coverUrl
      : "https://thmr.yunmoan.cn/assets/cover-fallback.svg";
  }
  if (changed.title) {
    const title = document.getElementById("thmr-title") as HTMLElement;
    title.textContent = current?.current.title || "暂无标题";
  }
  if (changed.subtitle) {
    const subtitle = document.getElementById("thmr-subtitle") as HTMLElement;
    subtitle.textContent = current?.current.artist || "佚名";
  }
};

export { updateWidget };
