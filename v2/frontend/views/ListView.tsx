import React from "react";
import {
  ActionIcon,
  AppShell,
  Container,
  Grid,
  Group,
  Header,
  Navbar,
  SegmentedControl,
  Tabs,
  Text,
} from "@mantine/core";
import { createStyles } from "@mantine/core";
import { IoSearch } from "react-icons/io5";

import Branding from "../components/Branding";
import Button from "../components/Button";
import BuildingCard from "../components/BuildingCard";
import UpperBuildings from "./UpperBuildings";

const useStyles = createStyles((theme) => ({
  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    // Dynamic media queries, define breakpoints in theme, use anywhere
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {},
  },
  buttonContainer: {
    flex: 1,
  },
}));

const ListView = () => {
  const { classes } = useStyles();
  const [selection, setSelection] = React.useState<string>("upper");

  const ButtonGroup = () => (
    <Group position="right" className={classes.buttonContainer} spacing="xs">
      <Button>
        <IoSearch size={20} />
      </Button>
      <Button>Map</Button>
    </Group>
  );

  return (
    <AppShell
      header={
        <Header height={80} padding="xs" className={classes.headerContainer}>
          <Branding />
          <SegmentedControl
            value={selection}
            onChange={setSelection}
            color="orange"
            size="md"
            radius="md"
            data={[
              { label: "Upper Campus", value: "upper" },
              { label: "Lower Campus", value: "lower" },
            ]}
            styles={{
              label: { padding: 10 },
              root: { flex: 1 },
            }}
          />
          <ButtonGroup />
        </Header>
      }
    >
      <Container fluid>
        {selection === "upper" ? (
          <UpperBuildings />
        ) : (
          <Text>Todo: load lower campus buildings</Text>
        )}
      </Container>
    </AppShell>
  );
};

export default ListView;
