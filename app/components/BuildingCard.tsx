import React, { useState, useEffect, useContext } from 'react';
import { 
	StyleSheet,
	Text,
	View,
	Pressable, 
	ImageBackground,
} from "react-native";

import StatusIndicator from './StatusIndicator';

const BuildingCard = ({ nav, name, id, rooms }) => {

	const handlePress = (name: string, id : string ) => {
		nav.navigate("Building", { buildingName: name , buildingId : id });
	}

	const imgurl = {uri: `https://freerooms.staging.csesoc.unsw.edu.au/_next/image?url=%2Fassets%2Fbuilding_photos%2F${id}.webp&w=1920&q=75`};

	return (
			<ImageBackground source={imgurl} imageStyle={{borderRadius: 15}} style={styles.cardMain}>
				<View style={styles.cardOverlay}>
					<Pressable onPress={() => { handlePress(name, id) }} style={({ pressed }) => [
            styles.pressableCard,
            pressed ? { backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 15 } : {},
          ]}>
						<View style={styles.textWrapper}>
							<Text style={styles.card_heading}>
								{ `${name}`}
							</Text>
							<Text style={styles.card_subheading}>
								{ `(${id})`}
							</Text>
						</View>
						<View style={styles.statusWrapper}>
							<StatusIndicator rooms={rooms[id]}/>
						</View>
					</Pressable>
				</View>
			</ImageBackground>
	);
}


const styles = StyleSheet.create({
    card_heading: {
      color:'white',
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 4,
      width: '100%',
    },
    card_subheading: {
      color:'white',
      fontSize: 14,
      marginVertical: 4,
      fontWeight: 'bold',
      width: '100%',
    },
    cardMain: {
      width: '100%',
      height: 100,
      borderRadius: 15,
      backgroundColor: 'orange',
      marginVertical: 10,
    },
    cardOverlay: {
      width: '100%',
      height: '100%',
      borderRadius: 15,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    pressableCard: {
      width: '100%',
      height: '100%',
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
    }
  });

  export default BuildingCard;
  