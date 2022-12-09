import { loadModules } from "esri-loader";
import React, { useEffect } from "react";
import loadBaseMap from "./MyMap";

import { Building, BuildingReturnData, RoomsReturnData } from "../types";
import loadSymbols, { clickedFeature, openFeature } from "./MarkerSymbol";

const Mapping: React.FC<{
  buildingData: BuildingReturnData;
  setCurrentBuilding: (building: Building) => void;
  roomStatusData: RoomsReturnData;
}> = ({ buildingData, setCurrentBuilding, roomStatusData }) => {
  useEffect(() => {
    generateMap(buildingData, setCurrentBuilding, roomStatusData);

    // view.on("click", async (event: any) => {
    //   const response = await view.hitTest(event.screenPoint);
    //   const graphic = response.results[0].graphic;

    //   const attributes = graphic.attributes;
    //   if (attributes) {
    //     const building = attributes.building_name;

    //     if (building) {
    //       const buildingFound = buildingData.buildings.find(
    //         (b: Building) => b.name === building
    //       );

    //       if (buildingFound) {
    //         setCurrentBuilding(buildingFound);
    //       }
    //     }
    //   }

    //   const geometry = graphic.geometry;
    //   if (geometry && geometry.type == "point") {
    //     const graphicLayer = new Graphic(geometry, clickedFeature);
    //     view.graphics.removeAll();
    //     view.graphics.add(graphicLayer);
    //   }
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

export async function generateMap(
  buildingData: BuildingReturnData,
  setCurrentBuilding: (building: Building) => void,
  roomStatusData: RoomsReturnData
) {
  const { map, view } = await loadBaseMap();
  const { openFeature, clickedFeature } = await loadSymbols();
  const [Track, Search, FeatureLayer] = await loadModules(["esri/widgets/Track", "esri/widgets/Search", "esri/layers/FeatureLayer"]);

  // tracking widget
  const track = new Track({
    view: view,
  });

  view.ui.add(track, "top-left");
  view.when(() => {
    track.start();
  }); 

  // add label to map 
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

  const customFields = [
    {
      name: "status", 
      type: "string", 
      alias: "status"
    }, 
    {
      name: "building_name", 
      type: "string", 
      alias: "name"
    }, 
    {
      name: "id", 
      type: "string", 
      alias: "id"
    }
  ];

  // create feature layer which incudes the labels
  const layer = new FeatureLayer({
    url: "https://services7.arcgis.com/2PcAgU0oUMmfCqzW/arcgis/rest/services/unsw_feature_layer_2/FeatureServer/0",
    labelingInfo: [buildingLabel],
    renderer: openFeature,
    fields: customFields
  });

  let newFeature: Map<string, Map<String, any>>[] = [];
  const buildings = buildingData.buildings;
  for (const building of buildings) {
    let newCollection = new Map<string, Map<String, any>>();
    let newGeometry = new Map<string, any>();
    newGeometry.set("type", "point"); 
    newGeometry.set("x", building["lat"]);
    newGeometry.set("y", building["long"]);

    newCollection.set("geometry", newGeometry);

    let newAttribute = new Map<string, any>();
    newAttribute.set("name", building["name"]); 
    newAttribute.set("id", building["id"]);

    newCollection.set("attributes", newAttribute);

    newFeature.push(newCollection);
  }

  console.log(newFeature);

  layer.addFeature(newFeature);

  // useEffect(() => {
  //   const layerView = view.getLayerView(layer);
  //   const graphics = layerView.graphics; 

  //   for (const attribute of graphics) {
  //     if (attribute) {
  //       const color = getColor(roomStatusData, attribute.id);
  //       layer.
  //     }
  //   }
  // }, [roomStatusData]);

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
}

const getColor = (
  roomStatus: RoomsReturnData,
  buildingId: string
): string => {
  let freerooms = 0;
  for (const room of Object.values(roomStatus[buildingId])) {
    if (room.status === "free") freerooms++;
  }

  if (freerooms >= 5) { 
    return "green" 
  }
  else if (freerooms !== 0) { 
    return "orange" 
  }
  else { 
    return "red"
  }
}



export default Mapping;
