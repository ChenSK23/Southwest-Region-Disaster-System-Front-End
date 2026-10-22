[![Lang](https://img.shields.io/badge/Lang-English-6e7781?style=for-the-badge)](README.md)
[![Lang](https://img.shields.io/badge/Lang-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-2ea043?style=for-the-badge)](README.zh-CN.md)

# 西南六省历史行政区划边界数据

**用 28 个 GeoJSON 文件，串起从西汉到中华人民共和国时期西南地区的行政区划——
覆盖省、市、区三级。**

2,459 个多边形 · 15 个时期 · WGS84 经纬度 · 36.5 MB

数据覆盖西南六省——**四川（川）、贵州（黔）、云南（滇）、西藏（藏）、广西（桂）**，
现代部分另含**重庆（渝）**；明代部分还包括乌思藏宣慰司、朵甘思宣慰司等藏区建制。

> 本仓库承载的是西南区域灾害系统项目的**地图数据层**，不含前端代码，只有边界文件。

---

## 文件怎么组织

所有文件遵循同一命名规则：

```
西南六省-<时期>-<级别>.json
        │        └── 省 · 市 · 区
        └────────── 西汉 … 中华人民共和国
```

全部是 `FeatureCollection`，几何类型为 `Polygon` / `MultiPolygon`，坐标系为
**WGS84（EPSG:4326）**——Leaflet、Mapbox、ECharts、GeoPandas 都可以直接用，无需重投影。

---

## 文件清单

| 时期 | 年份 | 省 | 市 | 区 |
| --- | ---: | --- | --- | --- |
| 西汉 | — | 4 个要素 · 924 KB | 18 · 124 KB | — |
| 东汉 | — | 3 · 943 KB | 19 · 1.5 MB | — |
| 三国 | 262 | 3 · 1.0 MB | 32 · 1.5 MB | — |
| 西晋 | — | 4 · 892 KB | 33 · 1.2 MB | — |
| 东晋 | — | 3 · 566 KB | — | — |
| 南北朝 | — | 2 · 430 KB | — | — |
| 隋 | — | 52 · 1.4 MB | — | — |
| 唐 | — | 7 · 671 KB | 133 · 1.2 MB | — |
| 五代十国 | — | 6 · 509 KB | — | — |
| 辽北宋 | — | 7 · 1.1 MB | — | — |
| 明 | 1582 | 6 · 1.2 MB | 108 · 279 KB | — |
| 清 | 1820 | 5 · 661 KB | 78 · 1.2 MB | — |
| 清 | 1911 | 5 · 1.4 MB | 82 · 4.0 MB | 447 · 6.7 MB |
| 中华人民共和国 | 1980 | 5 · 78 KB | 62 · 332 KB | 601 · 1.2 MB |
| 中华人民共和国 | 当代 | 6 · 274 KB | 105 · 861 KB | 623 · 5.2 MB |

合计 **2,459 个要素**，28 个文件。

---

## 三种属性结构

文件来自不同数据源，因此属性字段分三套。写渲染逻辑前先看 `features[0].properties`。

**1. CHGIS 体系**（1911 / 1820 的市、区级，以及多数省级图层）——最多 30 个字段：

| 字段 | 含义 |
| --- | --- |
| `NAME_CH` / `NAME_FT` / `NAME_PY` | 简体 / 繁体 / 拼音名 |
| `TYPE_CH` / `TYPE_PY` | 建制类型——`府`、`州`、`厅`、`直隶州`…… |
| `LEV_RANK` | 行政层级，`1` 为最高 |
| `BEG_YR` / `END_YR` | 存续年份（通常为单年） |
| `DYN_CH` / `DYN_PY` | 朝代，如 `清朝` |
| `LEV1_CH` / `LEV2_CH` | 所属省 / 府 |
| `X_COOR` / `Y_COOR` | 代表点坐标 |
| `COMPILER` / `GEOCOMPER` / `CHECKER` | 编纂人 / 核查人 |

**2. 高德 DataV 体系**（所有 `中华人民共和国-*` 文件）——8 到 9 个字段：

`adcode`、`NAME_CH`、`center`、`centroid`、`childrenNum`、`level`、`parent.adcode`、`acroutes`。

**3. 简化手工整理**（早期朝代）——3 到 5 个字段：

`NAME_CH`、`标准年`、`时代`、`所属图`，个别带 `FID_1`。
例如：`{"NAME_CH": "交州", "标准年": 262, "时代": "三国时期", "所属图": "交州龙编附近"}`。

---

## 用法

**GeoPandas 快速出图**

```python
import geopandas as gpd
import matplotlib.pyplot as plt

gdf = gpd.read_file("西南六省-1911-省.json")
print(gdf.crs)                     # EPSG:4326
print(gdf[["NAME_CH", "TYPE_CH"]])

gdf.plot(edgecolor="black", column="NAME_CH", legend=True)
plt.title("西南六省 · 1911 省级边界")
plt.show()
```

**Leaflet**

```js
const map = L.map('map').setView([28, 103], 5);

fetch('西南六省-1911-省.json')
  .then(r => r.json())
  .then(d => L.geoJSON(d, {
    style: { color: '#8b5cf6', weight: 1, fillOpacity: 0.25 },
    onEachFeature: (f, layer) => layer.bindPopup(f.properties.NAME_CH)
  }).addTo(map));
```

**十几行做一个时间轴**

```js
const periods = ['西汉','东汉','三国','西晋','东晋','南北朝','隋','唐',
                 '五代十国','辽北宋','明','1820','1911','1980','中华人民共和国'];
let layer = null;

async function show(period) {
  if (layer) map.removeLayer(layer);
  const data = await (await fetch(`西南六省-${period}-省.json`)).json();
  layer = L.geoJSON(data, { style: { weight: 1, fillOpacity: 0.3 } }).addTo(map);
}
show('明');
```

---

## 注意事项

- **各时期详略悬殊。** 早期只有 2–7 个省级要素，1911 和当代则有几百个区县级多边形。
  不要假设某个要素在每个文件里都存在。
- **每个文件是一个时间断面。** `BEG_YR` 和 `END_YR` 通常相同（如 `1911`–`1911`、
  `1820`–`1820`），代表某个基准年，不是连续时间序列。
- **历史边界是学术复原**，不是实测国界。适合可视化与教学，不能用于任何法律或行政用途。
- **`MultiPolygon` 占比很高。** 约三分之一的要素是多面（海岛、飞地），渲染逻辑要同时处理
  两种几何类型。
- **没有 LICENSE 文件。** 历史复原数据源自学术数据集（CHGIS 风格字段），再发布派生地图时
  请注明原始来源。

---

## 相关仓库

- [`GIS`](https://github.com/ChenSK23/GIS) — ArcGIS 导出的 CHGIS 点面数据、河流、湖泊、
  世界国界、城市点位和一套底图瓦片。
