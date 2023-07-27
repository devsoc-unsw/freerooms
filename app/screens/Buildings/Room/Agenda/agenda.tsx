import {BuildingStackParamList, BuildingStackScreenProps} from "../../../types";
import {Text} from "react-native";
import AgendaScreen from "./agenda_screen";
export default function Agenda({route, navigation}: BuildingStackScreenProps<"Agenda">) {
    const items = route.params?.roomData;
    return (
        <AgendaScreen items={items}></AgendaScreen>
    )
}

