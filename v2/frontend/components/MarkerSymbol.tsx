import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { shadows } from '@mui/system';
import Image, { ImageProps } from "next/image";
import React from "react";

import { Building } from "../types";

const MarkerSymbol: React.FC<{ building: Building, freerooms: number }> = ({
                                                                        building, freerooms
                                                                        }) => {
  
  const [showPopup, setShowPopup] = React.useState(false);

  return (
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <Typography sx={{ fontSize: 10, fontWeight: 500 }}>
          {building.name}
        </Typography>
        <Box
          sx={(theme) => ({
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "4px solid white",
            backgroundColor:
              freerooms >= 5
                ? theme.palette.success.light
                : freerooms !==0
                  ? theme.palette.warning.light
                  : theme.palette.error.light,
          })}
        />
        { showPopup && (
        <div style={{ position: 'absolute', bottom: 5 }}>
          <MarkerHover building={building} freerooms={freerooms}/> 
        </div>
        )}
      </div>
  );
};

const MarkerHover: React.FC<{ building: Building, freerooms: number }> = ({ building, freerooms }) => {
  const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
    position: "absolute",
    flex: 1,
    backgroundColor: theme.palette.primary.main,
    height: 200,
    width: 300,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: '2px 2px 9px black',
  }));

  const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
    objectFit: "cover",
    
  }));

  const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    padding: 6,
    paddingLeft: 12,
    paddingRight: 12,
    margin: 10,
    pointerEvents: "none",
  }));

  const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
    display: "flex",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
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
      <StatusBox>
        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
          {`${freerooms} room${freerooms === 1 ? "" : "s"} available`}
        </Typography>
      </StatusBox>
      <TitleBox>
        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
          {building.name}
        </Typography>
      </TitleBox>
    </MainBox>
  );

};


export default MarkerSymbol;