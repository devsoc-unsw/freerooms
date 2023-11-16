import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  View,
} from "react-native";

import React, { useContext, useEffect, useState } from "react";

import type { BuildingStackScreenProps } from "../../types";
import { Room, RoomStatus } from "@common/types";
import { FreeRoomsAPIContext } from "../../../contexts";

interface RouteParams {
  buildingId?: string;
  roomId?: string;
  roomName: string;
  roomNumber: string;
  status?: RoomStatus;
}

export default function SingleRoom({
  route,
  navigation,
}: BuildingStackScreenProps<"Room">) {
  const [routeParams, setRouteParams] = useState<RouteParams>(null);
  const [nav, setNav] = useState(null);

  const { roomInfo } = useContext(FreeRoomsAPIContext);
  const [singleRoomInfo, setSingleRoomInfo] = useState<Room>();

  useEffect(() => {
    setRouteParams(route.params);
    setNav(navigation);
    setSingleRoomInfo(roomInfo.rooms[route.params.roomNumber]);
  }, [route, navigation]);

  async function seeBookings() {
    nav?.navigate("Agenda", { roomName: routeParams.roomName });
  }

  if (!singleRoomInfo) {
    return (
      <View style={[styles.loadingContainer, styles.loadingHorizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.largeText}>{routeParams?.roomName}</Text>
      </View>
      <View
        style={{
          alignSelf: "center",
          backgroundColor:
            routeParams?.status.status == "free" ? "#50C878" : "#FF4141",
          borderRadius: 30,
          height: 45,
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text style={styles.avaliableText}>
          {routeParams?.status.status == "free" ? "FREE" : "OCCUPIED"}
        </Text>
      </View>
      <View style={{ paddingVertical: 15 }}>
        <View style={styles.infoContainer}>
          <Text style={styles.mediumText}> Room Type: </Text>
          <Text style={styles.infoText}>{singleRoomInfo.usage}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.mediumText}> Capacity: </Text>
          <Text style={styles.infoText}>{singleRoomInfo.capacity}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.mediumText}> Room Alias: </Text>
          <Text style={styles.infoText}>{singleRoomInfo.abbr}</Text>
        </View>
      </View>
      <Button title={"SEE BOOKINGS"} onPress={seeBookings}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    width: "100%",
  },
  roomImage: {
    height: "40%",
    width: "100%",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,
    paddingTop: 20,
    width: "100%",
  },
  infoContainer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
  largeText: {
    fontSize: 36,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 24,
    fontWeight: "600",
  },
  mediumText: { color: "grey", fontSize: 20, fontWeight: "600" },
  avaliableText: {
    alignSelf: "center",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  loadingHorizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
