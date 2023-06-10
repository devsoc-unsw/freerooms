import { NavigationContainer } from '@react-navigation/native';
import { getBuildings, getRooms } from './services/freerooms_api/endpoints';
import { Room_Dictionary, Buildings } from './services/freerooms_api/api_types';
import RootNavigator from './screens/Root/root_navigator';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FreeRoomsAPIContext } from './contexts';

export default function App() {

	const [ buildings, setBuildings ] = useState<Buildings>([]);
	const [ roomDict, setRoomDict ] = useState<Room_Dictionary>({});
	const handleRefresh = () => {};
	
	useEffect(() => {
		const fetchData = async () => {
			const getBuildingsResponse = await getBuildings();
			const getRoomsResponse = await getRooms();
			setBuildings(getBuildingsResponse);
			setRoomDict(getRoomsResponse);
		}
		fetchData();
	}, []);
	
		
	
  return (
	<NavigationContainer>
		<StatusBar />
		<FreeRoomsAPIContext.Provider value={{ buildings : buildings, rooms: roomDict, onRefresh: handleRefresh }}>
			<RootNavigator />
		</FreeRoomsAPIContext.Provider>
	</NavigationContainer>
    
  );
}