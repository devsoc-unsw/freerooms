import { createContext } from "react";
import type { Buildings, Room_Dictionary } from "./services/freerooms_api/api_types";

type ContextType = { 
	buildings : Buildings;
	rooms : Room_Dictionary,
	onRefresh : () => void;
}

export const FreeRoomsAPIContext = createContext<ContextType>({ buildings : [], rooms: {}, onRefresh: () => {} });