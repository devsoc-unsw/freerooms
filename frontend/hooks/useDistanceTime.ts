import { useState, useEffect } from "react";

type DistanceTimeData = {
  distance_km: number | null;
  duration_mins: number | null;
};

export const useDistanceTime = (
  userLat?: number,
  userLng?: number,
  roomGeometry?: { coordinates: [number, number] }
) => {
  const [distanceTimeData, setDistanceTimeData] = useState<DistanceTimeData>({
    distance_km: null,
    duration_mins: null,
  });

  useEffect(() => {
    if (!userLat || !userLng || !roomGeometry) return;

    const fetchDistance = async () => {
      try {
        const src = `${userLng},${userLat}`;
        const dest = roomGeometry.coordinates.join(",");
        const res = await fetch(`/api/distance?src=${src}&dest=${dest}`);
        const data = await res.json();

        setDistanceTimeData({
          distance_km: data.distance_km ? parseFloat(data.distance_km) : null,
          duration_mins: data.duration_mins
            ? parseFloat(data.duration_mins)
            : null,
        });
      } catch (err) {
        console.error("Failed to fetch distance:", err);
      }
    };

    fetchDistance();
  }, [userLat, userLng, roomGeometry]);

  return distanceTimeData;
};
