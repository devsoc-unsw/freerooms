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
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
  height: 100,
  borderRadius: 10,
  backgroundColor: "black",
  transition: "all 0.1s ease-in-out",
  padding: 10,
  "&:hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.primary.main,
  },
}));

const StyledImage = styled(Image)<ImageProps>(() => ({
  borderRadius: 10,
  opacity: 0.7,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.5,
  },
}));

const StatusBox = styled(Box)<BoxProps>(() => ({
  display: "flex",
  alignItems: "center",
  borderRadius: 15,
  right: 0,
  backgroundColor: "white",
  padding: 8,
  paddingLeft: 10,
  paddingRight: 10,
  margin: 10,
}));

const TitleBox = styled(Box)<BoxProps>(() => ({
  display: "flex",
  borderRadius: 10,
  width: "100%",
  height: "100%",
  position: "relative",
  alignItems: "center",
  justifyContent: "space-between",
  color: "white",
  padding: 10,
}));

const FakeBuildingCardMobile: React.FC<{}> = () => {
  return (
    <MainBox>
      <StyledImage
        alt="Image of fake building"
        src="/assets/building_photos/flag_placeholder.png"
        fill={true}
        style={{ objectFit: "cover" }}
        priority={true}
      />
      <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: "bold" }}>???</Typography>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="flex-end"
          spacing={0.5}
        >
          <StatusBox>
            <StatusDot colour="green" />
            <Typography
              sx={{ fontSize: 12, fontWeight: 500, color: "#000000" }}
            >
              10 / 10
            </Typography>
          </StatusBox>
          <StatusBox>
            <Stack
              alignItems="center"
              aria-label="star-info"
              direction="row"
              justifyContent="center"
              spacing={0.3}
            >
              <Typography
                sx={{ fontSize: 12, fontWeight: 500, color: "#000000" }}
              >
                6
              </Typography>
              <StarIcon sx={{ fontSize: "1rem", color: "rgb(255, 169, 12)" }} />
            </Stack>
          </StatusBox>
        </Stack>
      </TitleBox>
    </MainBox>
  );
};

export default FakeBuildingCardMobile;
