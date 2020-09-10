class RoomInfo {
    // enum value of location
    Location: string;
    RoomName: string;
    // list of booked time slot where the room is not avaliable
    BookedTimeSlots: Array<BookedSlots>;

    constructor(json: any) {
        this.Location = json.Location;
        this.RoomName = json.RoomName;
        this.BookedTimeSlots = [];
        for (let room of json.BookedTimeSlots) {
            this.BookedTimeSlots.push(new (room));
        }
    }
}

class BookedSlots {
    Start: string;
    End: string;
    Name: string;

    constructor(json: any) {
        this.Start = json.Start;
        this.End = json.End;
        this.Name = json.Name;
    }
}

// used to generate calendar events;
class EventModel {
    color: string;
    start: string;
    end: string;
    name: string;

    constructor(slot: BookedSlots) {
        this.start = slot.Start;
        this.end = slot.End;
        this.name = slot.Name;
        // TODO need to setup rules to convert type of 
        // bookedSlot to color
        this.color = "Purple";
    }
}