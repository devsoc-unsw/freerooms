import { ClassNames } from "@emotion/react";
import Mapping from "./BaseMap";
// import { loadCss, loadModules } from "esri-loader";
// import locateWidget from "./CurrentLocation";

console.log('hmm')
async function Campus() {
  console.log('awkward');
  // type MyModules = [
  //   typeof import("esri/layers/GraphicsLayer"),
  //   typeof import("esri/Graphic"), 
  //   typeof import("esri/geometry/Point"), 
  //   typeof import("esri/geometry/Polyline"), 
  //   typeof import("esri/PopupTemplate"), 
  //   typeof import("esri/layers/FeatureLayer")
  // ];
  // const [GraphicsLayer, Graphic, Point, Polyline, PopupTemplate, FeatureLayer] = await (loadModules([
  //   "esri/layers/GraphicsLayer", 
  //   "esri/Graphic", 
  //   "esri/geometry/Point", 
  //   "esri/geometry/Polyline", 
  //   "esri/PopupTemplate",
  //   "esri/layers/FeatureLayer"
  // ]) as Promise<MyModules>);

  // const mappingInstance = await new mapping().initializeMap();
  // const graphicsLayer = new GraphicsLayer();
  // mappingInstance.map.add(graphicsLayer);

  // const point = new Point({
  //   longitude: 151.231,
  //   latitude: -33.917,
  // });

  // const simpleMarkerSymbol = {
  //   type: "simple-marker",
  //   color: [226, 119, 40], // Orange
  //   outline: {
  //     color: [255, 255, 255], // White
  //     width: 1,
  //   },
  // };

  // const pointGraphic = new Graphic({
  //   geometry: point,
  //   symbol: simpleMarkerSymbol,
  // });

  // graphicsLayer.add(pointGraphic);

  // // adding polyline to map
  // // to do all the buildings, CSVLayer can be used
  // const paths = [
  //   [
  //     [151.22801, -33.9177, 35.4],
  //     [151.2287, -33.91841, 35.5],
  //     [151.22801, -33.9177, 35.6],
  //     [151.2287, -33.91841, 35.4],
  //   ],
  // ];
  // const polyline = new Polyline({
  //   hasZ: true,
  //   hasM: true,
  //   paths: paths,
  //   spatialReference: { wkid: 4326 },
  // });

  // const simpleLineSymbol = {
  //   type: "simple-line",
  //   color: [226, 119, 40], // Orange
  //   width: 2,
  // };

  // const polylineGraphic = new Graphic({
  //   geometry: polyline,
  //   symbol: simpleLineSymbol,
  // });
  // graphicsLayer.add(polylineGraphic);

  // const popupBuildings = new PopupTemplate({
  //   title: "Building",
  //   content:
  //     "<b>Building:</b> {BLDG_NAME}<br><b>Address:</b> {ADDRESS}<br><b>City:</b>",
  // });

  // const building = new FeatureLayer({
  //   url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Buildings/FeatureServer/0",
  //   popupTemplate: popupBuildings,
  // });
  // pointGraphic.popupTemplate = popupBuildings;
  // mappingInstance.map.add(building);

  // return <div className="Campus">{locateWidget(mappingInstance.mapView)}</div>;
}

export default Campus;