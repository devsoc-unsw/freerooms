import React, { useState, useEffect, useContext } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	StatusBar,
	ScrollView,
	Pressable,
	Button,
} from "react-native";

import type { BuildingStackScreenProps } from '../types';
import { FreeRoomsAPIContext } from '../../contexts';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function Building({ route, navigation } : BuildingStackScreenProps<"Building"> ) {

	const handleFilterPress = () => {
		navigation.navigate("Room Filter");
	}

	const { rooms, onRefresh } = useContext(FreeRoomsAPIContext);
	const roomsOfCurrBuilding = rooms[route.params.buildingId];


	useEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<Text style={ styles.main_heading }>
					{route.params.buildingName}
				</Text>
			),
			headerRight: () => (
				<Pressable onPress={handleFilterPress} >
					<Ionicons name="filter-outline" size={25} color='white' />
				</Pressable>
			)
		})
	}, [navigation])

	return (
		<SafeAreaView style={ styles.container }>
			<ScrollView style={ styles.scrollView }>
				<View style={ styles.container }>
					{ Object.keys(roomsOfCurrBuilding).map( (roomId, index) => <Card key={index} nav={navigation} roomName={roomId} {...roomsOfCurrBuilding[roomId]} /> )}
				</View>
			</ScrollView>
		</SafeAreaView>

	)
}

function Card({ nav, roomName, status, endtime }) {

	const handlePress = () => {
		nav.navigate("Room");
	}

	return (

		<Pressable onPress={handlePress} style={{ width: '100%'}} >
			<View style={styles.textContainer}>
				<View style={{
				}}>
					<Text style={styles.subHeading}>
						{ roomName }
					</Text>
				</View>
				<View style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
				}}>
					<Text style={{
						paddingRight: 10,
						paddingTop: 2,
						fontSize: 18,
						fontWeight: '600',
						color: status === "free"
							? "#66bb6a"
							: status === "busy" && endtime != ""
								? "#ffa726"
								: "#f44336"
					}}>
						{ status === "free"
							? "Available"
							: status === "busy" && endtime != ""
								? `Available at ${endtime}`
								: "Unavailable" }
					</Text>
					<Ionicons name="chevron-forward-outline" size={25} color='grey' />
				</View>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scrollView: {
    paddingTop: 20,
    width: '100%',
    paddingHorizontal: 13,
  },
  main_heading: {
	color: 'white',
	fontWeight: '600',
	fontSize: 18,
  },
  subHeading: {
	paddingTop: 0,
	fontSize: 18,
	fontWeight: 'bold',
  },
  textBody: {
    fontSize: 10,
  },
  textContainer: {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingHorizontal: 20,
	paddingVertical: 18,
	borderRadius: 15,
	backgroundColor: 'white',
	marginVertical: 10,
	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 2,
	},
	shadowOpacity: 0.25,
	shadowRadius: 5,
	elevation: 5,
  },
});
