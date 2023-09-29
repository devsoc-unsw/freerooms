import {BuildingStackParamList, BuildingStackScreenProps} from "../../../types";
import {Text} from "react-native";
import AgendaScreen from "./agenda_screen";

export default function Agenda({route, navigation}: BuildingStackScreenProps<"Agenda">) {
    return (
        <AgendaScreen props={route.params.roomName}></AgendaScreen>
    )
}

