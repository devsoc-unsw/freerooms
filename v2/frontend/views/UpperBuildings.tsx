import Grid from "@mui/material/Grid";
import BuildingCard from "../components/BuildingCard";

// TODO: fetch buildings from backend and render cards based on result

const UpperBuildings: React.FC<{
  setCurrentBuilding: (building: string) => void;
}> = ({ setCurrentBuilding }) => (
  <div
    style={{
      width: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gridGap: "20px",
    }}
  >
    {[0, 1, 2, 3].map((i) => (
      <BuildingCard
        name={`Test ${i}`}
        freerooms={3}
        image="/assets/building_photos/K-B16.png"
        onClick={() => setCurrentBuilding(`Test ${i}`)}
      />
    ))}
  </div>
);

export default UpperBuildings;
