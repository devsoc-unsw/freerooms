import { useEffect, useState } from "react";

type RoomCoords = {
  lat: number;
  long: number;
};

const useRoomCoords = (roomId?: string) => {
  const [coords, setCoords] = useState<RoomCoords | null>(null);

  useEffect(() => {
    if (!roomId) return;

    fetch(`/api/rooms/${roomId}`)
      .then((res) => res.json())
      .then((roomData) => {
        if (roomData?.lat && roomData?.long) {
          setCoords({ lat: roomData.lat, long: roomData.long });
        }
      })
      .catch((err) => console.error("Failed to fetch room coordinates:", err));
  }, [roomId]);

  return coords;
};

export default useRoomCoords;
