import { Building } from "@common/types";
import useBuilding from "@frontend/hooks/useBuilding";
import Box from "@mui/material/Box";
import {
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { DarkModeContext } from "app/clientLayout";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
import BuildingDrawer from "views/BuildingDrawer";

import { GOOGLE_API_KEY } from "../config";
import useBuildings from "../hooks/useBuildings";
import useUserLocation from "../hooks/useUserLocation";
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import calculateDistance from "../utils/calculateDistance";
import getMapType from "../utils/getMapType";
import MapMarker from "./MapMarker";
import { navHeight } from "./NavBar";

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
  lat >= mapBounds.south &&
  lat <= mapBounds.north &&
  lng >= mapBounds.west &&
  lng <= mapBounds.east;

const LocationMarker = () => {
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        border: "4px solid #BEDCF9",
        backgroundColor: "#4ABDFA",
      }}
    />
  );
};

export const Map = () => {
  // Fetch data
  const { buildings } = useBuildings();
  const { isDarkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  // Use debounce to allow moving from marker to popup without popup hiding
  const [currentHover, setCurrentHover] = useState<Building | null>(null);
  const [debouncedCurrentHover] = useDebounceValue(currentHover, 50);

  const styleArray = useMemo(() => getMapType(isDarkMode), [isDarkMode]);

  // Get current location of user
  const { userLat, userLng } = useUserLocation();

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  const distances = useMemo(() => {
    if (buildings && userLat && userLng && isInBounds(userLat, userLng)) {
      return buildings.map((building) =>
        calculateDistance(userLat, userLng, building.lat, building.long)
      );
    }
    return [];
  }, [buildings, userLat, userLng]);

  //set current building to search param query - THIS IS WHERE OTHER QUERIES CAN GO
  const searchParams = useSearchParams();
  const buildingId = searchParams.get("building");
  const { building } = useBuilding(buildingId || "");

  useEffect(() => {
    if (building) {
      dispatch(setCurrentBuilding(building || null));
    }
  }, [building, dispatch]);

  const mapOptions = useMemo(
    () => ({
      clickableIcons: false,
      fullscreenControl: false,
      mapTypeControl: false,
      restriction: {
        latLngBounds: mapBounds,
        strictBounds: false,
      },
      styles: styleArray,
    }),
    [styleArray]
  );

  const renderMap = () => {
    return (
      <div
        style={{
          position: "relative",
          height: `calc(100svh - ${navHeight}px)`,
        }}
      >
        <GoogleMap
          key={isDarkMode ? "dark-map" : "light-map"}
          mapContainerStyle={{ height: "100%" }}
          center={center}
          options={mapOptions}
          zoom={17.5}
        >
          {buildings &&
            buildings.map((building, index) => (
              <OverlayViewF
                key={building.id}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                position={{
                  lat: building.lat,
                  lng: building.long,
                }}
                zIndex={debouncedCurrentHover?.id === building.id ? 2 : 1}
              >
                <MapMarker
                  buildingId={building.id}
                  distance={distances[index]}
                  currentHover={debouncedCurrentHover}
                  setCurrentHover={setCurrentHover}
                />
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
        <BuildingDrawer />
      </div>
    );
  };

  if (loadError) {
    return <div>Map cannot be loaded right now.</div>;
  }

  return isLoaded ? renderMap() : <></>;
};
