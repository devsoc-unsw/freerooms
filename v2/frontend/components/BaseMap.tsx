import { loadModules } from "esri-loader";
import React, { useEffect } from "react";
import { openFeature, clickedFeature } from "./MarkerSymbol";
import { Building, BuildingReturnData } from "../types";

const Mapping: React.FC<{
  buildingData: BuildingReturnData;
  setCurrentBuilding: (building: Building) => void;
}> = ({ buildingData, setCurrentBuilding }) => {
  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/config",
      "esri/layers/FeatureLayer", 
      "esri/Graphic", 
      "esri/Basemap",
      "esri/layers/VectorTileLayer",
      "esri/widgets/Track",
      "esri/widgets/Search"
    ])
    .then(([
      Map,
      MapView,
      esriConfig, 
      FeatureLayer, 
      Graphic, 
      Basemap,
      VectorTileLayer,
      Track, 
      Search
    ]) => {

      const basemap = new Basemap({
        baseLayers: [
          new VectorTileLayer({
            portalItem: {
              id: "df9c45bd660c42e99231f5b197386599" 
            }
          })
        ]
      });
      
      const map = new Map({
        basemap: basemap
      });
  
      const view = new MapView({
        map: map,
        center: [151.231, -33.917], // Longitude, latitude
        zoom: 16, // Zoom level
        container: "viewDiv" // Div element
      });

      // tracking widget 
      const track = new Track({
        view: view
      });

      view.ui.add(track, "top-left");
      view.when(() => {
        track.start();
      });
  
      esriConfig.apiKey = "AAPK7fbfd710c5e443e28d309fc3ba297ceb_Wb-Lg6smsxOnafMSRQLTx3WwDI-mv9jKXig8AECw0pTh06C_uyS40dTDpgPIDMd"; 

      const buildingLabel = {
        symbol: {
          type: "text",
          color: "#61432C",
          haloColor: "white",
          haloSize: "2px",
          font: {
            size: "10px",
            family: "Noto Sans",
            style: "normal",
            weight: "normal"
          }
        },

        labelPlacement: "above-center",
        labelExpressionInfo: {
          expression: "$feature.building_name"
        }
      };
      
      const layer = new FeatureLayer({
        url: "https://services7.arcgis.com/2PcAgU0oUMmfCqzW/arcgis/rest/services/unsw_map_feature_layer/FeatureServer/0",
        renderer: openFeature,
        labelingInfo: [buildingLabel]
      });
      
      map.add(layer);

      // search widget 
      const search = new Search({
        view: view,
        allPlaceholder: "Building Name",
        includeDefaultSources: false,
        sources: [
          {
            name: "Building Name",
            layer: layer,
            searchFields: ["building_name"],
            exactMatch: false,
          },
          {
            name: "Location Service",
            apiKey: "AAPK7fbfd710c5e443e28d309fc3ba297ceb_Wb-Lg6smsxOnafMSRQLTx3WwDI-mv9jKXig8AECw0pTh06C_uyS40dTDpgPIDMd",
            singleLineFieldName: "SingleLine",
            url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer"
          }
        ]
      });

      view.ui.add(search, {
        position: "top-right"
      });
      
      view.on("click", async (event: any) => {
        const response = await view.hitTest(event.screenPoint);
        const graphic = response.results[0].graphic;

        const attributes = graphic.attributes; 
        if (attributes) {
          const building = attributes.building_name;

          if (building) {
            const buildingFound = buildingData.buildings.find(
              (b:Building) => b.name === building,
            );

            if (buildingFound) {
              setCurrentBuilding(buildingFound);
            }
          }
        }

        const geometry = graphic.geometry;
        if (geometry && geometry.type == "point") {
          const graphicLayer = new Graphic(geometry, clickedFeature);
          view.graphics.removeAll(); 
          view.graphics.add(graphicLayer);          
        }
      });
    })
    .catch((error) => {
      console.error(error)
    })
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://js.arcgis.com/4.25/esri/themes/light/main.css"></link>
      <div id="viewDiv"></div>
    </>
  );
};

export default Mapping;

