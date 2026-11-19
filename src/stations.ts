import axios from "axios";
import { Player } from "./player";

let stations: station[] = [];
let currentStationId: string | null = null;
let currentProfileId: string | null = null;
let lastStationStatus: stationStatus | null = null;
let currentStationStatus: stationStatus | null = null;

interface station {
    id: string;
    name: string;
    enabled: boolean;
    publicEnabled: boolean;
    streamAuthEnabled: boolean;
    current: {
        trackId: string;
        title: string;
        artist: string;
        relativePath: string;
        coverUrl: string;
        startedAtMs: number;
        expectedEndMs: number;
        positionSec: number;
        durationSec: number;
    };
    listeners: number;
    uniqueIps: number;
    paused: boolean;
    trackCount: number;
    bitrates: bitrate[];
}

interface bitrate {
    id: string;
    enabled: boolean;
    bitrateKbps: number;
    sampleRate: number;
    channels: number;
}

interface bitrateProfile extends bitrate {
    listeners: number;
    rawConnections: number;
}

interface stationStatus {
    station: {
        id: string;
        name: string;
        enabled: boolean;
        public: {
            title: string;
            description: string;
            accentColor: string;
        };
        // 播放策略
        playback: any;
        streamAuthEnabled: boolean;
        bitrates: bitrate[];
    };
    runtime: {
        active: boolean;
        paused: boolean;
        scanInProgress: boolean;
        lastScanCompletedAtMs: number;
    };
    totals: {
        listeners: number;
        rawConnections: number;
        uniqueIps: number;
    };
    profiles: bitrateProfile[];
    libraryCount: number;
    current: music;
    previous: musicBase;
    queue: music[];
    preview: {
        date: string;
        entires: music[];
        generatedAtMs: number;
    };
    backend: {
        name: string;
        version: string;
    };
}

interface musicBase {
    trackId: string;
    title: string;
    artist: string;
    coverUrl: string;
}

interface music extends musicBase {
    plannedStartMs: number;
    plannedEndMs: number;
    durationSec: number;
}

interface widgetChanged {
    cover: boolean;
    title: boolean;
    subtitle: boolean;
}

const init = () => {
    getStations();
}


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
        Player.changeSource(`https://radio.yunmoan.cn/live/${currentStationId}/${currentProfileId}`)
        // 获取默认电台状态
        // 清理旧状态轮询
        if (intervals.stationStatus) clearInterval(intervals.stationStatus);
        // 开启新状态轮询
        if (!currentStationId) return;
        getStationStatus(currentStationId).then(() => {
            updateWidget(compareStationStatus());
        });
        intervals.stationStatus = window.setInterval(() => {
            if (!currentStationId) return;
            getStationStatus(currentStationId).then(() => {
                updateWidget(compareStationStatus());
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

const updateWidget = (changed: widgetChanged) => {
    if (changed.cover) {
        const cover = document.getElementById("thmr-cover-img") as HTMLImageElement;
        cover.src = currentStationStatus?.current.coverUrl
            ? "https://radio.yunmoan.cn" + currentStationStatus?.current.coverUrl
            : "https://thmr.yunmoan.cn/assets/cover-fallback.svg";
    }
    if (changed.title) {
        const title = document.getElementById("thmr-title") as HTMLElement;
        title.textContent = currentStationStatus?.current.title || "";
    }
    if (changed.subtitle) {
        const subtitle = document.getElementById("thmr-subtitle") as HTMLElement;
        subtitle.textContent = currentStationStatus?.current.artist || "";
    }
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
}