import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import Image, { ImageProps } from "next/image";
import React from "react";

import useBuilding from "../hooks/useBuilding";
import useBuildingStatus from "../hooks/useBuildingStatus";
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import { getNumFreerooms, getTotalRooms } from "../utils/utils";
import StatusDot from "./StatusDot";

const INITIALISING = -2;
const FAILED = -1;

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
	alignItems: "center",
	justifyContent: "center",
  flex: 1,
  height: 100,
  borderRadius: 10,
	backgroundColor: 'black',
	transition: "all 0.1s ease-in-out",
	padding: 10,
  "&:hover": {
    cursor: "pointer",
		backgroundColor: theme.palette.primary.main,
  },
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: 10,
	opacity: 0.7,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.5,
  },
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: 15,
  position: "absolute",
  right: 0,
  backgroundColor: "white",
  padding: 8,
  paddingLeft: 10,
  paddingRight: 15,
  margin: 10,
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
	width: '100%',
	height: '100%',
  position: "relative",
	alignItems: "center",
  color: "white",
	padding: 10,
}));

const BuildingCardMobile: React.FC<{
  buildingId: string;
}> = ({ buildingId }) => {
  const dispatch = useDispatch();
  
  const { building } = useBuilding(buildingId);
  const { status } = useBuildingStatus(buildingId);
  
  if (!building) return <></>;
  
  const freerooms = getNumFreerooms(status);
	const totalrooms = getTotalRooms(status);

  return (
    <MainBox onClick={() => dispatch(setCurrentBuilding(building))}>
      <StyledImage
        alt={`Image of ${buildingId}`}
        src={`/assets/building_photos/${buildingId}.webp`}
        fill={true}
        style={{ objectFit: "cover" }}
        priority={true}
      />
      <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
          {building.name}
        </Typography>
				<StatusBox>
					{freerooms > INITIALISING ? (
						<>
							{freerooms !== FAILED ? (
								<StatusDot
									colour={
										freerooms >= 5 ? "green" : freerooms !== 0 ? "orange" : "red"
									}
								/>
							) : null}
							<Typography sx={{ fontSize: 12, fontWeight: 500, color: "#000000" }}>
								{freerooms !== FAILED
									? `${freerooms} / ${totalrooms}`
									: "? / ?"}
							</Typography>
						</>
					) : (
						<CircularProgress size={20} thickness={5} disableShrink />
					)}
				</StatusBox>
      </TitleBox>
    </MainBox>
  );
};

export default BuildingCardMobile;