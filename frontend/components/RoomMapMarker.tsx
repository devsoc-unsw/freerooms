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

const RoomMapMarker = ({
  roomId,
  roomLocation,
}: {
  roomId?: string;
  roomLocation?: (lat: number, long: number) => void;
}) => {
  // Changing data structure to {[id: string, lat: number, long: number]...}
  const [roomMarker, setRoomMarker] = useState<RoomMarker | null>(null);
  useEffect(() => {
    if (!roomId) return;
    fetch("/roomMarkers.json")
      .then((res) => res.json())
      .then((markersData) => {
        const data = markersData as RoomMarkersData;
        const roomCoords = data[roomId];

        if (roomCoords) {
          const [longitude, latitude] = roomCoords;
          const marker: RoomMarker = {
            id: roomId,
            lat: latitude,
            long: longitude,
          };
          setRoomMarker(marker);

          if (roomLocation) {
            roomLocation(latitude, longitude);
          }
        }
      })
      .catch((err) => console.error("Failed to load room markers:", err));
  }, [roomId, roomLocation]);

  if (!roomMarker) return null;
  return (
    <Marker
      key={roomMarker.id}
      latitude={roomMarker.lat}
      longitude={roomMarker.long}
      anchor="bottom"
    >
      <img src="/MapPin.png" alt="Room pin" style={{ width: 30, height: 30 }} />
    </Marker>
  );
};

export default RoomMapMarker;
