import Locations from '../models/enum';

export default class LocationService {
    
    getRoomById (id: number): string {
        return `Room ${id}`;
    }
    
    getLocationbyId (id: number): string {
        return Locations[id];
    }
}

