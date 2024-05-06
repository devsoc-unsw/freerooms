import { Building, BuildingStatus } from "@common/types";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RoomIcon from "@mui/icons-material/Room";
import Box, { BoxProps } from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system/colorManipulator";
import Image, { ImageProps } from "next/image";
import React from "react";

import useBuilding from "../hooks/useBuilding";
import useBuildingStatus from "../hooks/useBuildingStatus";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "../redux/currentBuildingSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import { getNumFreerooms, getTotalRooms } from "../utils/utils";

const MapMarker: React.FC<{
  buildingId: string;
  distance: number | undefined;
  currentHover: Building | null;
  setCurrentHover: (building: Building | null) => void;
}> = ({ buildingId, distance, currentHover, setCurrentHover }) => {
  // Get building data
  const { building } = useBuilding(buildingId);
  const { status: liveStatus } = useBuildingStatus(buildingId);

  // This one uses stale data so markers don't disappear
  const [status, setStatus] = React.useState<BuildingStatus>();
  React.useEffect(() => {
    if (liveStatus) setStatus(liveStatus);
  }, [liveStatus]);
  const freerooms = getNumFreerooms(status);
  const totalRooms = getTotalRooms(status);

  const dispatch = useDispatch();
  const currentBuilding = useSelector(selectCurrentBuilding);
  const isCurrentBuilding = currentBuilding?.id === building?.id;

  const [showPopup, setShowPopup] = React.useState(false);
  React.useEffect(() => {
    setShowPopup(currentHover?.id === building?.id);
  }, [currentHover, building]);

  const [colour, setColour] = React.useState("#e57373");
  React.useEffect(() => {
    freerooms >= 5
      ? setColour("#66bb6a")
      : freerooms !== 0
        ? setColour("#ffa726")
        : setColour("#f44336");
  }, [freerooms]);

  if (!building) return <></>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => {
        setCurrentHover(building);
      }}
      onMouseLeave={() => {
        setCurrentHover(null);
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          textShadow:
            "-.5px -.5px 1px #f2f2f2, .5px -.5px 1px #f2f2f2, -.5px .5px 1px #f2f2f2, .5px .5px 1px #f2f2f2",
        }}
      >
        {building.name}
      </Typography>
      <Box
        sx={(theme) => ({
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: isCurrentBuilding ? `5px solid ${colour}` : "4px solid white",
          backgroundColor: isCurrentBuilding ? "white" : colour,
          boxShadow: isCurrentBuilding
            ? `0px 0px 6px 4px ${alpha(colour, 0.5)}`
            : "",
          position: "relative",
          "&:hover": {
            cursor: "pointer",
          },
        })}
        onClick={() => dispatch(setCurrentBuilding(building))}
      />
      <Fade in={showPopup} timeout={200}>
        <div style={{ position: "relative", bottom: -3 }}>
          <MarkerHover
            building={building}
            freerooms={freerooms}
            totalRooms={totalRooms}
            distance={distance}
          />
        </div>
      </Fade>
    </div>
  );
};

const MarkerHover: React.FC<{
  building: Building;
  freerooms: number;
  totalRooms: number;
  distance: number | undefined;
}> = ({ building, freerooms, totalRooms, distance }) => {
  const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
    position: "absolute",
    flex: 1,
    backgroundColor: theme.palette.primary.main,
    height: 200,
    width: 300,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "1px 1px 5px #1f1f1f",
  }));

  const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
    objectFit: "cover",
  }));

  const InfoBox = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    pointerEvents: "none",
    alignItems: "center",
    fontSize: "small",
    gap: 10,
  }));

  const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: 8,
    padding: 8,
    paddingLeft: 12,
    paddingRight: 12,
    margin: 10,
    pointerEvents: "none",
  }));

  return (
    <MainBox>
      <StyledImage
        alt={`Image of ${building.id}`}
        src={`/assets/building_photos/${building.id}.webp`}
        fill={true}
        priority={true}
      />
      <TitleBox>
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
          {building.name}
        </Typography>
        <InfoBox>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MeetingRoomIcon />
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              {`${freerooms}/${totalRooms} available`}
            </Typography>
          </div>
          {distance && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <RoomIcon />
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                {`${distance} m`}
              </Typography>
            </div>
          )}
        </InfoBox>
      </TitleBox>
    </MainBox>
  );
};

export default MapMarker;
