import { 
	StyleSheet,
	Text,
	View,
} from "react-native";


import type { BuildingStackScreenProps } from "../../types";
import { TabRouter } from "@react-navigation/native";

export default function Room({ route, navigation } : BuildingStackScreenProps<"Room"> ) {
	console.log(route);
	return (
		<View style={ styles.container }>
			<Text style={ styles.main_heading }>{route.params.roomName}</Text>
			<Text style={styles.avaliable}> {route.params.status == "free" ? "Available" : "Unvailable"} </Text>
			<Elements></Elements>

		</View>
	);
}

const Elements = () => {
	return (

			<View>
				<View style={styles.column} >
				<Text>Capacity</Text> 
			</View>
			<View style={styles.column}>
				<Text>Room Type</Text>
			</View>


		</View>

	)
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  column: {
	width: '50%'

  },
});
