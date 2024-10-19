import { createContext } from "react";
import { Building, StatusResponse, RoomsResponse } from "@common/types";

type ContextType = {
	buildings : Building[];
	rooms : StatusResponse,
	roomInfo : RoomsResponse,
	onRefresh : () => void;
}

export const FreeRoomsAPIContext = createContext<ContextType>({ buildings : [], rooms: {}, roomInfo: { rooms: {} }, onRefresh: () => {} });
