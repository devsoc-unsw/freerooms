import Image from "next/image";
import Logo from "../public/assets/favicon/free_rooms_logo.png";
import { Box, Text } from "@mantine/core";

const Branding = () => (
  <Box
    style={{
      display: "flex",
      alignItems: "center",
      flex: 1,
    }}
  >
    <div style={{ width: 50, marginLeft: 10, marginRight: 5 }}>
      <Image src={Logo} alt="Freerooms Logo" priority />
    </div>
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text size="md" weight={700} color="#D3613A" sx={{ lineHeight: 1 }}>
        Freerooms
      </Text>
      <Text
        size="sm"
        weight={500}
        color="#D3613A"
        sx={{ lineHeight: 1, marginTop: 5 }}
      >
        22T1
      </Text>
    </Box>
  </Box>
);

export default Branding;
