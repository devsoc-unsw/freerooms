import { loadModules } from "esri-loader";
import React, { useEffect } from "react";
import loadBaseMap from "./MyMap";

import { Building, BuildingReturnData } from "../types";
import { clickedFeature,openFeature } from "./MarkerSymbol";

const MapLayer: React.FC<{
  buildingData: BuildingReturnData;
  setCurrentBuilding: (building: Building) => void;
}> = ({ buildingData, setCurrentBuilding }) => {
  useEffect(() => {
    const loadModules = async () => ([
      "esri/layers/FeatureLayer",
      "esri/Graphic",
      "esri/widgets/Track",
      "esri/widgets/Search",
    ])
      .then(
        ([FeatureLayer, Graphic, Track,Search]) => {
          const {map, view} = await loadBaseMap();
          // tracking widget
          const track = new Track({
            view: view,
          });

          view.ui.add(track, "top-left");
          view.when(() => {
            track.start();
          });


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
                weight: "normal",
              },
            },

            labelPlacement: "above-center",
            labelExpressionInfo: {
              expression: "$feature.building_name",
            },
          };

          const layer = new FeatureLayer({
            url: "https://services7.arcgis.com/2PcAgU0oUMmfCqzW/arcgis/rest/services/unsw_map_feature_layer/FeatureServer/0",
            renderer: openFeature,
            labelingInfo: [buildingLabel],
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
                apiKey:
                  "AAPK7fbfd710c5e443e28d309fc3ba297ceb_Wb-Lg6smsxOnafMSRQLTx3WwDI-mv9jKXig8AECw0pTh06C_uyS40dTDpgPIDMd",
                singleLineFieldName: "SingleLine",
                url: "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer",
              },
            ],
          });

          view.ui.add(search, {
            position: "top-right",
          });

          view.on("click", async (event: any) => {
            const response = await view.hitTest(event.screenPoint);
            const graphic = response.results[0].graphic;

            const attributes = graphic.attributes;
            if (attributes) {
              const building = attributes.building_name;

              if (building) {
                const buildingFound = buildingData.buildings.find(
                  (b: Building) => b.name === building
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
        }
      )
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://js.arcgis.com/4.25/esri/themes/light/main.css"
      ></link>
      <div id="viewDiv"></div>
    </>
  );
};

export default Mapping;
