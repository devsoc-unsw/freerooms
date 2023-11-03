import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";

import type { BuildingStackScreenProps } from "../types";
import { FreeRoomsAPIContext } from "../../contexts";
import RoomCard from "../../components/RoomCard";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function Building({
  route,
  navigation,
}: BuildingStackScreenProps<"Building">) {
  const handleFilterPress = () => {
    navigation.navigate("Room Filter");
  };

  const { rooms, onRefresh, roomInfo } = useContext(FreeRoomsAPIContext);
  const roomsOfCurrBuilding = rooms[route.params.buildingId];
  console.log(roomInfo.rooms["K-G27-G04"].name);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={styles.main_heading}>{route.params.buildingName}</Text>
      ),
      headerRight: () => (
        <Pressable onPress={handleFilterPress}>
          <Ionicons name="filter-outline" size={25} color="white" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.container, { paddingBottom: 20 }]}>
          {Object.keys(roomsOfCurrBuilding).map((roomNumber, index) => (
            
            <RoomCard
              key={index}
              nav={navigation}
              roomNumber={roomNumber}
              roomName={
                roomInfo.rooms[`${route.params.buildingId}-${roomNumber}`].name
              }
              status={roomsOfCurrBuilding[roomNumber]}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  scrollView: {
    paddingTop: 13,
    width: "100%",
    paddingHorizontal: 13,
  },
  main_heading: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});
