import StarIcon from "@mui/icons-material/Star";
import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Image, { ImageProps } from "next/image";
import React from "react";

import StatusDot from "./StatusDot";

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: theme.palette.primary.main,
  height: 385,
  borderRadius: 10,
  "&:hover": {
    cursor: "pointer",
  },
  [theme.breakpoints.down("lg")]: {
    height: 300,
  },
  [theme.breakpoints.down("md")]: {
    height: 200,
  },
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: 10,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.7,
  },
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 15,
  position: "absolute",
  top: 0,
  right: 0,
  padding: 10,
  paddingLeft: 15,
  paddingRight: 15,
  margin: 10,
  pointerEvents: "none",
  backgroundColor: theme.palette.background.default,
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

const FakeBuildingCard: React.FC<{}> = () => {
  return (
    <MainBox>
      <StyledImage
        alt="Image of fake building"
        src="/assets/building_photos/flag_placeholder.webp"
        fill={true}
        style={{ objectFit: "cover" }}
        priority={true}
      />
      <StatusBox>
        <StatusDot colour="green" />
        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
          10 rooms available
        </Typography>
      </StatusBox>
      <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          Flag Building
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.3}
          aria-label="star-info"
        >
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>5</Typography>
          <StarIcon sx={{ color: "rgb(255, 169, 12)" }} />
        </Stack>
      </TitleBox>
    </MainBox>
  );
};

export default FakeBuildingCard;
