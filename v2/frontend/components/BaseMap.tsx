import { loadModules } from "esri-loader";
import { useEffect } from "react";

const mapping = ({ setCurrentBuilding, buildingData }) => {
  useEffect(() => {
    loadModules([
      "esri/Map",
      "esri/views/MapView",
      "esri/config",
      "esri/layers/FeatureLayer"
    ])
    .then(([
      Map,
      MapView,
      esriConfig, 
      FeatureLayer
    ]) => {
      const map = new Map({
        basemap: "arcgis-topographic" 
      });
  
      const view = new MapView({
        map: map,
        center: [151.231, -33.917], // Longitude, latitude
        zoom: 18, // Zoom level
        container: "viewDiv" // Div element
      });
  
      esriConfig.apiKey = "AAPK7fbfd710c5e443e28d309fc3ba297ceb_Wb-Lg6smsxOnafMSRQLTx3WwDI-mv9jKXig8AECw0pTh06C_uyS40dTDpgPIDMd"; 
      
      const buildingRenderer = {
        "type": "simple",
        "symbol": {
          "type": "picture-marker",
          "url": "https://static.vecteezy.com/system/resources/previews/009/385/892/original/pin-location-icon-sign-free-png.png",
          "width": "24px",
          "height": "32px"
        }
      }

      const buildingLabel = {
        symbol: {
          type: "text",
          color: "#FFFFFF",
          haloColor: "#5E8D74",
          haloSize: "2px",
          font: {
            size: "12px",
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
        renderer: buildingRenderer,
        labelingInfo: [buildingLabel]
      });
      
      map.add(layer);
      
      console.log('works>>');
      view.on("click", function (evt) {
        view.hitTest(evt.screenPoint)
          .then(function (response) {
            var graphic = response.results[0].graphic;
            if (graphic) {
              const building = graphic.attributes.building_name; 

              if (building) {
                const buildingFound = buildingData.buildings.find(
                  (b) => b.name === building,
                );
                if (buildingFound) {
                  setCurrentBuilding(buildingFound);
                }
              }

            }
          });
      });
    })
    .catch((error) => {
      console.error(error)
    })
  }, []);

  return (
    <div id="viewDiv"></div>
  );
};

export default mapping;

