import {
  GoogleMap,
  LoadScript,
  OverlayView,
  OverlayViewF,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import { API_URL } from "../config";
import { BuildingReturnData } from "../types";
import { MarkerSymbol } from "./MarkerSymbol";

const containerStyle = {
  height: "700px", // TODO: Make this responsive
};

const center = {
  lat: -33.91717,
  lng: 151.23129,
};

const mapBounds = {
  north: -33.914491,
  south: -33.921608,
  west: 151.225258,
  east: 151.237736,
};

export const Map = () => {
  const [buildingData, setBuildingData] = useState<BuildingReturnData>({
    buildings: [],
  });

  const getBuildingData = () => {
    fetch(API_URL + "/buildings")
      .then((res) => res.json())
      .then((data) => {
        setBuildingData(data as BuildingReturnData);
      })
      .catch(() => setBuildingData({ buildings: [] }));
  };

  useEffect(() => {
    getBuildingData();
  }, []);

  // TODO: Get all of the free rooms available in a building
  const styleArray = [
    {
      featureType: "all",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "landscape",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "landscape",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];

  return (
    <>
      <LoadScript
        googleMapsApiKey={
          process.env.NODE_ENV === "development"
            ? (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_DEV as string)
            : (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY_PROD as string)
        }
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          options={{
            clickableIcons: false,
            disableDefaultUI: true,
            panControl: false,
            restriction: {
              latLngBounds: mapBounds,
              strictBounds: false,
            },
            styles: styleArray,
            zoomControl: false,
          }}
          zoom={17}
        >
          {buildingData.buildings.map((building, index) => (
            <OverlayViewF
              key={index}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{ lat: building.lat, lng: building.long }}
            >
              <MarkerSymbol
                buildingLabel={building.name}
                freerooms={0}
              ></MarkerSymbol>
            </OverlayViewF>
          ))}
        </GoogleMap>
      </LoadScript>
    </>
  );
};
