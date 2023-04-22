'use client'
import { useEffect, useState } from "react";

import Mapping from "../../components/BaseMap";
import { API_URL } from "../../config";
import { Building, BuildingReturnData } from "../../types";

export default function Page() {
  const [buildingData, setBuildingData] = useState<BuildingReturnData>({ buildings: [] });

  useEffect(() => {
    fetch(API_URL + "/buildings")
      .then(res => res.json())
      .then(data => setBuildingData(data as BuildingReturnData))
      .catch(() => setBuildingData({ buildings: [] }));
  }, []);

  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(
    null,
  );

  return (
    <>
      <Mapping
        setCurrentBuilding={setCurrentBuilding}
        buildingData={buildingData}
      />
    </>
  );
}
