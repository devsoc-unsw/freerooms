"use client";
import useRoomCoords from "hooks/useRoomCoords";
import Image from "next/image";
import { useEffect } from "react";
// import { useEffect, useState } from "react";
import { Marker } from "react-map-gl/mapbox";

// type RoomMarkersData = {
//   [roomId: string]: [number, number];
// };

// type RoomMarker = {
//   id: string;
//   lat: number;
//   long: number;
// };

const RoomMapMarker = ({
  roomId,
  roomLocation,
}: {
  roomId?: string;
  roomLocation?: (lat: number, long: number) => void;
}) => {
  const coords = useRoomCoords(roomId);

  useEffect(() => {
    if (coords && roomLocation) {
      roomLocation(coords.lat, coords.long);
    }
  }, [coords, roomLocation]);

  if (!coords) return null;

  return (
    <Marker
      key={roomId}
      latitude={coords.lat}
      longitude={coords.long}
      anchor="bottom"
    >
      <Image src="/MapPin.png" alt="Room pin" width={30} height={30} />
    </Marker>
  );
};

export default RoomMapMarker;
