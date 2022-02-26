import React from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import esriConfig from "@arcgis/core/config.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";

function Campus() {
  esriConfig.apiKey =
    "AAPK46037065a5604a5cabbb162bdae00b9dIk7R92SXsV3FKXjgXnhF829z71uovMU0SH_pRtgSH4aiDzpDEdAl4MksTkBPHFfg";
  const map = new Map({
    basemap: "arcgis-community",
  });

  const view = new MapView({
    map: map,
    center: [151.231, -33.916],
    zoom: 16,
    container: "root",
  });

  let basemapGallery = new BasemapGallery({
    view: view,
    visible: true,
  });

  // Add widget to the top right corner of the view
  view.ui.add(basemapGallery, {
    position: "top-right",
  });

  return <div className="Campus"></div>;
}

export default Campus;
