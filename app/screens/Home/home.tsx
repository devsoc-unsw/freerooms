import { 
	StyleSheet,
	Text,
	View,
} from "react-native";
import Container from "../../components/container";
import type { RootTabScreenProps } from "../types";


export default function Home({ route, navigation } : RootTabScreenProps<'Home'> ) {
	return (
		<Container>
			<Text>This is the Home Page</Text>
		</Container>
	)
}
