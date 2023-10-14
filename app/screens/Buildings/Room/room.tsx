import {Image, StyleSheet, Text, View} from "react-native";

import type {BuildingStackScreenProps} from "../../types";
import {getBookings} from "../../../services/freerooms_api/endpoints";
import {useEffect, useState} from "react";

export default function Room({
                                 route,
                                 navigation,
                             }: BuildingStackScreenProps<"Room">) {

interface RouteParams {
	roomName: string;
	status: string;
	buildingId: string;
}

export default function Room({ route, navigation } : BuildingStackScreenProps<"Room"> ) {
	const [routeParams, setRouteParams] = useState<RouteParams>(null)
	const [nav, setNav] = useState(null)
	useEffect(() => {
		setRouteParams(route.params)
		setNav(navigation)
		
	}, [route, navigation]);

	async function seeBookings() {
		const roomId  = routeParams.buildingId + "-" + routeParams.roomName;
		console.log(roomId);
		nav?.navigate("Agenda", {roomName: roomId})
	}

	return (
		<>
			<View style={ styles.container }>
				<Text style={ styles.main_heading }>{routeParams?.roomName}</Text>
				<Text style={styles.avaliable}> {routeParams?.status == "free" ? "Available" : "Unvailable"} </Text>
				<Elements></Elements>
				<CalendarDay/>
			</View>
			<Button title={"See Bookings"} onPress={seeBookings}>See Bookings</Button>
			
		</>



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
        alignItems: "center",
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: "flex-start",
    },
    roomImage: {
        height: "40%",
        width: "100%",
    },
    titleContainer: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: 1,
        justifyContent: "flex-start",
        padding: 15,
        paddingTop: 20,
        width: "100%",
    },
    infoContainer: {
        alignItems: "center",
        flexDirection: "row",
        padding: 10,
    },
    largeText: {
        fontSize: 28,
        fontWeight: "600",
    },
    mediumText: {color: "grey", fontSize: 20, fontWeight: "600"},
});
