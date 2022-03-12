import Image, { ImageProps } from "next/image";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import StatusDot from "./StatusDot";
import { Typography } from "@mui/material";

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: theme.palette.primary.main,
  height: 385,
  borderRadius: 10,
  "&:hover": {
    cursor: "pointer",
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
  backgroundColor: "white",
  padding: 10,
  paddingLeft: 15,
  paddingRight: 15,
  margin: 10,
  pointerEvents: "none",
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
  position: "absolute",
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

const BuildingCard: React.FC<{
  name: string;
  freerooms: number;
  image: string;
  onClick: () => void;
}> = ({ name, freerooms, image, onClick }) => {
  return (
    <MainBox onClick={onClick}>
      <StyledImage src={image} layout="fill" objectFit="cover" />
      <StatusBox>
        <StatusDot
          colour={freerooms >= 5 ? "green" : freerooms !== 0 ? "orange" : "red"}
        />
        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
          {freerooms} rooms available
        </Typography>
      </StatusBox>
      <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>{name}</Typography>
      </TitleBox>
    </MainBox>
  );
};

export default BuildingCard;
