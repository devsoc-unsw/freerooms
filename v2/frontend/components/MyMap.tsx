import { loadModules } from 'esri-loader';

const loadBaseMap = async () => {
  // use await to load modules 
  const [Map, MapView, BaseMap, VectorTileLayer, esriConfig] = await loadModules(["esri/Map", "esri/views/MapView", "esri/Basemap", "esri/layers/VectorTileLayer", "esri/config"]);

  const basemap = new BaseMap({
    baseLayers: [
      new VectorTileLayer({
        portalItem: {
          id: "df9c45bd660c42e99231f5b197386599",
        },
      }),
    ],
  });

  const map = new Map({
    basemap: basemap
  });

  const view = new MapView({
    map: map,
    center: [151.231, -33.917], 
    zoom: 16, 
    container: "viewDiv", 
  });

  esriConfig.apiKey =
    "AAPK7fbfd710c5e443e28d309fc3ba297ceb_Wb-Lg6smsxOnafMSRQLTx3WwDI-mv9jKXig8AECw0pTh06C_uyS40dTDpgPIDMd";

  return { map, view }
}


export default loadBaseMap;
