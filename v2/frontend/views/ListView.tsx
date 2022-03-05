import React from "react";
import {
  AppShell,
  Button,
  Header,
  Navbar,
  SegmentedControl,
  Tabs,
  Text,
} from "@mantine/core";

import Branding from "../components/Branding";

const ListView = () => {
  const [selection, setSelection] = React.useState<string>("upper");

  return (
    <AppShell
      header={
        <Header height={80} padding="xs">
          <Branding />
        </Header>
      }
      navbar={
        <Navbar padding="md" width={{ base: 300 }}>
          <Navbar.Section grow>
            <SegmentedControl
              value={selection}
              onChange={setSelection}
              color="orange"
              fullWidth
              orientation="vertical"
              size="md"
              radius="md"
              data={[
                { label: "Upper Campus", value: "upper" },
                { label: "Lower Campus", value: "lower" },
              ]}
              styles={{
                label: { padding: 15 },
                root: { backgroundColor: "transparent" },
              }}
            />
          </Navbar.Section>
        </Navbar>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {selection === "upper" ? (
        <Text>Todo: load upper campus buildings</Text>
      ) : (
        <Text>Todo: load lower campus buildings</Text>
      )}
    </AppShell>
  );
};

export default ListView;
