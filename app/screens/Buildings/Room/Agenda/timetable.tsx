import {BuildingStackParamList, BuildingStackScreenProps} from "../../../types";
import {Text} from "react-native";
import TimetableScreen from "./timetable_screen";

export default function Timetable({route, navigation}: BuildingStackScreenProps<"Timetable">) {
    return (
        <TimetableScreen roomId={route.params.roomId}></TimetableScreen>
    )
}

