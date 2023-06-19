import { 
	StyleSheet,
	Text,
	View,
} from "react-native";

import type { BuildingStackScreenProps } from "../types";


export default function BuildingFilter({ route, navigation } : BuildingStackScreenProps<"Building Filter">) {
	return (
		<View style={styles.container}>
			<Text>This is the Building Filter Page </Text>
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
