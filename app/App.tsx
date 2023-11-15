import { NavigationContainer } from '@react-navigation/native';
import { getBuildings, getRooms, getRoomInfo } from './services/freerooms_api/endpoints';
import { Building, RoomsResponse, StatusResponse } from "@common/types";
import RootNavigator from './screens/Root/root_navigator';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FreeRoomsAPIContext } from './contexts';

export default function App() {

	const [ buildings, setBuildings ] = useState<Building[]>([]);
	const [ roomDict, setRoomDict ] = useState<StatusResponse>({});
	const [ roomInfo, setRoomInfo ] = useState<RoomsResponse>({ rooms: {} });
	const handleRefresh = () => {};
	
	useEffect(() => {
		const fetchData = async () => {
			const getBuildingsResponse = await getBuildings();
			const getRoomsResponse = await getRooms();
			const getRoomInfoResponse = await getRoomInfo();
			setBuildings(getBuildingsResponse);
			setRoomDict(getRoomsResponse);
			setRoomInfo(getRoomInfoResponse);
		}
		fetchData();
	}, []);
	

	
  return (
	<NavigationContainer>
		<StatusBar />
		<FreeRoomsAPIContext.Provider value={{ buildings : buildings, rooms: roomDict, roomInfo: roomInfo, onRefresh: handleRefresh }}>
			<RootNavigator />
		</FreeRoomsAPIContext.Provider>
	</NavigationContainer>
    
  );
}