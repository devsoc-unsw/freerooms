import { getBuildingData, getScraperData, getWeek } from "./helpers";
import { BuildingReturnData, Class, ClassList, Filters, RoomAvailability, RoomStatus, RoomStatusReturnData } from "./types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FIFTEEN_MIN = 15 * 1000 * 60;
const UPPER = 19; // Buildings with grid 19+ are upper campus

export const getAllBuildings = async (): Promise<BuildingReturnData[]> => {
  const data = Object.values(await getBuildingData());
  if (!data) {
    throw new Error(`Buildings cannot be retrieved`);
  }

  const res: BuildingReturnData[] = [];
  data.forEach(({ name, id, lat, long }) => {
    res.push({
      name: name,
      id: id,
      lat: lat,
      long: long,
    });
  });
  return res;
};

export const getAllRoomStatus = async (
  buildingID: string,
  date: Date,
  filters: Filters
): Promise<RoomStatusReturnData> => {
  const buildingData = await getBuildingData();
  if (!(buildingID in buildingData)) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  }
  const buildingRooms = Object.keys(buildingData[buildingID].rooms);

  const week = await getWeek(date);
  const day = DAYS[date.getDay()];

  const scraperData = await getScraperData();
  const roomStatus: RoomStatusReturnData = {};
  for (const roomNumber of buildingRooms) {

    // Skip room if it does not match filter
    const roomData = buildingData[buildingID].rooms[roomNumber];
    const roomGrid = parseInt(buildingID.substring(3));
    const roomLocation = roomGrid < UPPER ? 'lower' : 'upper';
    if (
      roomData.capacity < filters.capacity ||
      (filters.usage && roomData.usage != filters.usage) ||
      (filters.location && filters.location != roomLocation)
    ) {
      continue;
    }

    // If no data for this room on this day, it is free
    if (
      !(buildingID in scraperData) ||
      !(roomNumber in scraperData[buildingID]) ||
      !(week in scraperData[buildingID][roomNumber]) ||
      !(day in scraperData[buildingID][roomNumber][week])
    ) {
      roomStatus[roomNumber] = {
        status: "free",
        endtime: "",
      };
      continue;
    }

    // Filter out duplicates and sort by start time
    let classes: ClassList = scraperData[buildingID][roomNumber][week][day];
    classes = classes.filter((value: Class, index: number, self: ClassList) =>
      index === self.findIndex((c: Class) => 
        c.start === value.start && c.end === value.end
      )
    );
    classes.sort((a: Class, b: Class) => {
      return combineDateTime(date, a.start).getTime() -
             combineDateTime(date, b.start).getTime();
    });

    const status = calculateStatus(date, classes, filters.duration);
    if (!status) continue;
    roomStatus[roomNumber] = status;
  }

  return roomStatus;
};

// Given a datetime and a list of the room's bookings for the,
// corresponding date, calculate the status of the room
// If room if not free for the given minimum duration, return null
const calculateStatus = (
  datetime: Date,
  classes: ClassList,
  minDuration: number
): RoomStatus | null => {
  let roomStatus: RoomStatus = {
    status: "free",
    endtime: "",
  };

  let isFree = true;
  let currTime = datetime.getTime();
  for (const eachClass of classes) {
    let classStart = combineDateTime(datetime, eachClass['start']);
    let classStartTime = classStart.getTime();

    let classEnd = combineDateTime(datetime, eachClass['end']);
    let classEndTime = classEnd.getTime();

    if (isFree && currTime < classStartTime) {
      // If room is free at current time and this class is after
      const duration = (classStartTime - currTime) / (1000 * 60);
      return duration < minDuration ? null : roomStatus;
    } else if (currTime >= classStartTime && currTime < classEndTime) {
      if (minDuration > 0) return null;

      // If class occuring at current time, check if ending soon
      isFree = false;
      if (classEndTime - datetime.getTime() <= FIFTEEN_MIN) {
        roomStatus = {
          status: "soon",
          endtime: classEnd.toISOString(),
        };
      } else {
        roomStatus = {
          status: "busy",
          endtime: classEnd.toISOString(),
        };
      }

      // Continue looping forward to check for consecutive classes
      currTime = classEndTime;
    }
  }

  return roomStatus;
}

const combineDateTime = (date: Date, time: string) => {
  const newDate = new Date(date.valueOf());
  const [hours, minutes] = time.split(':');
  newDate.setHours(+hours, +minutes);
  return newDate;
}

export const getRoomAvailability = async (
  buildingID: string,
  roomNumber: string
): Promise<RoomAvailability> => {
  // Check if room exists in database
  const buildingData = await getBuildingData();
  if (!(buildingID in buildingData)) {
    throw new Error(`Building ID ${buildingID} does not exist`);
  }
  if (!(roomNumber in buildingData[buildingID].rooms)) {
    throw new Error(`Room ID ${buildingID}-${roomNumber} does not exist`);
  }

  const scraperData = await getScraperData();
  if (
    !(buildingID in scraperData) ||
    !(roomNumber in scraperData[buildingID])
  ) {
    return { name: buildingData[buildingID].rooms[roomNumber].name };
  } else {
    return scraperData[buildingID][roomNumber];
  }
};
