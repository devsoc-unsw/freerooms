import { createContext } from "react";
import { Building, StatusResponse } from "@common/types";

type ContextType = { 
	buildings : Building[];
	rooms : StatusResponse,
	onRefresh : () => void;
}

export const FreeRoomsAPIContext = createContext<ContextType>({ buildings : [], rooms: {}, onRefresh: () => {} });