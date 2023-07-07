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
				<View style={[styles.container, {paddingBottom: 20} ]}>
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

	const date = new Date(endtime);
    const hoursMinutes = date.toLocaleTimeString("en-AU", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

	const roomStatusColor = {
		free: "#2AA300",
		busy: "#D30000",
		soon: "#ffa600",
	};

	const roomStatusMessage = {
		free: "Available",
		busy: "Unavailable",
		soon: "Available soon at " + hoursMinutes,
	};

	return (

		<Pressable onPress={handlePress} style={({ pressed }) => [
			styles.roomButton,
			pressed ? { backgroundColor: '#f5f5f5', shadowRadius: 2, } : {},
		]}>
			<View>
				<Text style={styles.subHeading}>
					{ roomName }
				</Text>
			</View>
			<View style={styles.textContainer}>
				<Text style={{
					paddingRight: 5,
					paddingTop: 3.5,
					fontSize: 17,
					fontWeight: '600',
					color: roomStatusColor[status],
				}}>
					{roomStatusMessage[status]}
				</Text>
				<Ionicons name="chevron-forward-outline" size={25} color='grey' />
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
    paddingTop: 13,
    width: '100%',
    paddingHorizontal: 13,
  },
  main_heading: {
	color: 'white',
	fontWeight: '600',
	fontSize: 18,
  },
  subHeading: {
	fontSize: 18,
	fontWeight: 'bold',
  },
  textContainer: {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-around',
  },
  roomButton: {
	width: '100%',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	paddingHorizontal: 20,
	paddingVertical: 18,
	borderRadius: 15,
	backgroundColor: 'white',
	marginVertical: 8,
	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 2,
	},
	shadowOpacity: 0.25,
	shadowRadius: 5,
  },
});
