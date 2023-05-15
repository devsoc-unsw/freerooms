import Box from "@mui/material/Box";
import {
  GoogleMap,
  LoadScript,
  OverlayView,
  OverlayViewF,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

import { API_URL } from "../config";
import { Building, BuildingReturnData, RoomsReturnData } from "../types";
import { getNumFreerooms, getTotalRooms } from "../utils/utils";
import MarkerSymbol from "./MarkerSymbol";

const containerStyle = {
  height: "700px", // TODO: Make this responsive
};

const center = {
  lat: -33.91767,
  lng: 151.23129,
};

const mapBounds = {
  north: -33.915318,
  south: -33.91995,
  west: 151.225258,
  east: 151.237736,
};

const LocationMarker = () => {
  return (
    <>
      <Box
        sx={() => ({
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: "4px solid #BEDCF9",
          backgroundColor: "#4ABDFA",
        })}
      />
    </>
  );
};

interface MapProps {
  roomStatusData: RoomsReturnData | undefined;
  setCurrentBuilding: (building: Building) => void;
}

export const Map = ({ roomStatusData, setCurrentBuilding }: MapProps) => {
  const [buildingData, setBuildingData] = useState<BuildingReturnData>({
    buildings: [],
  });

  const [userLat, setUserLat] = useState<number>();
  const [userLng, setUserLng] = useState<number>();

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

  // Get current location of user
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLat(pos.lat);
          setUserLng(pos.lng);
        }
      );
    }
  }, []);

  // TODO: MarkerSymbol component to handle failure cases for getNumFreerooms()
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
            // disableDefaultUI: true,
            panControl: false,
            restriction: {
              latLngBounds: mapBounds,
              strictBounds: false,
            },
            styles: styleArray,
            // zoomControl: false,
          }}
          zoom={17.5}
        >
          {buildingData.buildings.map((building, index) => (
            <OverlayViewF
              key={index}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{
                lat: building.lat,
                lng: building.long,
              }}
            >
              <MarkerSymbol
                building={building}
                freerooms={getNumFreerooms(roomStatusData, building.id)}
                totalRooms={getTotalRooms(roomStatusData, building.id)}
                // userCoords={{ lat: userLat, lng: userLng }}
                distance={100} // TODO: Stop this from being hardcoded
                setBuilding={setCurrentBuilding}
              ></MarkerSymbol>
            </OverlayViewF>
          ))}
          {userLat && userLng && (
            <OverlayViewF
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{
                lat: userLat,
                lng: userLng,
              }}
            >
              <LocationMarker />
            </OverlayViewF>
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};
