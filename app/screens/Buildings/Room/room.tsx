import { 
	StyleSheet,
	Text,
	View,
} from "react-native";

import {Agenda, AgendaList} from 'react-native-calendars'
import { FlatList } from "react-native";
import type { BuildingStackScreenProps } from "../../types";
import { TabRouter } from "@react-navigation/native";

export default function Room({ route, navigation } : BuildingStackScreenProps<"Room"> ) {
	console.log(route);
	return (
		<View style={ styles.container }>
			<Text style={ styles.main_heading }>{route.params.roomName}</Text>
			<Text style={styles.avaliable}> {route.params.status == "free" ? "Available" : "Unvailable"} </Text>
			<Elements></Elements>
			<CalendarDay/>

		</View>
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
	return (
		<Agenda
				// The list of items that have to be displayed in agenda. If you want to render item as empty date
				// the value of date key has to be an empty array []. If there exists no value for date key it is
				// considered that the date in question is not yet loaded
				items={{
					'2012-05-22': [{name: 'item 1 - any js object', height: 10, day: "Monday"}],
				}}
				// Callback that gets called when items for a certain month should be loaded (month became visible)
				loadItemsForMonth={month => {
					console.log('trigger items loading');
				}}
				// Callback that fires when the calendar is opened or closed
				onCalendarToggled={calendarOpened => {
					console.log(calendarOpened);
				}}
				// Callback that gets called on day press
				onDayPress={day => {
					console.log('day pressed');
				}}
				// Callback that gets called when day changes while scrolling agenda list
				onDayChange={day => {
					console.log('day changed');
				}}
				// Initially selected day
				selected={'2012-05-16'}
				// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
				minDate={'2012-05-10'}
				// Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
				maxDate={'2012-05-30'}
				// Max amount of months allowed to scroll to the past. Default = 50
				pastScrollRange={50}
				// Max amount of months allowed to scroll to the future. Default = 50
				futureScrollRange={50}
				// Specify how each item should be rendered in agenda
				renderItem={(item, firstItemInDay) => {
					return <View />;
				}}
				// Specify how each date should be rendered. day can be undefined if the item is not first in that day
				renderDay={(day, item) => {
					return <View />;
				}}
				// Specify how empty date content with no items should be rendered
				renderEmptyDate={() => {
					return <View />;
				}}
				// Specify how agenda knob should look like
				renderKnob={() => {
					return <View />;
				}}
				// Override inner list with a custom implemented component
				// Specify what should be rendered instead of ActivityIndicator
				renderEmptyData={() => {
					return <View />;
				}}
				
				// Hide knob button. Default = false
				hideKnob={true}
				// When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
				showClosingKnob={false}
				// By default, agenda dates are marked if they have at least one item, but you can override this if needed
				markedDates={{
					'2012-05-16': {selected: true, marked: true},
					'2012-05-17': {marked: true},
					'2012-05-18': {disabled: true}
				}}
				// If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
				disabledByDefault={true}
				// If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
				onRefresh={() => console.log('refreshing...')}
				// Set this true while waiting for new data from a refresh
				refreshing={false}
				// Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
				refreshControl={null}
				// Agenda theme
				theme={{
					agendaDayTextColor: 'yellow',
					agendaDayNumColor: 'green',
					agendaTodayColor: 'red',
					agendaKnobColor: 'blue'
				}}
				// Agenda container style
				style={{}}
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
