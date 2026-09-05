import Skeleton from '@mui/material/Skeleton';

const NUM_ROOM_SKELETON_DISPLAY = 5 

export default function AllRoomsRoomListSkeleton() {
  return (
    <>
      {Array.from({ length: NUM_ROOM_SKELETON_DISPLAY }, (_, i) => (
        <Skeleton key={i} animation="wave" variant="rounded" height="72px" width="100%" sx={{marginTop: "8px"}}/>
      ))}
    </>
  )
}
