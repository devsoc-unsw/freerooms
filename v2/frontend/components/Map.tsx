import Box from "@mui/material/Box";
import {
  DistanceMatrixService,
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { Fragment, useEffect, useState } from "react";
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
    googleMapsApiKey: GOOGLE_API_KEY
  });

  const [distances, setDistances] = useState<number[]>([]);

  useEffect(() => {
    if (userLat && userLng) {
      const origin = {
        lat: userLat,
        lng: userLng,
      };

      const destinations = buildingData.buildings.map((building) => {
        return { lat: building.lat, lng: building.long };
      });

      // Split into multiple calls due to API usage restraints
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: destinations.slice(0, 25),
          travelMode: google.maps.TravelMode.WALKING,
        },
        getDistance
      );

      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: destinations.slice(25),
          travelMode: google.maps.TravelMode.WALKING,
        },
        getDistance
      );
    }

    function getDistance(response: any, status: any) {
      if (response && status === "OK") {
        // Distances computed for all buildings already - restart array
        if (distances.length === buildingData.buildings.length) {
          setDistances([]);
        }

        const length = response.rows[0].elements.length;
        for (let i = 0; i < length; i++) {
          response &&
            setDistances([
              ...distances,
              response.rows[0].elements[i].distance.value,
            ]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLat, userLng]);

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
            <Fragment key={building.id}>
              {userLat && userLng && (
                <DistanceMatrixService
                  options={{
                    origins: [
                      {
                        lat: userLat,
                        lng: userLng,
                      },
                    ],
                    destinations: [{ lat: building.lat, lng: building.long }],
                    travelMode: google.maps.TravelMode.WALKING,
                  }}
                  callback={(response) => {
                    response &&
                      distances.push(
                        response.rows[0].elements[0].distance.value
                      );
                  }}
                />
              )}
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
                  setBuilding={setCurrentBuilding}
                  currentHover={debouncedCurrentHover}
                  setCurrentHover={setCurrentHover}
                ></MarkerSymbol>
              </OverlayViewF>
            </Fragment>
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
      </div>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now.</div>;
  }

  return isLoaded ? renderMap() : <></>;
};
