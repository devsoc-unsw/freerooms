import { Image, StyleSheet, Text, View } from "react-native";

import type { BuildingStackScreenProps } from "../../types";
import { getBookings } from "../../../services/freerooms_api/endpoints";
import { useEffect } from "react";
import { useRoute } from "@react-navigation/native";

export default function Room({
  route,
  navigation,
}: BuildingStackScreenProps<"Room">) {
  // ! route.params are undefined (issue with nested navigators)

  let roomName;

  async function fetchBooking() {
    const res = await getBookings("K-J17-G01");
    roomName = res.name;
  }

  useEffect(() => {
    fetchBooking();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.roomImage}
        source={require("../../../assets/placeholder-room.png")}
      ></Image>
      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
          CATS -{" "}
          <Text style={{ color: "orange", fontSize: 15, fontWeight: "bold" }}>
            ID Required
          </Text>
        </Text>
        <Text style={styles.largeText}>{roomName}</Text>
      </View>
      <View
        style={{ justifyContent: "flex-start", paddingTop: 20, width: "100%" }}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.mediumText}> Room ID: </Text>
          <Text style={styles.largeText}> {`\tK-J17-302`} </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.mediumText}> Type: </Text>
          <Text style={styles.largeText}> {`\t\tComputer Lab`} </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.mediumText}> Alias: </Text>
          <Text style={styles.largeText}> {`\t\tStringsME3`} </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
  },
  roomImage: {
    height: "40%",
    width: "100%",
  },
  titleContainer: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
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
    fontSize: 28,
    fontWeight: "600",
  },
  mediumText: { color: "grey", fontSize: 20, fontWeight: "600" },
});
