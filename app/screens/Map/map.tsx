import {StyleSheet, View,} from "react-native";

import type {RootTabScreenProps} from "../types";
import MapView from 'react-native-maps';

export default function Map({route, navigation}: RootTabScreenProps<'Map'>) {
    return (
        <View style={styles.container}>
            <MapView
				style={styles.map}
				camera={{
					center: {
						latitude: -33.91755,
						longitude: 151.22996,
					},
					pitch:  35,
					heading: 100,
					altitude: 1450,
					zoom: 1650
				}}
				// turn off once we have our own building tags
				showsPointsOfInterest={true}
            />
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
    map: {
        width: '100%',
        height: '100%',
    },
});
