/**
 * 这个文件专门电台信息初始化和轮询
*/

import axios from "axios";
import { Player } from "./player";
import { updateWidget } from "./widget";
import type { station, stationStatus, widgetChanged } from "./types";

let stations: station[] = [];
let currentStationId: string | null = null;
let currentProfileId: string | null = null;
let lastStationStatus: stationStatus | null = null;
let currentStationStatus: stationStatus | null = null;

const init = () => {
  getStations();
};

/**
 * 获取所有电台
 * 自动筛选已启用电台
 * 自动沦陷默认电台
 */
const getStations = async () => {
  try {
    const response = await axios.get<station[]>(
      "https://radio.yunmoan.cn/api/stations",
    );
    stations = response.data.filter((item) => item.enabled);
    currentStationId = stations[0].id || "";
    currentProfileId = stations[0].bitrates[0].id || "";
    Player.changeSource(
      `https://radio.yunmoan.cn/live/${currentStationId}/${currentProfileId}`,
    );
    // 获取默认电台状态
    // 清理旧状态轮询
    if (intervals.stationStatus) clearInterval(intervals.stationStatus);
    // 开启新状态轮询
    if (!currentStationId) return;
    getStationStatus(currentStationId).then(() => {
      updateWidget(compareStationStatus(), currentStationStatus);
    });
    intervals.stationStatus = window.setInterval(() => {
      if (!currentStationId) return;
      getStationStatus(currentStationId).then(() => {
        updateWidget(compareStationStatus(), currentStationStatus);
      });
    }, 1000 * 10);
    console.log(stations);
  } catch (error) {
    console.error(error);
  }
};

const getStationStatus = async (id: string) => {
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

export const Stations = {
  init,
};
