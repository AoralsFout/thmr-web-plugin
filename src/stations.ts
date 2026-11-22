/**
 * 这个文件专门电台信息初始化和轮询
 */

import axios from "axios";
import { Player } from "./player";
import { updateWidget } from "./widget";
import type { station, stationStatus, widgetChanged } from "./types";

let stations: station[] = [];
let lastStationStatus: stationStatus | null = null;
let currentStationStatus: stationStatus | null = null;

const init = async () => {
  await requestStations();
};

/**
 * 获取所有电台
 * 自动筛选已启用电台
 * 自动沦陷默认电台
 */
const requestStations = async () => {
  try {
    const response = await axios.get<station[]>(
      "https://radio.yunmoan.cn/api/stations",
    );
    stations = response.data.filter((item) => item.enabled);
    const stationSettingsEl = document.getElementById("thmr-settings-stations");
    const profileSettingsEl = document.getElementById("thmr-settings-profiles");
    stations.forEach((station) => {
      const options = document.createElement("div");
      options.classList.add("thmr-settings-slide-option");
      options.id = `thmr-settings-station-${station.id}`;
      options.innerHTML = station.name.replace("电台", "电台<br>");
      options.setAttribute("key", "station");
      options.setAttribute("value", station.id);
      stationSettingsEl?.appendChild(options);
    });
    stations[0].bitrates.forEach((bitrate) => {
      const options = document.createElement("div");
      options.classList.add("thmr-settings-slide-option");
      options.id = `thmr-settings-profile-${bitrate.id}`;
      options.innerHTML = bitrate.id;
      options.setAttribute("key", "profile");
      options.setAttribute("value", bitrate.id);
      profileSettingsEl?.appendChild(options);
    });
    Player.changeSource(stations[0].id || "", stations[0].bitrates[0].id || "");
    // 获取默认电台状态
    // 清理旧状态轮询
    if (intervals.stationStatus) clearInterval(intervals.stationStatus);
    // 开启新状态轮询
    if (!Player.getCurrentStationId()) return;
    requestStationStatus(Player.getCurrentStationId()).then(() => {
      updateWidget(compareStationStatus(), currentStationStatus);
    });
    intervals.stationStatus = window.setInterval(() => {
      if (!Player.getCurrentStationId()) return;
      requestStationStatus(Player.getCurrentStationId()).then(() => {
        updateWidget(compareStationStatus(), currentStationStatus);
      });
    }, 1000 * 10);
    console.log(stations);
  } catch (error) {
    console.error(error);
  }
};

const requestStationStatus = async (id: string) => {
  try {
    const response = await axios.get<stationStatus>(
      `https://radio.yunmoan.cn/api/stations/${id}/status`,
    );
    lastStationStatus = currentStationStatus;
    currentStationStatus = response.data;
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

const refreshStationStatus = async () => {
  requestStationStatus(Player.getCurrentStationId()).then(() => {
    updateWidget(compareStationStatus(), currentStationStatus);
  });
};

// 轮询状态
const intervals: Record<string, number | null> = {
  stationStatus: null,
};

const compareStationStatus = (): widgetChanged => {
  return {
    cover:
      lastStationStatus?.current.coverUrl !==
      currentStationStatus?.current.coverUrl,
    title:
      lastStationStatus?.current.title !== currentStationStatus?.current.title,
    subtitle:
      lastStationStatus?.current.artist !==
      currentStationStatus?.current.artist,
  };
};

const getStations = () => {
  return stations;
};

const getProfiles = () => {
  return stations.find((item) => item.id === Player.getCurrentStationId())!
    .bitrates;
};

export const Stations = {
  init,
  getStations,
  getProfiles,
  refreshStationStatus,
};
