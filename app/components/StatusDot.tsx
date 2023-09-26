import { View, StyleSheet } from 'react-native';
import React from "react";

interface StatusDotProps {
    numRooms: number;
}

const StatusDot: React.FC<StatusDotProps> = ({ numRooms }) => {
    const bg = numRooms >= 5 ? "green" : numRooms !== 0 ? "orange" : "red";

    return (
        <View style={[ styles.dot, { backgroundColor: bg }]}/>
    )
}

const styles = StyleSheet.create({
    dot: {
        width: 10,
        height: 10,
        backgroundColor: "red",
        borderRadius: 100,
        marginHorizontal: 3,
    }
})

export default StatusDot;