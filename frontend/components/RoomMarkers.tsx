import { useEffect, useState } from "react";
import { Marker } from "react-map-gl/mapbox";

type RoomMarkersData = {
  [roomId: string]: [number, number];
};

type RoomMarker = {
  id: string;
  lat: number;
  long: number;
};

const MapBoxMarker = () => {
  // Changing data structure to {[id: string, lat: number, long: number]...}
  const [roomMarkers, setRoomMarkers] = useState<RoomMarker[]>([]);
  useEffect(() => {
    fetch("/roomMarkers.json")
      .then((res) => res.json())
      .then((markersData) => {
        const data = markersData as RoomMarkersData;
        const markers = Object.entries(data).map(([id, coords]) => {
          const [longitude, latitude] = coords;
          return {
            id,
            lat: latitude,
            long: longitude,
          };
        });
        setRoomMarkers(markers);
      })
      .catch((err) => console.error("Failed to load room markers:", err));
  }, []);

  return (
    <>
      {roomMarkers.map((room) => (
        <Marker
          key={room.id}
          latitude={room.lat}
          longitude={room.long}
          anchor="bottom"
        >
          <img
            src="/MapPin.png"
            alt="Room pin"
            style={{ width: 15, height: 15 }}
          />
        </Marker>
      ))}
    </>
  );
};

export default MapBoxMarker;
