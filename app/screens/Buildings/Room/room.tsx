import { Button, Image, StyleSheet, Text, View } from "react-native";

import { Calendar } from "react-native-calendars";
import React, { useEffect, useState } from "react";

import type { BuildingStackScreenProps } from "../../types";

interface RouteParams {
  roomName: string;
  status: string;
  buildingId: string;
}

export default function Room({
  route,
  navigation,
}: BuildingStackScreenProps<"Room">) {
  const [routeParams, setRouteParams] = useState<RouteParams>(null);
  const [nav, setNav] = useState(null);
  useEffect(() => {
    setRouteParams(route.params);
    setNav(navigation);
  }, [route, navigation]);

  async function seeBookings() {
    const roomId = routeParams.buildingId + "-" + routeParams.roomName;
    console.log(roomId);
    nav?.navigate("Agenda", { roomName: roomId });
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
            routeParams?.status == "free" ? "#50C878" : "#FF4141",
          borderRadius: 30,
          height: 45,
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text style={styles.avaliableText}>
          {routeParams?.status == "free" ? "FREE" : "OCCUPIED"}
        </Text>
      </View>
      <RoomInfo></RoomInfo>
      <Button title={"SEE BOOKINGS"} onPress={seeBookings}></Button>
    </View>
  );
}

const RoomInfo = () => {
  return (
    <View style={{ paddingVertical: 15 }}>
      <View style={styles.infoContainer}>
        <Text style={styles.mediumText}> Room Type: </Text>
        <Text style={styles.infoText}> {`Computer Lab`} </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.mediumText}> Capacity: </Text>
        <Text style={styles.infoText}> {`\t10`} </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.mediumText}> Room Alias: </Text>
        <Text style={styles.infoText}> {`StringsME3`} </Text>
      </View>
    </View>
  );
};

const CalendarDay = () => {
  const [selected, setSelected] = useState("");
  return (
    <Calendar
      onDayPress={(day) => {
        setSelected(day.dateString);
        console.log(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedColor: "orange",
        },
      }}
    />
  );
};

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
});
