import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
} from "react-native";

import StatusIndicator from "./StatusIndicator";

const FakeBuildingCard: React.FC = () => {
  const fakeName = "Flag building";
  const fakeId = "Flag01";

  const fakeRooms = {
    Flag01: {
      status: "free" as "free",
      lastupdated: new Date().toISOString(),
      endtime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  };

  const imgurl = require("../assets/flag_placeholder.webp");

  return (
    <ImageBackground
      source={imgurl}
      imageStyle={{ borderRadius: 15 }}
      style={styles.cardMain}
    >
      <View style={styles.cardOverlay}>
        <Pressable style={styles.pressableCard}>
          <View style={styles.textWrapper}>
            <Text style={styles.card_heading}>{fakeName}</Text>
            <Text style={styles.card_subheading}>{`(${fakeId})`}</Text>
          </View>
          <View style={styles.statusWrapper}>
            <StatusIndicator rooms={fakeRooms} />
          </View>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card_heading: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
    width: "100%",
  },
  card_subheading: {
    color: "white",
    fontSize: 14,
    marginVertical: 4,
    fontWeight: "bold",
    width: "100%",
  },
  cardMain: {
    width: "100%",
    height: 100,
    borderRadius: 15,
    backgroundColor: "orange",
    marginVertical: 10,
  },
  cardOverlay: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  pressableCard: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textWrapper: {
    flex: 0.75,
  },
  statusWrapper: {
    flex: 0.25,
  },
});

export default FakeBuildingCard;
