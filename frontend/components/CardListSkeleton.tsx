import BuildingCardSkeleton from "./BuildingCardSkeleton";
import { styled } from "@mui/material/styles";

const Grid = styled("div")({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gridGap: "20px",
});

const NUM_BUILDINGS = 44
export default function CardListSkeleton() {
  return (
    <Grid>
      {Array.from({length: NUM_BUILDINGS}, (_, i) => (
        <BuildingCardSkeleton key={i}/>
      ))}
    </Grid> 
  )
}
