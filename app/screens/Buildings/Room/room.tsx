import { 
	StyleSheet,
	Text,
	View,
} from "react-native";

import {Calendar, LocaleConfig, Agenda, AgendaList} from 'react-native-calendars';
import React, {useState} from 'react';
import AgendaScreen from "./agenda";

import { FlatList } from "react-native";
import type { BuildingStackScreenProps } from "../../types";
import { TabRouter } from "@react-navigation/native";



export default function Room({ route, navigation } : BuildingStackScreenProps<"Room"> ) {
	console.log(route);
	return (
		<AgendaScreen/>

		// <View style={ styles.container }>
		// 	<Text style={ styles.main_heading }>{route.params.roomName}</Text>
		// 	<Text style={styles.avaliable}> {route.params.status == "free" ? "Available" : "Unvailable"} </Text>
		// 	<Elements></Elements>
		// 	<CalendarDay/>

		// </View>
	);
}

const Elements = () => {
	return (

		<View style={styles.header}>
					
			<View style={styles.column} >
				<Text style={styles.title}>Capacity</Text>
				<Text>10</Text> 

			</View>
			
				
			<View style={styles.column}>
				<Text style={styles.title}>Room Type</Text>
				<Text>CATS Room</Text> 
			</View>
		</View>

	)
}

const CalendarDay = () => {

	const  [selected, setSelected] = useState('');
	return (
		<Calendar
      onDayPress={day => {
        setSelected(day.dateString);
		console.log(day.dateString);
      }}
      markedDates={{
        [selected]: {selected: true, disableTouchEvent: true, selectedColor: 'orange'}
      }}
    />
	)
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
	flexDirection: "row",
	flexWrap: 'wrap',
	
  },
  column: {
	width: "40%",
	alignItems: "center",

	
  },
  title: {
	fontWeight: 'bold',
	fontSize: 18
  },
  main_heading: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  avaliable: {
	fontSize: 18,
	paddingBottom: 20
  },
});
