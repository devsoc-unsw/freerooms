import { 
	Button,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BuildingList from "./building_list";
import Building from "./building";
import BuildingFilter from "./building_filter";
import Room from "./Room/room";
import RoomFilter from "./Room/room_filter";

import type { BuildingStackParamList } from "../types";

const Stack = createNativeStackNavigator<BuildingStackParamList>();
export default function Buildings() {
	return (
		<Stack.Navigator
			initialRouteName="All Buildings"
			screenOptions={({route}) => ({
				headerStyle: styles.headerStyle,
				headerTitleStyle: styles.headerTitle,
				headerShadowVisible: false,
			})}
		>
			{/* Building Screens  */}
			<Stack.Group>
				<Stack.Screen 
					name="All Buildings" 
					component={BuildingList} 
					options={({ navigation, route }) => ({
						headerRight: () => (
							<Button title="Filter Buildings" />
						)
					})}	
				/>
				<Stack.Screen 
					name="Building" 
					component={Building} />
			</Stack.Group>
			
			{/* Room Screens */}
			<Stack.Group>
				<Stack.Screen
					name="Room"
					component={Room}
				/>
			</Stack.Group>
			
			{/* Filter Room  Modal  */}
			<Stack.Group 
				screenOptions={({ navigation, route }) => ({ 
					presentation: "modal",
					})
				}
			>
				<Stack.Screen name="Room Filter" component={RoomFilter} />
			</Stack.Group>		
			
			{/* Filter Building Modal  */}
			<Stack.Group 
				screenOptions={({ navigation, route }) => ({ 
					presentation: "modal",
					})
				}
			>
				<Stack.Screen name="Building Filter" component={BuildingFilter} />
			</Stack.Group>
		</Stack.Navigator>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerStyle: {
    backgroundColor: 'white',
  },
  headerTitle: {
    color: 'black',
  }
});
