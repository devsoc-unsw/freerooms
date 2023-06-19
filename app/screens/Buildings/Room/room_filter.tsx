import { 
	StyleSheet,
	Text,
	View,
} from "react-native";

import type { BuildingStackScreenProps } from "../../types";


export default function RoomFilter({ route, navigation } : BuildingStackScreenProps<"Room Filter">) {
	return (
		<View style={styles.container}>
			<Text>This is the Room Filter Page </Text>
		</View>
	)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
