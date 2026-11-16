# THMR API 文档

- Radio 后端：`https://radio.yunmoan.cn`
- 账号后端：`https://thmr.yunmoan.cn`

## 公开接口
> 无需鉴权，直接请求 Radio 后端。路径中的 {stationId} 为频道 ID（如 touhou、touhou-curated），各频道数据独立。

### GET `/api/version` — 服务版本
返回 Radio 服务名称与版本号。

```json
{ "name": "radio-livestream", "version": "1.0.0" }
```

### GET `/api/stations` — 频道列表
返回全部频道及其实时状态摘要（listeners 为该频道当前拉流客户端数，求和即全站在线听众）。

```json
[
  {
    "id": "main",
    "name": "Main Radio",
    "enabled": true,
    "publicEnabled": true,
    "streamAuthEnabled": false,
    "current": { "trackId": "…", "title": "…" },
    "listeners": 3,
    "uniqueIps": 2,
    "paused": false,
    "trackCount": 128,
    "bitrates": [ { "id": "128k", "bitrateKbps": 128, "sampleRate": 44100, "channels": 2, "enabled": true } ]
  }
]
```

### GET `/api/stations/{stationId}/status` — 播放状态（核心）
前端每 10 秒轮询的状态快照。包含当前曲目、上一首、队列、听众统计、频道公开信息、码率档案与服务端扫描状态。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| stationId | path | `string` | 是 | 频道 ID，如 main |

```json
{
  "station": {
    "id": "main", "name": "Main Radio", "enabled": true,
    "public": { "title": "Main Radio", "description": "24x7 online radio", "accentColor": "#c65a69" },
    "playback": { /* 播放策略 */ },
    "streamAuthEnabled": false,
    "bitrates": [ { "id": "320k", "bitrateKbps": 320, "sampleRate": 44100, "channels": 2 } ]
  },
  "runtime": { "active": true, "paused": false, "scanInProgress": false, "lastScanCompletedAtMs": 0 },
  "totals": { "listeners": 3, "rawConnections": 3, "uniqueIps": 2 },
  "profiles": [ { "id": "320k", "listeners": 1, "rawConnections": 1 } ],
  "libraryCount": 128,
  "current": {
    "trackId": "3aa43ee156e0eb60", "title": "夜降り萃夢郷", "artist": "流月",
    "relativePath": "…", "coverUrl": "/api/stations/main/tracks/3aa43ee156e0eb60/cover",
    "startedAtMs": 1790000000000, "expectedEndMs": 1790000250000,
    "positionSec": 84, "durationSec": 250
  },
  "previous": { "trackId": "…", "title": "…", "artist": "…", "coverUrl": "…" },
  "queue": [ { "trackId": "…", "title": "…", "artist": "…", "coverUrl": "…", "plannedStartMs": 0, "plannedEndMs": 0, "durationSec": 250 } ],
  "preview": [ /* 内容预告 */ ],
  "backend": { "name": "radio-livestream", "version": "1.0.0" }
}
```

### GET `/api/stations/{stationId}/playlist` — 播放列表
返回当前频道排播中的全部队列条目（同 status.queue 结构，最多 200 条）。

### GET `/api/stations/{stationId}/preview` — 内容预告
返回频道的内容预告缓存。

### GET `/api/stations/{stationId}/tracks/{trackId}/cover` — 曲目封面
返回曲目封面。列表场景请追加 ?size=small 获取 256px JPEG 缩略图（约 1/70 体积），避免解码大图。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| size | query | `string` | 否 | small → 256px JPEG 缩略图；省略则返回原图 |

```json
二进制图片（image/jpeg / image/png），Cache-Control: public, max-age=300（缩略图 86400）
```

### GET `/api/stations/{stationId}/cover` — 当前曲目封面
返回当前正在播放曲目的封面（无需知道 trackId）。

### POST `/api/stations/{stationId}/feedback` — 曲目反馈
提交曲目反馈（非东方歌曲、版权投诉、播放异常等）。服务端按当前播放曲目聚合待处理反馈，同一曲目待处理反馈超过内部阈值（5 条）时自动触发切歌。400 = type/contact 缺失；404 = 频道不存在；409 = 当前无曲目；503 = 频道停用。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| type | body | `string` | 是 | non-touhou | non-music | copyright | copyright-takedown | copyright-attribution | copyright-permission | violation | metadata | playback | other（也接受对应中文标签） |
| contact | body | `string` | 是 | 联系方式，≤200 字符 |
| message | body | `string` | 否 | 附加说明，≤1000 字符 |
| track | body | `object` | 否 | 反馈指向的曲目快照：{ trackId, title, artist, relativePath, startedAtMs, expectedEndMs, positionSec, durationSec }；省略或为空时取当前播放曲目 |
| pageUrl | body | `string` | 否 | 来源页面地址，用于定位问题 |
| token | query | `string` | 否 | streamAuth 启用时必填；也可用请求头 X-Stream-Token |

```json
201 + {
  "ok": true,
  "feedbackId": "fb-mj2x1c-a1b2c3d4",
  "submittedAtMs": 1790000000000,
  "trackMatchesCurrent": true,
  "feedbackCountForTrack": 6,
  "autoSkipThreshold": 5,
  "autoSkipRequested": true,
  "autoSkipped": false
}
```

### GET `/healthz` — 健康检查
Radio 服务探活接口。

## 直播流
> station.streamAuth 启用时需携带 ?token=（或请求头 X-Stream-Token）。

### GET `/live/{stationId}/{profileId}` — MP3 直播流（推荐）
持续 MP3 音频流（audio/mpeg），官方推荐的拉流地址。断线后客户端应重新请求。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| token | query | `string` | 否 | streamAuth 启用时必填；也可用请求头 X-Stream-Token 携带 |

```json
audio/mpeg 持续流
```

### GET `/radio/{stationId}/{profileId}` — MP3 直播流（兼容别名）
行为与 /live 完全一致；可加 .mp3 后缀（/radio/{stationId}/{profileId}.mp3）作为兼容别名。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| token | query | `string` | 否 | 同上 |

```json
audio/mpeg 持续流
```

### GET `/radio/{stationId}/{profileId}.m3u` — M3U 播放列表文件
返回 audio/x-mpegurl 文本文件，内容指向对应频道/码率的直播流地址，可直接交给本地播放器打开。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| token | query | `string` | 否 | 同上；文件内的流地址会自动携带同一 token |

```json
#EXTM3U
#EXTINF:-1,东方音乐电台
http(s)://…/radio/{stationId}/{profileId}
```

### GET `/radio/{stationId}/{profileId}.m3u8` — HLS 播放列表
HLS 入口播放列表（application/vnd.apple.mpegurl），供支持 HLS 的播放器使用。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| token | query | `string` | 否 | 同上 |

### GET `/hls/{stationId}/{profileId}/{filename}` — HLS 分段
HLS 媒体分段文件，由播放器根据 m3u8 自动请求，一般不手动调用。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| token | query | `string` | 否 | 同上 |

## 机器接口（API Token）
> 鉴权：Authorization: Bearer <token> 或 X-Api-Token: <token>。令牌与 scope 由管理员在管理后台签发。

### GET `/api/v1/stations/{stationId}/tracks` — 曲库列表
分页返回频道曲库，支持搜索与排序。
- 需要 scope：`tracks:read`

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| q | query | `string` | 否 | 搜索关键词 |
| sort | query | `string` | 否 | title | artist | path | duration-desc | duration-asc |
| pageSize | query | `number` | 否 | 20 | 50 | 100 | 200，默认 50 |
| page | query | `number` | 否 | 页码，从 1 开始 |

### GET `/api/v1/stations/{stationId}/tracks/{trackId}` — 单曲详情
返回单个曲目的完整元数据。
- 需要 scope：`tracks:read`

### POST `/api/v1/stations/{stationId}/skip` — 跳过当前曲目
请求 Radio 立即切换到下一首。
- 需要 scope：`playback:control`

## THMR 账号后端
> 会话基于 Cookie（credentials: include）。未标注「免登录」的接口均需先登录。

### GET `/api/auth/login` — 发起登录
302 跳转 Natayark ID OAuth 授权页；授权完成后回到 ?redirect= 指定的地址并种下会话 Cookie。
- 免登录

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| redirect | query | `string` | 否 | 登录完成后的回跳地址 |

### GET `/api/auth/me` — 当前用户
返回当前登录用户；未登录返回 401。同时会自动同步默认收藏夹名称。
- 免登录

```json
{ "user": { "id": 1, "username": "Yunmoan", "email": "…", "nickname": "云默安", "needsNickname": false } }
```

### POST `/api/auth/logout` — 退出登录
销毁服务端会话并清除 Cookie。
- 免登录

### PATCH `/api/auth/profile` — 设置昵称
首次登录设置昵称（至少 2 个字符）；默认收藏夹名会同步为「昵称的收藏」。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| nickname | body | `string` | 是 | 昵称，2~64 字符 |

### GET `/api/me/collections` — 收藏夹列表
返回当前用户的全部收藏夹（含 itemCount 与分享信息）。

### POST `/api/me/collections` — 新建收藏夹
body: { name, description }；每个用户最多 50 个收藏夹。

```json
{
  "id": "1", "name": "云默安的收藏", "description": "个人收藏夹", "position": 1,
  "itemCount": 0, "createdAt": "…", "updatedAt": "…",
  "share": { "enabled": false, "slug": "", "url": "" }
}
```

### GET `/api/me/collections/{id}` — 收藏夹详情
返回收藏夹与其曲目数组。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| sort | query | `string` | 否 | position | title | artist | addedAt |
| order | query | `string` | 否 | asc | desc |

```json
{ "id": "1", "name": "…", "items": [ { "id": "7", "stationId": "main", "trackId": "…", "title": "…", "artist": "…", "album": "…", "durationSec": 250, "coverUrl": "https://…/cover", "addedAt": "…" } ] }
```

### PATCH `/api/me/collections/{id}` — 修改收藏夹
body: { name?, description? }。

### DELETE `/api/me/collections/{id}` — 删除收藏夹
删除收藏夹及其全部曲目，不可恢复。

### POST `/api/me/collections/{id}/items` — 添加曲目
body: { stationId, trackId }；曲目重复返回 409；超出容量返回 409。

```json
201 + { "id": "7", "trackId": "…", "title": "…", "coverUrl": "https://…", … }
```

### DELETE `/api/me/collections/{id}/items/{itemId}` — 移除曲目
按条目 ID 移除（itemId 来自收藏夹详情）。

```json
204
```

### POST `/api/me/collections/{id}/items/reorder` — 手动排序
body: { itemIds: [按新顺序排列的条目 ID] }。

### GET `/api/me/collections/{id}/export` — 导出收藏夹
format=json 返回结构化数据；format=m3u 返回播放列表文件。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| format | query | `string` | 否 | json（默认）| m3u |

### POST `/api/me/collections/{id}/share` — 开启分享
body: { enabled }；开启时分配 share slug，返回 share.url。前端分享链接为 站点地址/share/{slug}。

```json
{ "ok": true, "share": { "enabled": true, "slug": "otukwTBjBb", "url": "https://…/api/collections/otukwTBjBb" } }
```

### GET `/api/collections/{slug}` — 公开分享视图
免登录读取已开启分享的收藏夹；未开启或不存在返回 404。
- 免登录

```json
{
  "collection": { "name": "…", "description": "…", "owner": "云默安", "itemCount": 3 },
  "items": [ { "trackId": "…", "title": "…", "artist": "…", "coverUrl": "https://…", "durationSec": 250 } ]
}
```

### GET `/api/me/favorites/status` — 收藏状态
播放器快捷按钮的数据源：返回每个收藏夹是否含该曲目及条目 ID。第一个为默认收藏夹。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| stationId | query | `string` | 是 | 频道 ID |
| trackId | query | `string` | 是 | 曲目 ID |

```json
{
  "favorited": true,
  "itemId": "7",
  "collectionId": "1",
  "collections": [
    { "collectionId": "1", "name": "云默安的收藏", "favorited": true, "itemId": "7" },
    { "collectionId": "2", "name": "测试", "favorited": false, "itemId": null }
  ]
}
```

### GET `/api/tracks/search` — 曲库搜索
搜索 Radio 曲库，返回可收藏的曲目。

| 参数 | 位置 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| stationId | query | `string` | 是 | 频道 ID |
| q | query | `string` | 是 | 关键词 |
| page | query | `number` | 否 | 页码 |
| pageSize | query | `number` | 否 | 20 | 50 | 100 | 200 |
| sort | query | `string` | 否 | 同曲库列表 |

```json
{ "stationId": "main", "tracks": [ { "trackId": "…", "title": "…", "artist": "…", "coverUrl": "…", "durationSec": 250 } ] }
```

### GET `/api/vote/status` — 投票状态
?stationId=…，返回当前轮次与我的投票。

```json
{
  "stationId": "main", "active": true,
  "current": { "trackId": "…", "title": "…", "artist": "…" },
  "round": { "votes": 2, "threshold": 3, "actionTaken": false },
  "myVote": false, "listeners": 3
}
```

### POST `/api/vote` — 投票
body: { stationId }；达到阈值时返回 skipTriggered: true 并自动切歌。重复投票返回 409。

```json
{ "ok": true, "skipTriggered": false, "votes": 2, "threshold": 3 }
```

### DELETE `/api/vote` — 撤回投票
撤回当前轮次的投票。

```json
{ "ok": true, "removed": true, "votes": 1, "threshold": 3, "actionTaken": false }
```

### GET `/api/channels` — 频道列表
手工维护的频道列表（后端 channels.json，按请求实时读取，修改后无需重启）。网页与客户端的多频道选择均以此为准；enabled: false 表示该频道暂未上线。站点内置的 radio_categorize.json 仅作后端不可用时的兜底。
- 免登录

```json
[
  { "categorize": "touhou", "name": "东方综合频道", "enabled": true },
  { "categorize": "touhou-curated", "name": "东方综合精选频道", "enabled": true },
  { "categorize": "touhou-remix", "name": "东方Remix频道", "enabled": false }
]
```

### GET `/api/health` — 健康检查
账号后端探活：数据库连接状态、版本与运行时长。
- 免登录

```json
{ "ok": true, "version": "2.1.6", "database": "up", "uptimeSec": 3600 }
```

### GET `/api/meta` — 服务元信息
账号后端配置摘要：OAuth 是否已配置、Radio 公网地址与默认频道、投票阈值、收藏夹容量上限。
- 免登录

```json
{
  "version": "2.1.6",
  "auth": { "natayarkConfigured": true, "loginUrl": "/api/auth/login" },
  "radio": { "publicBaseUrl": "https://radio.yunmoan.cn", "defaultStationId": "touhou" },
  "vote": { "threshold": 3 },
  "collections": { "maxPerUser": 50, "maxItemsPerCollection": 200 }
}
```

## 状态码

| 状态码 | 含义 |
| --- | --- |
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 成功（无返回体） |
| 304 | 未修改（命中缓存） |
| 400 | 请求参数错误 |
| 401 | 未登录或令牌无效 |
| 403 | 无权限（scope 不足 / streamAuth token 无效 / 非公开资源） |
| 404 | 资源不存在 |
| 409 | 冲突（重复收藏 / 超出上限 / 无当前曲目时提交反馈） |
| 503 | 依赖不可用（数据库 / 频道停用） |
