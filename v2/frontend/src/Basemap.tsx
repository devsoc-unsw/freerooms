import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config.js";
esriConfig.apiKey =
  "AAPK46037065a5604a5cabbb162bdae00b9dIk7R92SXsV3FKXjgXnhF829z71uovMU0SH_pRtgSH4aiDzpDEdAl4MksTkBPHFfg";

const map = new Map({
  basemap: "arcgis-topographic",
});

const view = new MapView({
  map: map,
  center: [151.231, -33.917],
  zoom: 16,
  container: "viewDiv",
});

export { map, view };
