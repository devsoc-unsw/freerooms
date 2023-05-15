import Box from "@mui/material/Box";
import {
  DistanceMatrixService,
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
  height: "calc(100vh - 86.5px)", // 86.5px is the height of the header
};

const center = {
  lat: -33.91767,
  lng: 151.23129,
};

const mapBounds = {
  north: -33.915318,
  south: -33.9202,
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

  const [distance, setDistance] = useState<number>();
  // Default values: center coordinates of map
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
    // 86.5 is the height of the header
    <div style={{ position: "relative", top: "86.5px" }}>
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
            fullscreenControl: false,
            mapTypeControl: false,
            restriction: {
              latLngBounds: mapBounds,
              strictBounds: false,
            },
            styles: styleArray,
            // zoomControl: false,
          }}
          zoom={17.5}
        >
          {buildingData.buildings.map((building) => (
            <>
              <DistanceMatrixService
                options={{
                  origins: [
                    {
                      lat: userLat ? userLat : center.lat,
                      lng: userLng ? userLng : center.lng,
                    },
                  ],
                  destinations: [{ lat: building.lat, lng: building.long }],
                  travelMode: google.maps.TravelMode.WALKING,
                }}
                callback={(response) => {
                  console.log(response);
                }}
              />
              <OverlayViewF
                key={building.id}
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
                  distance={distance}
                  setBuilding={setCurrentBuilding}
                ></MarkerSymbol>
              </OverlayViewF>
            </>
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
    </div>
  );
};
