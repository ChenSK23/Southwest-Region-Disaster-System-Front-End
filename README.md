[![Lang](https://img.shields.io/badge/Lang-English-2ea043?style=for-the-badge)](README.md)
[![Lang](https://img.shields.io/badge/Lang-%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-6e7781?style=for-the-badge)](README.zh-CN.md)

# Southwest China — Historical Administrative Boundaries

**28 GeoJSON files tracing the administrative divisions of Southwest China from the Western Han
dynasty to the People's Republic, at province (省), prefecture (市) and county (区) level.**

2,459 polygons · 15 periods · WGS84 longitude/latitude · 36.5 MB

The data covers the six southwestern provinces — **Sichuan (川), Guizhou (黔), Yunnan (滇),
Tibet (藏), Guangxi (桂)** and, for modern periods, **Chongqing (渝)** — as well as the
Tibetan administrative units of the Ming era (乌思藏宣慰司, 朵甘思宣慰司).

> This repository holds the **map-data layer** of the Southwest Region Disaster System project.
> There is no front-end code here — only boundary files.

---

## What's in the box

Every file follows the same naming convention:

```
西南六省-<period>-<level>.json
        │        └── 省 province · 市 prefecture · 区 county
        └────────── 西汉 Western Han … 中华人民共和国 PRC
```

All files are `FeatureCollection` objects with `Polygon` / `MultiPolygon` geometries in
**WGS84 (EPSG:4326)** — ready to drop into Leaflet, Mapbox, ECharts or GeoPandas without reprojection.

---

## Files

| Period | Year | 省 Province | 市 Prefecture | 区 County |
| --- | ---: | --- | --- | --- |
| 西汉 Western Han | — | 4 features · 924 KB | 18 · 124 KB | — |
| 东汉 Eastern Han | — | 3 · 943 KB | 19 · 1.5 MB | — |
| 三国 Three Kingdoms | 262 | 3 · 1.0 MB | 32 · 1.5 MB | — |
| 西晋 Western Jin | — | 4 · 892 KB | 33 · 1.2 MB | — |
| 东晋 Eastern Jin | — | 3 · 566 KB | — | — |
| 南北朝 Northern & Southern | — | 2 · 430 KB | — | — |
| 隋 Sui | — | 52 · 1.4 MB | — | — |
| 唐 Tang | — | 7 · 671 KB | 133 · 1.2 MB | — |
| 五代十国 Five Dynasties | — | 6 · 509 KB | — | — |
| 辽北宋 Liao & Northern Song | — | 7 · 1.1 MB | — | — |
| 明 Ming | 1582 | 6 · 1.2 MB | 108 · 279 KB | — |
| 清 Qing | 1820 | 5 · 661 KB | 78 · 1.2 MB | — |
| 清 Qing | 1911 | 5 · 1.4 MB | 82 · 4.0 MB | 447 · 6.7 MB |
| 中华人民共和国 PRC | 1980 | 5 · 78 KB | 62 · 332 KB | 601 · 1.2 MB |
| 中华人民共和国 PRC | current | 6 · 274 KB | 105 · 861 KB | 623 · 5.2 MB |

Total: **2,459 features** across 28 files.

---

## Three attribute schemas

The files were assembled from different sources, so there are three attribute families.
Check `features[0].properties` before writing a renderer.

**1. CHGIS-derived** (prefecture/county sets for 1911, 1820, and most 省 layers) — up to 30 fields:

| Field | Meaning |
| --- | --- |
| `NAME_CH` / `NAME_FT` / `NAME_PY` | Simplified / traditional / pinyin name |
| `TYPE_CH` / `TYPE_PY` | Unit type — `府`, `州`, `厅`, `直隶州` … |
| `LEV_RANK` | Administrative rank, `1` = top |
| `BEG_YR` / `END_YR` | Validity window (usually a single year) |
| `DYN_CH` / `DYN_PY` | Dynasty, e.g. `清朝` |
| `LEV1_CH` / `LEV2_CH` | Parent province / prefecture |
| `X_COOR` / `Y_COOR` | Representative point |
| `COMPILER` / `GEOCOMPER` / `CHECKER` | Compiler / checker of the record |

**2. AMap / DataV.GeoAtlas** (all `中华人民共和国-*` files) — 8–9 fields:

`adcode`, `NAME_CH`, `center`, `centroid`, `childrenNum`, `level`, `parent.adcode`, `acroutes`.

**3. Simplified hand-curated** (the early dynasties) — 3–5 fields:

`NAME_CH`, `标准年` (reference year), `时代` (period), `所属图` (source map), sometimes `FID_1`.
Example: `{"NAME_CH": "交州", "标准年": 262, "时代": "三国时期", "所属图": "交州龙编附近"}`.

---

## Usage

**Load and plot with GeoPandas**

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

**A time slider in ~15 lines**

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

## Caveats

- **Coverage is uneven by period.** The early dynasties have 2–7 province-level features; the 1911
  and modern sets have hundreds of county-level polygons. Do not assume a feature exists in every file.
- **Periods are snapshots, not a continuous series.** `BEG_YR` and `END_YR` are typically the same
  value (e.g. `1911`–`1911`, `1820`–`1820`); each file is one reference year.
- **Historical boundaries are scholarly reconstructions**, not surveyed borders. They are suitable
  for visualisation and teaching, not for any legal or administrative use.
- **`MultiPolygon` dominates.** Roughly a third of features are `MultiPolygon` (islands, exclaves),
  so renderers must handle both geometry types.
- **No licence file.** The historical reconstructions derive from academic datasets (CHGIS-style
  attributes); credit the original source if you republish derived maps.

---

## Related

- [`GIS`](https://github.com/ChenSK23/GIS) — ArcGIS exports: CHGIS points and polygons, rivers,
  lakes, world boundaries, city markers and a tile set.
