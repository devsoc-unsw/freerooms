import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Box, { BoxProps } from "@mui/material/Box";
import { useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: 379,
  borderRadius: 12,
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: { height: 300 },
  [theme.breakpoints.down("md")]: { height: 200 },
  [theme.breakpoints.down("sm")]: { height: 100 },
  cursor: "pointer",
}));

export default function BuildingCardSkeleton() {
  

  return (

    <MainBox>
      <Skeleton animation="wave" variant="rounded" height={249} />
      <Stack sx={{gap:1, pt:1, display: { xs: "none", sm: "flex"} }}>
        <Skeleton animation="wave" variant="text" width="25%" sx={{ fontSize: 25}}/>
        <Skeleton animation="wave" variant="text" width="30%" sx={{ fontSize: 15}}/>
        <Stack direction="row" sx={{justifyContent: "space-between", display: {xs: "none", md:"flex"}}}>
          <Stack direction="row" sx={{ gap: 1, pt:1 }}>
            <Skeleton animation="wave" variant="rounded" width={64} height={30}/>
            <Skeleton animation="wave" variant="rounded" width={64} height={30}/>
          </Stack>
          <Skeleton animation="wave" variant="rounded" width={32} height={30} sx={{pt:1}}/>
        </Stack>   
      </Stack>
    </MainBox>
  )
}
