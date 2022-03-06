import { Grid } from "@mantine/core";
import BuildingCard from "../components/BuildingCard";

// TODO: fetch buildings from backend and render cards based on result

const UpperBuildings = () => (
  <Grid gutter="lg">
    <Grid.Col md={6} lg={3}>
      <BuildingCard
        name="Test 123"
        freerooms={3}
        image="/assets/building_photos/K-B16.png"
      />
    </Grid.Col>
    <Grid.Col md={6} lg={3}>
      <BuildingCard
        name="Test 123"
        freerooms={7}
        image="/assets/building_photos/K-B16.png"
      />
    </Grid.Col>
    <Grid.Col md={6} lg={3}>
      <BuildingCard
        name="Test 123"
        freerooms={0}
        image="/assets/building_photos/K-B16.png"
      />
    </Grid.Col>
    <Grid.Col md={6} lg={3}>
      <BuildingCard
        name="Test 123"
        freerooms={0}
        image="/assets/building_photos/K-B16.png"
      />
    </Grid.Col>
  </Grid>
);

export default UpperBuildings;
