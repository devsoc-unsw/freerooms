import { 
	StyleSheet,
	Text,
	View,
} from "react-native";

import type { BuildingStackScreenProps } from "../../types";

export default function Room({ route, navigation } : BuildingStackScreenProps<"Room"> ) {
	return (
		<View style={ styles.container }>
			<Text> Invidividual Room Page </Text>
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
});
