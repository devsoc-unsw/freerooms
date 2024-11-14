import { Box, Fade, Modal, Stack, Typography } from "@mui/material";
import { BoxProps, styled } from "@mui/system";
import useBuildings from "hooks/useBuildings";
import Image, { ImageProps } from "next/image";
import FlipMove from "react-flip-move";
import { useDispatch } from "react-redux";
import { setAllRoomsFilter } from "redux/allRoomsFilterSlice";
import { setCurrentBuilding } from "redux/currentBuildingSlice";

interface AllRoomsBuildingModalProps {
  open: boolean;
  onClose: () => void;
}

const AllRoomsBuildingModal = ({
  open,
  onClose,
}: AllRoomsBuildingModalProps) => {
  const { buildings } = useBuildings();

  const dispatch = useDispatch();

  return (
    <StyledModal disableAutoFocus={true} open={open} onClose={onClose}>
      <Fade in={open}>
        <StyledBox>
          <Typography variant="h6">Search by building name</Typography>
          <StyledGridBox>
            <FlipMoveGrid>
              {buildings?.map((building) => (
                <MainBox
                  key={building.id}
                  onClick={() => {
                    dispatch(setCurrentBuilding(building));
                    dispatch(
                      setAllRoomsFilter({
                        key: "buildingId",
                        value: building.id,
                      })
                    );
                    onClose();
                  }}
                >
                  <StyledImage
                    alt={`Image of ${building.id}`}
                    src={`/assets/building_photos/${building.id}.webp`}
                    fill={true}
                    style={{ objectFit: "cover" }}
                    priority={true}
                  />
                  <TitleBox>
                    <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
                      {building.name}
                    </Typography>
                  </TitleBox>
                </MainBox>
              ))}
            </FlipMoveGrid>
          </StyledGridBox>
        </StyledBox>
      </Fade>
    </StyledModal>
  );
};

const FlipMoveGrid = styled(FlipMove)(() => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gridGap: "20px",
}));

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  height: 200,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 10,
  "&:hover": {
    cursor: "pointer",
  },
  [theme.breakpoints.down("lg")]: {
    height: 100,
  },
  [theme.breakpoints.down("md")]: {
    height: 50,
  },
}));

const StyledImage = styled(Image)<ImageProps>(() => ({
  borderRadius: 10,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.7,
  },
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
  position: "absolute",
  justifyContent: "space-between",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: 15,
  paddingLeft: 20,
  paddingRight: 20,
  margin: 10,
  pointerEvents: "none",
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  maxWidth: "70svw",
  maxHeight: "70svh",
  overflow: "auto",
  margin: "auto",
}));

const StyledBox = styled(Box)({
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "10px",
});

const StyledGridBox = styled(Box)({
  marginTop: "15px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

export default AllRoomsBuildingModal;
