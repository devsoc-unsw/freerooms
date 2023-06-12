"use client";
import axios from "axios";
import { useEffect, useState } from "react";

import { Map } from "../../components/Map";
import { API_URL } from "../../config";
import {
  Building,
  BuildingReturnData,
  Filters,
  RoomsRequestParams,
  RoomsReturnData,
} from "../../types";

export default function Page() {
  const [buildingData, setBuildingData] = useState<BuildingReturnData>({
    buildings: [],
  });

  useEffect(() => {
    fetch(API_URL + "/buildings")
      .then((res) => res.json())
      .then((data) => setBuildingData(data as BuildingReturnData))
      .catch(() => setBuildingData({ buildings: [] }));
  }, []);

  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);
  const [datetime, setDatetime] = useState<Date | null>(new Date());
  const [filters, setFilters] = useState<Filters>({});

  const [roomStatusData, setRoomStatusData] = useState<
    RoomsReturnData | undefined
  >();

  useEffect(() => {
    const fetchRoomStatus = () => {
      const params: RoomsRequestParams = { ...filters };
      if (datetime) {
        params.datetime = datetime.toISOString();
      }

      axios
        .get(API_URL + "/rooms", { params: params })
        .then((res) => {
          setRoomStatusData(res.status == 200 ? res.data : {});
        })
        .catch((err) => setRoomStatusData({}));
    };

    setRoomStatusData(undefined);
    fetchRoomStatus();
  }, [filters, datetime]);

  return (
    <>
      <Map
        roomStatusData={roomStatusData}
        currentBuilding={currentBuilding}
        setCurrentBuilding={setCurrentBuilding}
      />
    </>
  );
}
