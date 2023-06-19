// Navigation Imports
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Type Imports 
import type { RootTabParamList } from "../types";

// Screen Imports 
import Map from "../Map/map";
import Home from "../Home/home";
import Buildings from "../Buildings/buildings";

// Style Imports
import theme from "../../theme";
import { StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootNavigator() {
	return (
		<Tab.Navigator
			initialRouteName="Home"
			screenOptions={({route}) => ({
				headerShown: route.name == 'Buildings' ? false : true,
				tabBarStyle: styles.tabBar,
				headerStyle: styles.header,
				headerTitleStyle: styles.headerTitle,
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: 'gray',
				headerShadowVisible: false,
				tabBarIcon: ({ focused }) => {
					let iconName;
					
					let iconColor = focused ? theme.colors.primary : 'gray';
					
					if( route.name === "Home" ) {
						iconName = "home";
					} else if( route.name === "Buildings") {
						iconName = "business"
					} else {
						iconName = "map"
					}
					
					return <Ionicons name={iconName} size={20} color={iconColor} />
				},
			})}
		>
			<Tab.Screen name="Buildings" component={Buildings} />
			<Tab.Screen name="Home" component={Home} />
			<Tab.Screen name="Map" component={Map} />
		</Tab.Navigator>
	)
}

const styles = StyleSheet.create({
	tabBar: {
		backgroundColor: "white",
	},
	tabBarLabel: {
		fontSize: 12,
		fontWeight: 'bold',
	},
	header: {
		backgroundColor: 'white',
	},
	headerTitle: {
		color: 'black',
	},
})