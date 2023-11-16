import {
  ActivityIndicator,
  Pressable,
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
  roomName: string;
  roomId: string;
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

  const roomType = {
    AUD: "Auditorium",
    CMLB: "Computer Lab",
    LAB: "Lab",
    LCTR: "Lecture Hall",
    MEET: "Meeting Room",
    SDIO: "Studio",
    TUSM: "Tutorial Room",
  };

  const date = new Date(routeParams?.status.endtime);
  const untilTime = date.toLocaleTimeString("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    setRouteParams(route.params);
    setNav(navigation);
    setSingleRoomInfo(roomInfo.rooms[route.params.roomId]);
  }, [route, navigation]);

  async function seeBookings() {
    nav?.navigate("Timetable", { roomId: routeParams.roomId });
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
          shadowColor: "#a6a1a1",
          shadowRadius: 1,
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 1,
        }}
      >
        <Text style={styles.avaliableText}>
          {routeParams?.status.status == "free" ? "AVAILABLE" : "UNAVAILABLE"}
        </Text>
      </View>
      {untilTime !== "Invalid Date" && (
        <Text style={{ alignSelf: "center", fontSize: 18, marginTop: 10 }}>
          {"until " + untilTime}
        </Text>
      )}
      <View style={styles.mainInfoContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.mediumText}> Room Type: </Text>
          <Text style={styles.infoText}>{roomType[singleRoomInfo.usage]}</Text>
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
      <Pressable style={styles.button} onPress={seeBookings}>
        <Text style={styles.buttonText}>TIMETABLE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
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
    marginTop: 20,
    marginBottom: 5,
    width: "100%",
  },
  mainInfoContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#ebe8e4",
    borderRadius: 15,
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 30,
    paddingVertical: 10,
    shadowColor: "#a6a1a1",
    shadowOffset: {
      height: 3,
      width: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.3,
  },
  infoContainer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    paddingLeft: 20,
  },
  largeText: {
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
  },
  infoText: {
    fontSize: 24,
    fontWeight: "600",
  },
  mediumText: { color: "grey", fontSize: 20, fontWeight: "600" },
  avaliableText: {
    alignSelf: "center",
    fontSize: 16,
    letterSpacing: 1,
  },
  button: {
    alignSelf: "center",
    backgroundColor: "#fab561",
    borderColor: "#faae52",
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    shadowColor: "#b89b77",
    shadowRadius: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 1,
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
