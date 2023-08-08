import { View, Text, StyleSheet } from 'react-native';
import StatusDot from './StatusDot';
import { BuildingStatus } from "@common/types";
import React from "react";

interface StatusIndicatorProps {
    rooms: BuildingStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({rooms}) => {
    const totalRooms: number | null = rooms ? Object.keys(rooms).length : null;
    const freeRooms: number | null = rooms ? Object.values(rooms).filter(x => x.status == "free" ).length : null;

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