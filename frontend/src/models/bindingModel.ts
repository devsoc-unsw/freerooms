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
        for(let room of json.BookedTimeSlots) {
            this.BookedTimeSlots.push(new (room));
        }
    }
}

class BookedSlots {
    Start: string;
    End: string;

    constructor(json: any) {
        this.Start = json.Start;
        this.End = json.End;
    }
}