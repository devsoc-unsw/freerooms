import { loadCss, loadModules } from "esri-loader";

class Mapping {
  mapView: import("esri/views/MapView");
  map: import("esri/Map");

  async initializeMap(): Promise<Mapping> {
    loadCss("https://js.arcgis.com/4.10/esri/css/main.css");

    // type the returned objects of loadModules using import types. Requires Typescript 2.9
    type MyModules = [
      typeof import("esri/Map"),
      typeof import("esri/views/MapView"),
      typeof import("esri/config"),
    ];
    const [Map, MapView, esriConfig] = await (loadModules([
      "esri/Map", 
      "esri/views/MapView",
      "esri/config"
    ]) as Promise<MyModules>);
    
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

    view.when().then(() => {
      console.log("map is ready");
    });

    this.mapView = view;
    this.map = map;

    return this;
  }
}

export default Mapping;