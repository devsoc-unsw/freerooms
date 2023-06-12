import Box from "@mui/material/Box";
import {
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { API_URL, GOOGLE_API_KEY } from "../config";
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

const isInBounds = (lat: number, lng: number) =>
  lat >= mapBounds.south && lat <= mapBounds.north &&
  lng >= mapBounds.west && lng <= mapBounds.east;

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
  currentBuilding: Building | null;
  setCurrentBuilding: (building: Building) => void;
}

export const Map = ({ roomStatusData, currentBuilding, setCurrentBuilding }: MapProps) => {
  const [buildingData, setBuildingData] = useState<BuildingReturnData>({
    buildings: [],
  });

  const [userLat, setUserLat] = useState<number>();
  const [userLng, setUserLng] = useState<number>();
  const [currentHover, setCurrentHover] = useState<Building | null>(null);

  // Use debounce to allow moving from marker to popup without popup hiding
  const debouncedCurrentHover = useDebounce(currentHover, 50);

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

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: ["geometry"]
  });

  const [distances, setDistances] = useState<number[]>([]);

  useEffect(() => {
    if (userLat && userLng && isInBounds(userLat, userLng)) {
      setDistances(buildingData.buildings.map((building) =>
        Math.round(google.maps.geometry.spherical.computeDistanceBetween(
          { lat: building.lat, lng: building.long },
          { lat: userLat, lng: userLng },
        ))
      ));
    }
  }, [buildingData.buildings, userLat, userLng]);

  const renderMap = () => {
    return (
      // 86.5 is the height of the header
      <div style={{ position: "relative", top: "86.5px" }}>
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
          {buildingData.buildings.map((building, index) => (
            <OverlayViewF
              key={building.id}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{
                lat: building.lat,
                lng: building.long,
              }}
              zIndex={
                debouncedCurrentHover?.id === building.id ? 2 : 1
              }
            >
              <MarkerSymbol
                building={building}
                freerooms={getNumFreerooms(roomStatusData, building.id)}
                totalRooms={getTotalRooms(roomStatusData, building.id)}
                distance={distances[index]}
                currentBuilding={currentBuilding}
                setBuilding={setCurrentBuilding}
                currentHover={debouncedCurrentHover}
                setCurrentHover={setCurrentHover}
              ></MarkerSymbol>
            </OverlayViewF>
          ))}
          {userLat && userLng && isInBounds(userLat, userLng) && (
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
      </div>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now.</div>;
  }

  return isLoaded ? renderMap() : <></>;
};
