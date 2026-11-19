// 插件内联 CSS
import "./styles/style.css";
// 字体
import "@fontpkg/source-han-serif-sc/SourceHanSerifSC-Regular.otf";

import { html } from "./html";
import { Stations } from "./stations";
import { Player } from "./player";

const init = () => {
  const widget = document.createElement("div");
  widget.innerHTML = html;
  document.body.appendChild(widget);
  Stations.init();
  Player.init();
};

const maxRadius = 12;
let isDragging = false;

let thmrContainerEl: HTMLElement | null;

const dragHandler = (e: MouseEvent) => {
  if (!isDragging || !thmrContainerEl) return;
  const dx = e.movementX;
  const dy = e.movementY;
  // 碰撞检测
  const rect = thmrContainerEl.getBoundingClientRect();
  if (rect.left + dx < -1) return;
  if (rect.top + dy < -1) return;
  if (rect.left + dx > window.innerWidth - rect.width) return;
  if (rect.top + dy > window.innerHeight - rect.height + 1) return;
  // 融边处理
  let raduis = [maxRadius, maxRadius, maxRadius, maxRadius];
  if (rect.left + dx < maxRadius) {
    raduis[0] = Math.min(raduis[0], Math.max(0, rect.left + dx));
    raduis[3] = Math.min(raduis[3], Math.max(0, rect.left + dx));
  }
  if (rect.top + dy < maxRadius) {
    raduis[0] = Math.min(raduis[0], Math.max(0, rect.top + dy));
    raduis[1] = Math.min(raduis[1], Math.max(0, rect.top + dy));
  }
  if (rect.right - dx > window.innerWidth - rect.width - maxRadius) {
    raduis[1] = Math.min(
      raduis[1],
      Math.max(0, window.innerWidth - rect.right - dx),
    );
    raduis[2] = Math.min(
      raduis[2],
      Math.max(0, window.innerWidth - rect.right - dx),
    );
  }
  if (rect.bottom - dy > window.innerHeight - rect.height - maxRadius) {
    raduis[2] = Math.min(
      raduis[2],
      Math.max(0, window.innerHeight - rect.bottom - dy),
    );
    raduis[3] = Math.min(
      raduis[3],
      Math.max(0, window.innerHeight - rect.bottom - dy),
    );
  }
  thmrContainerEl.style.borderRadius = `${raduis[0]}px ${raduis[1]}px ${raduis[2]}px ${raduis[3]}px`;
  thmrContainerEl.style.bottom = `${Number(thmrContainerEl.style.bottom.replace("px", "")) - dy}px`;
  thmrContainerEl.style.right = `${Number(thmrContainerEl.style.right.replace("px", "")) - dx}px`;
};

// 自动吸附
const autoSticky = () => {
  if (!thmrContainerEl) return;
  const time = 0.1;
  const threshold = 40;
  const delay = 0.3;
  const rect = thmrContainerEl.getBoundingClientRect();
  const toTop = rect.top;
  const toBottom = window.innerHeight - rect.bottom;
  const toLeft = rect.left;
  const toRight = window.innerWidth - rect.right;
  if (
    toTop < threshold ||
    toBottom < threshold ||
    toLeft < threshold ||
    toRight < threshold
  ) {
    thmrContainerEl.style.transition = `
      bottom ${time}s ease-in-out,
      right ${time}s ease-in-out,
      border-radius ${time}s ease-in-out`;
  }
  setTimeout(() => {
    if (!thmrContainerEl) return;
    if (toTop <= threshold && toTop <= toRight && toTop <= toLeft) {
      thmrContainerEl.style.bottom = `${window.innerHeight - rect.height + 1}px`;
      thmrContainerEl.style.borderRadius = `0px 0px ${maxRadius}px ${maxRadius}px`;
    } else if (
      toBottom <= threshold &&
      toBottom <= toRight &&
      toBottom <= toLeft
    ) {
      thmrContainerEl.style.bottom = `-1px`;
      thmrContainerEl.style.borderRadius = `${maxRadius}px ${maxRadius}px 0px 0px`;
    } else if (toLeft <= threshold && toLeft <= toBottom && toLeft <= toTop) {
      thmrContainerEl.style.right = `${window.innerWidth - rect.width + 1}px`;
      thmrContainerEl.style.borderRadius = `0px ${maxRadius}px ${maxRadius}px 0px`;
    } else if (
      toRight <= threshold &&
      toRight <= toBottom &&
      toRight <= toTop
    ) {
      thmrContainerEl.style.right = `0px`;
      thmrContainerEl.style.borderRadius = `${maxRadius}px 0px 0px ${maxRadius}px`;
    }
    // 四个角落的圆角特殊处理
    if (toTop <= 0 && toRight <= 0) {
      thmrContainerEl.style.borderRadius = `0px 0px 0px ${maxRadius}px`;
    } else if (toTop <= 0 && toLeft <= 0) {
      thmrContainerEl.style.borderRadius = `0px 0px ${maxRadius}px} 0px`;
    } else if (toBottom <= 0 && toLeft <= 0) {
      thmrContainerEl.style.borderRadius = `0px ${maxRadius}px 0px 0px`;
    } else if (toBottom <= 0 && toRight <= 0) {
      thmrContainerEl.style.borderRadius = `${maxRadius}px 0px 0px 0px`;
    }
  }, delay * 1000);
  setTimeout(
    () => {
      if (!thmrContainerEl) return;
      thmrContainerEl.style.transition = "";
    },
    (time + delay) * 1000,
  );
};

let highlightAngle: number = 0;

// 边框高光
const highlight = (e: MouseEvent) => {
  if (!thmrContainerEl) return;
  const rect = thmrContainerEl.getBoundingClientRect();
  // 计算鼠标到组件中心角度
  highlightAngle =
    Math.atan2(
      e.clientY - rect.top - rect.height / 2,
      e.clientX - rect.left - rect.width / 2,
    ) *
    (180 / Math.PI);
};

// 缓慢向目标角度过渡
const applyHighlight = () => {
  if (!thmrContainerEl) return;
  const step = 0.05;
  let current = Number(
    thmrContainerEl.style.getPropertyValue("--angle").replace("deg", ""),
  );
  const target = highlightAngle;
  // 最短旋转路径
  const diff = ((target - current + 540) % 360) - 180;

  // 距离小于步长时吸附到目标，防止抖动
  if (Math.abs(diff) <= step) {
    current = target;
  } else {
    current += Math.sign(diff) * step;
  }

  // 归一化
  current = ((current + 540) % 360) - 180;

  const currentEl = document.getElementById("thmr-dev-current") as HTMLElement;
  currentEl.textContent = `高光角度：${current.toFixed(2)}°`;
  const targetEl = document.getElementById("thmr-dev-target") as HTMLElement;
  targetEl.textContent = `目标高光角度：${target.toFixed(2)}°`;

  thmrContainerEl.style.setProperty("--angle", `${current}deg`);
  requestAnimationFrame(applyHighlight);
};

const bindPlayerActions = () => {
  const playButtonEl = document.getElementById("thmr-controls-play");
  const volumeButtonEl = document.getElementById("thmr-controls-volume-icon");
  if (!playButtonEl || !volumeButtonEl) return;
  playButtonEl.addEventListener("click", (e) => {
    e.preventDefault();
    Player.playing() ? Player.pause() : Player.play();
  });
  volumeButtonEl.addEventListener("click", (e) => {
    e.preventDefault();
    Player.volume() == 0 ? Player.unmute() : Player.mute();
  });
  volumeButtonEl.addEventListener("wheel", (e: WheelEvent) => {
    e.preventDefault();
    const step = 5;
    if (e.deltaY > 0) {
      Player.volume(Player.volume() + step);
    } else {
      Player.volume(Player.volume() - step);
    }
  });
};

window.addEventListener("DOMContentLoaded", () => {
  init();
  thmrContainerEl = document.getElementById("thmr-container") as HTMLElement;
  thmrContainerEl.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
  });

  thmrContainerEl.addEventListener("mousemove", (e) => {
    e.preventDefault();
    dragHandler(e);
  });

  thmrContainerEl.addEventListener("mouseup", (e) => {
    e.preventDefault();
    isDragging = false;
    autoSticky();
  });

  thmrContainerEl.addEventListener("mouseleave", (e) => {
    e.preventDefault();
    isDragging = false;
    autoSticky();
  });
  window.addEventListener("mousemove", highlight);
  applyHighlight();
  bindPlayerActions();
});
