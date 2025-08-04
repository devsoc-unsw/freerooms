"use client";
import useRoom from "hooks/useRoom";
import Image from "next/image";
import { useEffect } from "react";
import { Marker } from "react-map-gl/mapbox";

const RoomMapMarker = ({
  roomId,
  roomLocation,
}: {
  roomId: string;
  roomLocation?: (lat: number, long: number) => void;
}) => {
  const { room } = useRoom(roomId);

  useEffect(() => {
    if (room && roomLocation) {
      roomLocation(room.lat, room.long);
    }
  }, [room, roomLocation]);

  if (!room) return null;

  return (
    <Marker
      key={roomId}
      latitude={room.lat}
      longitude={room.long}
      anchor="bottom"
    >
      <Image src="/MapPin.png" alt="Room pin" width={30} height={30} />
    </Marker>
  );
};

export default RoomMapMarker;
