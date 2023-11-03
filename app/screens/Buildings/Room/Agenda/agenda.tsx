import {BuildingStackParamList, BuildingStackScreenProps} from "../../../types";
import {Text} from "react-native";
import AgendaScreen from "./agenda_screen";

export default function Agenda({route, navigation}: BuildingStackScreenProps<"Agenda">) {
    console.log(route.params);
    return (
        <AgendaScreen room={route.params}></AgendaScreen>
    )
}

