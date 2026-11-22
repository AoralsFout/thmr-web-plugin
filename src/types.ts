export interface station {
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

export interface bitrate {
    id: string;
    enabled: boolean;
    bitrateKbps: number;
    sampleRate: number;
    channels: number;
}

export interface bitrateProfile extends bitrate {
    listeners: number;
    rawConnections: number;
}

export interface stationStatus {
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

export interface musicBase {
    trackId: string;
    title: string;
    artist: string;
    coverUrl: string;
}

export interface music extends musicBase {
    plannedStartMs: number;
    plannedEndMs: number;
    durationSec: number;
}

export interface widgetChanged {
    cover?: boolean;
    title?: boolean;
    subtitle?: boolean;
}
