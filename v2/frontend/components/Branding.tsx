import Image from "next/image";
import Logo from "../public/assets/favicon/free_rooms_logo.png";
import { Text } from "@mantine/core";

const Branding = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      paddingBottom: "1rem",
    }}
  >
    <div style={{ width: 50, marginLeft: 10, marginRight: 5 }}>
      <Image src={Logo} alt="Freerooms Logo" priority />
    </div>
    <div
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
    </div>
  </div>
);

export default Branding;
