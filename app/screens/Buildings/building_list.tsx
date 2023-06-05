import React, { useState, useEffect, useContext } from 'react';
import { 
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	Pressable, 
	Button,
} from "react-native";
import type { BuildingStackScreenProps  } from '../types';
import { FreeRoomsAPIContext } from '../../contexts';

export default function BuildingList({ route, navigation } : BuildingStackScreenProps<"All Buildings">) {

	const handleFilterPress = () => {
		navigation.navigate("Building Filter");
	}
	
	
	const { buildings, rooms, onRefresh } = useContext(FreeRoomsAPIContext);
	
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Button onPress={handleFilterPress} title="Filter Buildings" />
			)			
		});
		
	}, [navigation])

	return (
		<SafeAreaView style={ styles.container }>
			<ScrollView style={ styles.scrollView }>
				<View style={ styles.container }>
					<Text style={ styles.main_heading }>Buildings at UNSW</Text>
					<View style={ styles.textContainer }>
						<Text style={{ paddingBottom: 10, }}>
							Scroll and click on a Building Card!
						</Text>
					</View>
					{ buildings.map((building, index) => <Card key={index} nav={navigation} {...building} /> )}
				</View>
			</ScrollView>
		</SafeAreaView>
		
	)
}

function Card({ nav, name, id }) {
	
	const handlePress = (name: string, id : string ) => {
		nav.navigate("Building", { buildingName: name , buildingId : id });
	}
	
	return (
		
			<View style={{
					width: '100%',
					height: 100,
					alignItems: 'flex-start',
					paddingHorizontal: 10,
					paddingVertical: 20,
					borderWidth: 1,
					borderRadius: 10,
					borderColor: 'lightgray',
					backgroundColor: 'orange',
					marginVertical: 10,
			}}>
				<Pressable onPress={() => { handlePress(name, id) }} style={styles.pressableCard}>
					<Text style={styles.subHeading}>
						{ `${name} (${id})`}
					</Text>
				</Pressable>
			</View>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  scrollView: {
    paddingTop: 20,
    paddingHorizontal: 10,
		width: '100%',
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
    width: '100%',

  },
  textBody: {
    fontSize: 10,
  },
  textContainer: {
    flex: 1, 
    padding: 10,
  },
  pressableCard: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  }
});
