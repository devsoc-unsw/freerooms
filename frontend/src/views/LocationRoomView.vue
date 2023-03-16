<template>
  <div class="location-room-view pb-10">
    <!-- Header, Building Id -->
    <v-card class="primary mx-5" style="border-radius:10px; margin-top: 3vh">
      <v-row align="center">
        <v-col cols="12" md="4" class="py-3 px-10">
          <div class="d-flex justify-center">
            <v-avatar
              tile
              width="18.75em"
              height="12.5em"
              style="border-radius:10px"
            >
              <v-img
                :src="`../assets/building_photos/${locationId}.webp`"
              ></v-img>
            </v-avatar>
          </div>
        </v-col>
        <v-col cols="12" md="7" class="py-3 px-10">
          <p class="display-2 white--text" align="center">
            {{ buildingName }}
          </p>
          <p class="subtitle-1 white--text ma-1" align="center">
            {{ allRooms.length }} Rooms Listed<br />
            {{ availableRooms.length }} Currently Available<br />
            {{ availableSoonRooms.length }} Available within 15 minutes<br />
            {{ unavailableRooms.length }} Currently Unavailable
          </p>
        </v-col>
      </v-row>
    </v-card>

    <!-- Filters -->
    <v-row class="mx-5 mt-5" align="end">
      <!-- Sort -->
      <v-col cols="12" sm="4" md="2" class="py-0 my-0">
        <SortFilter
          label="Sort rooms"
          :selected.sync="selected"
          :sortOptions="sort_options"
          @onChange="updateList"
        />
      </v-col>
      <!-- Hide Unavailable -->
      <v-col cols="12" sm="6" class="py-0 my-0 pl-1">
        <ToggleFilter
          label="Show unavailable"
          :enabled.sync="enabled"
          @onChange="updateList"
        />
      </v-col>
      <v-spacer></v-spacer>
      <!-- Date -->
      <v-col cols="12" sm="4" md="2" class="py-0 my-0">
        <DatePicker
          :date.sync="date"
          @onChange="updateDateTime"
          :modal.sync="dateModal"
        />
      </v-col>
      <!-- Time -->
      <v-col cols="12" sm="4" md="2" class="py-0 my-0">
        <TimePicker
          :time.sync="time"
          @onChange="updateDateTime"
          :modal.sync="timeModal"
        />
      </v-col>
    </v-row>

    <!-- Room List -->
    <v-row
      class="mx-5 mt-4"
      align="center"
      v-for="(room, index) in listedRooms"
      :key="index"
    >
      <v-col cols="12" class="pa-0 ma-0">
        <v-divider></v-divider>
        <RoomListItem
          :room="room"
          :locationId="locationId"
          :date="date"
          :time="time"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DbService from "../services/dbService";
import { DateTime } from "luxon";
import { Room, RoomStatus } from "../types";
import RoomListItem from "../components/RoomListItem.vue";
import SortFilter from "../components/SortFilter.vue";
import ToggleFilter from "../components/ToggleFilter.vue";
import DatePicker from "../components/DatePicker.vue";
import TimePicker from "../components/TimePicker.vue";

@Component({
  components: {
    SortFilter,
    ToggleFilter,
    DatePicker,
    TimePicker,
    RoomListItem,
  },
})
export default class LocationRoomView extends Vue {
  dbService = new DbService();

  // Initialisation for reactive variables.
  msg = "";
  params: any = null;
  locationId = "";
  buildingName = "";
  allRooms: Room[] = [];
  availableRooms: Room[] = [];
  availableSoonRooms: Room[] = [];
  unavailableRooms: Room[] = [];
  listedRooms: Room[] = [];

  // Filter / Sort variables.
  enabled = true;
  sort_options = ["Name", "Available"];
  selected = "Name";
  date = DateTime.now().toFormat("yyyy-MM-dd");
  time = DateTime.now().toFormat("HH:mm");

  dateModal = false;
  timeModal = false;

  async mounted() {
    this.msg = this.$route.path;
    this.params = this.$route.params;
    this.locationId = this.params["locationId"];
    this.buildingName = await this.dbService.getBuildingByLocation(
      this.locationId
    );
    this.allRooms = await this.dbService.getRoomsInBuilding(
      this.locationId,
      DateTime.fromFormat(
        this.date + this.time, "yyyy-MM-ddHH:mm").toUTC().toISO()
    );
    this.listedRooms = this.allRooms;
    this.availableRooms = this.filterRoomsAvailable(this.allRooms, "free");
    this.availableSoonRooms = this.filterRoomsAvailable(this.allRooms, "soon");
    this.unavailableRooms = this.filterRoomsAvailable(this.allRooms, "busy");
  }

  filterRoomsAvailable(rooms: Room[], filterStatus: RoomStatus) {
    const filteredRooms = rooms.filter((v) => v.status === filterStatus);
    return filteredRooms;
  }

  async updateDateTime() {
    this.allRooms = await this.dbService.getRoomsInBuilding(
      this.locationId,
      DateTime.fromFormat(
        this.date + this.time, "yyyy-MM-ddHH:mm").toUTC().toISO()
    );
    this.listedRooms = this.allRooms;
    this.availableRooms = this.filterRoomsAvailable(this.allRooms, "free");
    this.availableSoonRooms = this.filterRoomsAvailable(this.allRooms, "soon");
    this.unavailableRooms = this.filterRoomsAvailable(this.allRooms, "busy");
  }

  sortRooms(rooms: Room[]) {
    if (this.selected === "Name") {
      rooms.sort((a: Room, b: Room) => (a.name > b.name ? 1 : -1));
    } else {
      // free -> soon -> busy
      rooms.sort((a: Room, b: Room) => {
        // if status is the same then compare the room name
        if (a.status === b.status) {
          return b.name < a.name ? 1 : -1;
        }

        if (b.status === "free") return 1;
        if (a.status === "free") return -1;

        return b.status > a.status ? 1 : -1;
      });
    }
    return rooms;
  }

  updateList() {
    if (this.enabled == true) {
      this.listedRooms = this.allRooms;
    } else {
      this.listedRooms = this.availableRooms;
    }
    this.sortRooms(this.listedRooms);
  }
}
</script>
