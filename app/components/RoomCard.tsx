import {
	StyleSheet,
	Text,
	View,
	Pressable,
} from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';
import React from "react";
import { RoomStatus } from "@common/types";
import { BuildingStackScreenProps } from "../screens/types";

interface RoomCardProps {
	nav: BuildingStackScreenProps<"Building">['navigation'],
	roomNumber: string,
	roomName: string,
	status: RoomStatus
}

const RoomCard: React.FC<RoomCardProps> = ({ nav, roomNumber, roomName, status }) => {

	const handlePress = () => {
		nav.navigate("Room");
	}

	const date = new Date(status.endtime);
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
		soon: "Available Soon",
	};

	const untilMessage = {
		free: hoursMinutes == "Invalid Date" ? "" : "until " + hoursMinutes,
		busy: hoursMinutes == "Invalid Date" ? "" : "until " + hoursMinutes,
		soon: "at " + hoursMinutes,
	}

	const untilMessageDisplay = hoursMinutes == "Invalid Date" ? "none" : "flex";

	return (
		<Pressable onPress={handlePress} style={({ pressed }) => [
			styles.roomButton,
			pressed ? { backgroundColor: '#f5f5f5', shadowRadius: 2, } : {},
		]}>
			<View>
				<Text style={styles.subHeading}>
					{ roomNumber }
				</Text>
				<Text style={styles.body}>
					{ roomName }
				</Text>
			</View>
			<View style={styles.textContainer}>
				<View style={styles.roomStatusContainer}>
					<Text style={[
						styles.subHeading,
						{color: roomStatusColor[status.status]}
					]}>
						{roomStatusMessage[status.status]}
					</Text>
					<View style={{display: untilMessageDisplay}}>
						<Text style={[
							styles.body,
							{color: roomStatusColor[status.status]}
						]}>
								{ untilMessage[status.status] }
						</Text>
					</View>
				</View>
				<Ionicons name="chevron-forward-outline" size={25} color='grey' />
			</View>
		</Pressable>
	);
}


const styles = StyleSheet.create({
    subHeading: {
      fontSize: 18,
      fontWeight: '600',
    },
		body: {
			fontSize: 12,
			fontWeight: '600',
			paddingTop: 3,
		},
    textContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
			alignItems: 'center',
    },
		statusMessage: {
			paddingRight: 5,
			paddingTop: 3.5,
			fontSize: 17,
			fontWeight: '600',
		},
		roomStatusContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-end',
			paddingRight: 5,
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

export default RoomCard;
