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



export default function Building({ route, navigation } : BuildingStackScreenProps<"Building"> ) {

	const handleFilterPress = () => {
		navigation.navigate("Room Filter");
	}
	
	const { rooms, onRefresh } = useContext(FreeRoomsAPIContext);
	const roomsOfCurrBuilding = rooms[route.params.buildingId];
	

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button onPress={handleFilterPress} title="Filter Rooms" />
			)
		})
	}, [navigation])

	return (
		<SafeAreaView style={ styles.container }>
			<ScrollView style={ styles.scrollView }>
				<View style={ styles.container }>
					<Text style={ styles.main_heading }>{`${route.params.buildingName} (${route.params.buildingId})`}</Text>
					<View style={ styles.textContainer }>
						<Text style={{ paddingBottom: 10, }}>
							Rooms
						</Text>
					</View>
					{ Object.keys(roomsOfCurrBuilding).map( (roomId, index) => <Card key={index} nav={navigation} roomName={roomId} building={route.params.buildingId} {...roomsOfCurrBuilding[roomId]} /> )}
				</View>
			</ScrollView>
		</SafeAreaView>
		
	)
}

function Card({ nav, roomName, status, endtime, building }) {
	
	const handlePress = () => {
		console.log(building);
		nav.navigate("Room", {roomName: roomName, status: status, buildingId: building});
	}
	
	return (
		
			<View style={{
					width: '100%',
					alignItems: 'flex-start',
					padding: 10,
					borderWidth: 1,
					borderRadius: 10,
					borderColor: 'lightgray',
					backgroundColor: 'orange',
					marginVertical: 10,
			}}>
				<Pressable onPress={handlePress} style={{ width: '100%'}} >
					<Text style={styles.subHeading}>
						{ roomName }
					</Text>
					<Text style={styles.textBody}>
						{ `Current Status: ${status}` }{ status == "busy" && endtime != "" ? ` until ${endtime}` : null }
					</Text>
				</Pressable>
			</View>
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
    paddingHorizontal: 10,
  },
  main_heading: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  textBody: {
    fontSize: 10,
  },
  textContainer: {
    flex: 1, 
    padding: 10, 
  },
});
