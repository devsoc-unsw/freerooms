import React, { useEffect, useContext } from 'react';
import { 
	StyleSheet,
	View,
	SafeAreaView,
	ScrollView,
	Pressable, 
} from "react-native";
import type { BuildingStackScreenProps  } from '../types';
import { FreeRoomsAPIContext } from '../../contexts';
import BuildingCard from '../../components/BuildingCard';


import Ionicons from '@expo/vector-icons/Ionicons';

export default function BuildingList({ route, navigation } : BuildingStackScreenProps<"All Buildings">) {

	const handleFilterPress = () => {
		navigation.navigate("Building Filter");
	}
	
	const { buildings, rooms, onRefresh } = useContext(FreeRoomsAPIContext);
	
	useEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable onPress={handleFilterPress} >
					<Ionicons name="filter-outline" size={25} color='white' />
				</Pressable>
			)			
		});
		
	}, [navigation])

	return (
		<SafeAreaView style={ styles.container }>
			<ScrollView style={ styles.scrollView }>
				<View style={ styles.container }>
					<View style={ styles.textContainer }>
					</View>
					{ buildings.map((building, index) =>
						<BuildingCard
							key={index}
							nav={navigation}
							rooms={rooms}
							{...building}
						/> )}
				</View>
			</ScrollView>
		</SafeAreaView>
		
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  scrollView: {
    paddingHorizontal: 10,
		width: '100%',
  },
  main_heading: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  textContainer: {
    flex: 1, 
    padding: 10,
  }
});
