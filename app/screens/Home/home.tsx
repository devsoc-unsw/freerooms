import { 
	StyleSheet,
	Text,
	View,
	Image,
} from "react-native";
import Container from "../../components/container";
import type { RootTabScreenProps } from "../types";
import Logo from "../../assets/free_rooms_logo.png";

const styles = StyleSheet.create({
	logo: {
		width: 75,
		height:75,
	},
	box: {
		display: "flex",
		alignItems: "center",
		flex: 1,
		opacity: 1,
	},
	text: {
		fontWeight: "600",
		fontFamily: "Josefin Sans",
		fontSize: 30,
	},
});

export default function Home({ route, navigation } : RootTabScreenProps<'About Us'> ) {
	return (
		<Container>
			<Container style={styles.box}><Image style={styles.logo} source= {Logo}/><Text>Freerooms</Text></Container>
			
		</Container>
	)
}
