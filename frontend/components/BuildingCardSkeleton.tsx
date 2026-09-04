import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: 379,
  borderRadius: 12,
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: {
    height: 300,
  },
  [theme.breakpoints.down("md")]: {
    height: 200,
  },
  cursor: "pointer",
}));

export default function BuildingCardSkeleton() {
  return (

    <MainBox>
      <Skeleton animation="wave" variant="rounded" height={250} />
      <Stack sx={{gap:1, pt:1, flex: 1}}>
        <Skeleton animation="wave" variant="text" width="25%" sx={{ fontSize: 25}}/>
        <Skeleton animation="wave" variant="text" width="30%" sx={{ fontSize: 15}}/>
        <Stack direction="row" sx={{justifyContent: "space-between"}}>
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
