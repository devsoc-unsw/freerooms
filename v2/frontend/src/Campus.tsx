import { map, view } from "./Basemap";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import geometry from "@arcgis/core/geometry/Geometry";
import Point from "@arcgis/core/geometry/Point";
import TileLayer from "@arcgis/core/layers/TileLayer";
import PortalItem from "@arcgis/core/portal/PortalItem";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Layer from "@arcgis/core/layers/Layer";
import locateWidget from "./CurrentLocation";

function Campus() {
  const graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);
  // add a point to the graphic layer
  const point = new Point({
    longitude: 151.231,
    latitude: -33.917,
  });

  const simpleMarkerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40], // Orange
    outline: {
      color: [255, 255, 255], // White
      width: 1,
    },
  };

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: simpleMarkerSymbol,
  });

  graphicsLayer.add(pointGraphic);

  // adding polyline to map
  // to do all the buildings, CSVLayer can be used
  const paths = [
    [
      [151.22801, -33.9177, 35.4],
      [151.2287, -33.91841, 35.5],
      [151.22801, -33.9177, 35.6],
      [151.2287, -33.91841, 35.4],
    ],
  ];
  const polyline = new Polyline({
    hasZ: true,
    hasM: true,
    paths: paths,
    spatialReference: { wkid: 4326 },
  });

  const simpleLineSymbol = {
    type: "simple-line",
    color: [226, 119, 40], // Orange
    width: 2,
  };

  const polylineGraphic = new Graphic({
    geometry: polyline,
    symbol: simpleLineSymbol,
  });
  graphicsLayer.add(polylineGraphic);

  const popupBuildings = new PopupTemplate({
    title: "Building",
    content:
      "<b>Building:</b> {BLDG_NAME}<br><b>Address:</b> {ADDRESS}<br><b>City:</b>",
  });

  const building = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Buildings/FeatureServer/0",
    popupTemplate: popupBuildings,
  });
  pointGraphic.popupTemplate = popupBuildings;
  map.add(building);

  return <div className="Campus">{locateWidget}</div>;
}

export default Campus;
