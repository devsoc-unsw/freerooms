import { View, Text, StyleSheet } from 'react-native';
import { Rooms } from '../services/freerooms_api/api_types';
import StatusDot from './StatusDot';

const StatusIndicator = ({rooms}) => {
	const roomsOfCurrBuilding:Rooms = rooms;
    const totalRooms:number = rooms ? Object.keys(roomsOfCurrBuilding).length : null;
    const freeRooms:number = rooms ? Object.values(roomsOfCurrBuilding).filter(x => x.status == "free" ).length : null;

    return (
        <View style={styles.container}>
            <StatusDot numRooms={freeRooms}/>
            <Text style={styles.text}>{freeRooms ?? '--'} / {totalRooms ?? '--'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 32,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: "10%",
    },
    text: {
        fontSize: 14,
        marginRight: 3,
    }
})

export default StatusIndicator;