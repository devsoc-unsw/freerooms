<template>
  <div class="location-room-view pb-10">
    <!-- Header, Building Id -->
    <v-card class="primary mx-5" style="border-radius:10px">
      <v-row align="center">
        <v-spacer></v-spacer>
        <v-col cols="12" md="4" class="py-3 px-10">
          <div class="d-flex justify-left">
            <v-avatar width="300" height="250" tile style="border-radius:10px">
              <v-img
                :src="`../assets/building_photos/${locationId}.png`"
              ></v-img>
            </v-avatar>
          </div>
        </v-col>
        <v-col cols="12" md="7" class="py-3 px-10">
          <p class="display-3 white--text" align="left">
            {{ buildingName }}
          </p>
          <p class="subtitle-1 white--text ml-1" align="left">
            {{ allRooms.length }} Rooms Listed<br />
            {{ availableRooms.length }} Currently Available<br />
            {{ unavailableRooms.length }} Currently Unavailable
            <!-- TODO -->
            <!-- {{ availableSoonRooms.length }} Available in the Next Hour  -->
          </p>
        </v-col>
      </v-row>
    </v-card>

    <!-- Filters -->
    <!-- TODO fix filters -->
    <v-row class="mx-5 mt-5" align="end">
      <!-- Sort -->
      <v-col cols="12" sm="4" md="2" class="py-0 my-0">
        <v-select
          v-model="select"
          :items="sort_options"
          label="Sort"
          :item-value="select"
          return-object
        ></v-select>
      </v-col>
      <!-- Hide Unavailable -->
      <v-col cols="12" sm="6" class="py-0 my-0 pl-1">
        <v-switch
          :change="updateList()"
          v-model="enabled"
          class="ma-2"
          label="Show Unavailable"
        ></v-switch>
      </v-col>
      <v-spacer></v-spacer>
      <!-- Date -->
      <v-col cols="12" sm="4" md="2" class="py-0 my-0">
        <v-dialog
          ref="dateDialog"
          v-model="dateModal"
          :return-value.sync="date"
          width="290px"
          persistent
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Choose date"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="dateModal = false"
              >Cancel</v-btn
            >
            <v-btn text color="primary" @click="$refs.dateDialog.save(date); updateDateTime()"
              >OK</v-btn
            >
          </v-date-picker>
        </v-dialog>
      </v-col>
      <!-- Time -->
      <v-col cols="12" sm="4" md="2" class="py-0 my-0">
        <v-dialog
          ref="timeDialog"
          v-model="timeModal"
          :return-value.sync="time"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              label="Choose time"
              prepend-icon="schedule"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker v-model="time">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="timeModal = false"
              >Cancel</v-btn
            >
            <v-btn text color="primary" @click="$refs.timeDialog.save(time); updateDateTime()"
              >OK</v-btn
            >
          </v-time-picker>
        </v-dialog>
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
        <router-link
          :to="{
            name: 'room',
            params: { locationId, roomId: room.name },
          }"
        >
          <v-card class="background" flat>
            <v-card-title class="text-left">
              <!-- TODO check if room is available or not and assign appropriately -->
              <v-icon :color="getCalendarIconColor(room.available)" class="mr-5"
                >event_available</v-icon
              >
              <div style="width:70px">{{ room.name }}</div>
              <v-divider vertical class="mx-5"></v-divider>
              {{ getAvailabilityText(room.available) }}
            </v-card-title>
          </v-card>
        </router-link>
      </v-col>
    </v-row>

    <!-- Currently Unavailable but available later ReferenceTemplate-->
    <!-- TODO: Implement this inside of the room list loop. 
                   Remove this row once done. -->
    <v-row class="mx-5 mt-4" align="center" style="display:none">
      <v-col cols="12" class="pa-0 ma-0">
        <v-divider></v-divider>
        <router-link
          :to="{ name: 'room', params: { locationId: locationId, roomId: 4 } }"
        >
          <v-card class="background" flat>
            <v-card-title class="text-left">
              <v-icon color="warning" class="mr-5">event_note</v-icon>
              <span> Room 4 </span>
              <v-divider vertical class="mx-5"></v-divider>
              Available After 14:00
            </v-card-title>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Route } from "vue-router";
import DbService from "../services/dbService";
import moment from "moment";
import { Room, RoomStatus } from "../types";
@Component
export default class LocationRoomView extends Vue {
  dbService = new DbService();

  // Initialisation for reactive variables.
  msg = "";
  params: any = null;
  locationId = "";
  buildingName = "";
  allRooms: Room[] = [];
  availableRooms: Room[] = [];
  unavailableRooms: Room[] = [];
  listedRooms: Room[] = [];

  // Filter / Sort variables.
  enabled = true;
  sort_options = ["Name", "Available"];
  select = "Name";
  date = moment(new Date().toISOString()).format("YYYY-MM-DD");
  time = moment(new Date().toISOString()).format("HH:mm");

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
      `${this.date}T${this.time}` // This is just a date for testing with available/unavailable rooms
      // `${this.date}T${this.time}` // TODO: Updates to date/time do not rerender
    );
    this.listedRooms = this.allRooms;
    this.availableRooms = this.filterRoomsAvailable(this.allRooms, true);
    this.unavailableRooms = this.filterRoomsAvailable(this.allRooms, false);
  }
  filterRoomsAvailable(rooms: Room[], filterAvailable: boolean) {
    if (filterAvailable) return rooms.filter(this.checkAvailable);
    return rooms.filter(this.checkUnavailable);
  }

  async updateDateTime() {
    this.allRooms = await this.dbService.getRoomsInBuilding(
      this.locationId,
      `${this.date}T${this.time}`);
  }

  checkAvailable(room: Room, index: number, array: Room[]): boolean {
    if (room.available === "free") return true;
    return false;
  }
  // TODO: need to get rooms that are unavailable now but is available in the next hour
  checkAvailableSoon(room: Room, index: number, array: Room[]): boolean {
    if (room.available === "free") return false;
    return true;
  }
  checkUnavailable(room: Room, index: number, array: Room[]): boolean {
    if (room.available === "free") return false;
    return true;
  }
  // TODO: Fix infinite loop issue or change method for sorting filters
  sortRooms(rooms: Room[], sort: string) {
    if (this.select === "Name") {
      rooms.sort((a: Room, b: Room) => (a.name > b.name ? 1 : -1));
    } else {
      rooms.sort((a: Room, b: Room) => (a.available < b.available ? 1 : -1));
    }
    return rooms;
  }
  updateList() {
    if (this.enabled == true) {
      this.listedRooms = this.allRooms;
    } else {
      this.listedRooms = this.availableRooms;
    }
  }

  // Get calendar markdown icon color depending on a room's availability.
  getCalendarIconColor(available: RoomStatus): string {
    switch (available) {
      case "free":
        return "success";
      case "soon":
        return "orange";
      case "busy":
        return "error";
      default:
        return "error";
    }
  }

  getAvailabilityText(available: RoomStatus): string {
    switch (available) {
      case "free":
        return "Available now";
      case "soon":
        return "Available soon";
      case "busy":
        return "Unavailable now";
      default:
        return "Unavailable now";
    }
  }
}
</script>
