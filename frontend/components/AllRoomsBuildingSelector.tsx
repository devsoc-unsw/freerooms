import { styled } from "@mui/system";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentBuilding } from "redux/currentBuildingSlice";

import AllRoomsBuildingModal from "./AllRoomsBuildingModal";

const AllRoomsBuildingSelector = () => {
  const [open, setOpen] = useState(false);
  const currentBuilding = useSelector(selectCurrentBuilding);

  return (
    <>
      <StyledSelector
        onClick={() => setOpen(true)}
        buildingId={currentBuilding?.id}
      >
        {currentBuilding ? currentBuilding.name : "Select Building"}
      </StyledSelector>
      <AllRoomsBuildingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

const StyledSelector = styled("div")<{ buildingId?: string }>(
  ({ theme, buildingId }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.primary.default,
    fontSize: "18px",
    fontWeight: buildingId ? "bold" : "normal",
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: "10px",
    marginTop: "20px",
    padding: "20px 0",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: buildingId
        ? `url(/assets/building_photos/${buildingId}.webp)`
        : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      opacity: 0.4,
      zIndex: -1,
    },
  })
);

export default AllRoomsBuildingSelector;
