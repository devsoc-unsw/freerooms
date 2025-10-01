import StarIcon from "@mui/icons-material/Star";
import { Typography, TypographyProps } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import useBuildingRatings from "hooks/useBuildingRatings";
import Image, { ImageProps } from "next/image";
import React from "react";

import useBuilding from "../hooks/useBuilding";
import useBuildingStatus from "../hooks/useBuildingStatus";
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import { getNumFreerooms } from "../utils/utils";
import BuildingRating from "./Rating/BuildingRating";
import StatusDot from "./StatusDot";

const INITIALISING = -2;
const FAILED = -1;

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: 379,
  borderRadius: 12,
  border: `1px solid ${theme.palette.mode === "light" ? theme.palette.primary.light : theme.palette.secondary.main}`,
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: {
    height: 300,
  },
  [theme.breakpoints.down("md")]: {
    height: 200,
  },
}));

const ImageBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  height: 249,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  cursor: "pointer",
  //width: "100%",
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.7,
  },
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 100,
  position: "absolute",
  top: 0,
  right: 0,
  padding: 6,
  paddingLeft: 12,
  paddingRight: 12,
  margin: 10,
  gap: 6,
  pointerEvents: "none",
  backgroundColor: theme.palette.background.default,
}));

const InfoBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderBottomLeftRadius: 12,
  borderBottomRightRadius: 12,
  padding: 12,
  gap: 4,
  //width: "100%",
}));

const InfoFooterBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  paddingTop: 8,
}));

const DetailPill = styled(Box)<BoxProps>(({ theme }) => ({
  borderRadius: 100,
  gap: 6,
  padding: 6,
  paddingLeft: 12,
  paddingRight: 12,
  backgroundColor: `${theme.palette.mode === "light" ? theme.palette.primary.light : theme.palette.primary.dark}`,
}));

const DetailPillText = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontFamily: "TT Commons Pro Trial Variable",
  fontSize: 12,
  fontWeight: 500,
  color: `${theme.palette.mode === "light" ? theme.palette.primary.main : theme.palette.text.primary}`,
  paddingBottom: "2px",
  gap: 10,
}));

// Show only building name and rating for smaller screens
const NameRatingBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
}));

// Location of building - upper or lower
const getLocation = (buildingId: string) => {
  const UPPER = 19;
  return +buildingId.substring(3) < UPPER ? "Lower" : "Upper";
};

const BuildingCard: React.FC<{
  buildingId: string;
}> = ({ buildingId }) => {
  const dispatch = useDispatch();
  const isCompact = useMediaQuery("(max-width:900px)");

  const { building } = useBuilding(buildingId);
  const { status } = useBuildingStatus(buildingId);
  const { ratings } = useBuildingRatings(buildingId);

  if (!building) return <></>;

  const freerooms = getNumFreerooms(status);

  return (
    <MainBox onClick={() => dispatch(setCurrentBuilding(building))}>
      <ImageBox>
        <StyledImage
          alt={`Image of ${buildingId}`}
          src={`/assets/building_photos/${buildingId}.webp`}
          fill={true}
          style={{ objectFit: "cover" }}
          priority={true}
        />
        <StatusBox>
          {freerooms > INITIALISING ? (
            <>
              {freerooms !== FAILED ? (
                <StatusDot
                  colour={
                    freerooms >= 5
                      ? "green"
                      : freerooms !== 0
                        ? "orange"
                        : "red"
                  }
                />
              ) : null}
              <Typography
                sx={{
                  fontFamily: "TT Commons Pro Trial Variable",
                  fontWeight: 600,
                  fontSize: 12,
                  paddingBottom: "2px",
                }}
              >
                {freerooms !== FAILED
                  ? `${freerooms} room${freerooms === 1 ? "" : "s"} available`
                  : "Data Unavailable"}
              </Typography>
            </>
          ) : (
            <CircularProgress size={20} thickness={5} disableShrink />
          )}
        </StatusBox>
      </ImageBox>

      <InfoBox>
        {isCompact ? (
          <NameRatingBox>
            <Typography
              sx={(theme) => ({
                fontFamily: "TT Commons Pro Trial Variable",
                fontWeight: 700,
                fontSize: 15,
                color: theme.palette.mode === "light" ? "#632410" : "#ffffff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              })}
            >
              {building.name}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              gap="1px"
              aria-label="star-info"
            >
              <BuildingRating overallRating={ratings?.overallRating ?? 0} />
            </Stack>
          </NameRatingBox>
        ) : (
          <>
            <Typography
              sx={(theme) => ({
                fontFamily: "TT Commons Pro Trial Variable",
                fontWeight: 700,
                fontSize: 20,
                color: theme.palette.mode === "light" ? "#632410" : "#ffffff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              })}
            >
              {building.name}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              gap="1px"
              aria-label="star-info"
            >
              <BuildingRating overallRating={ratings?.overallRating ?? 0} />
            </Stack>

            <InfoFooterBox>
              <Stack direction="row" gap="8px">
                <DetailPill>
                  <DetailPillText>{buildingId}</DetailPillText>
                </DetailPill>

                <DetailPill>
                  <DetailPillText>{getLocation(buildingId)}</DetailPillText>
                </DetailPill>
              </Stack>

              <Image
                alt="Arrow up right icon"
                src="/assets/icons/arrow-up-right.svg"
                width={24}
                height={24}
                style={{ cursor: "pointer" }}
              />
            </InfoFooterBox>
          </>
        )}
      </InfoBox>
    </MainBox>
  );
};

export default BuildingCard;
