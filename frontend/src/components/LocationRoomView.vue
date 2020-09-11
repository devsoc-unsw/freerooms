<template>
    <div class="location-room-view pb-10">
        <!-- Header, Building Id -->
        <v-card class="primary mx-5" style="border-radius:10px">
          <v-row align="center">
          <v-spacer></v-spacer>
          <v-col
            cols=12
            md=4
            class="py-3 px-10"
          >
              <div class="d-flex justify-left">
                <v-avatar
                  width="300"
                  height="250"
                  tile
                  style="border-radius:10px"
                >
                  <v-img src="../assets/building_photos/Tyree.png"></v-img>
                </v-avatar>
              </div>
            </v-col>
            <v-col
              cols=12
              md=7
              class="py-3 px-10"
            >
              <p class="display-3 white--text" align="left">
                {{ buildingName }}
              </p>
              <!-- <p class="display-1 white--text mb-5 ml-1" align="left">K-J12</p> -->
              <p class="subtitle-1 white--text ml-1" align="left">
                {{ allRooms.length }} Rooms Listed<br>
                {{ availableRooms.length }} Currently Available<br>
                {{ unavailableRooms.length }} Available in the Next Hour
              </p>
            </v-col>
          </v-row>
        </v-card>

        <!-- Filters -->
        <v-row 
          class="mx-5 mt-5"
          align="end">
          <!-- Sort -->
          <v-col cols="12" sm="4" md="2" class="py-0 my-0"
          style="display:none">
            <v-select
              :items="sort_options"
              label="Sort"
              :value="sort_options[0]"
            ></v-select>
          </v-col>
          <!-- Hide Unavailable -->
          <v-col cols="12" sm="6" class="py-0 my-0 pl-1">
            <v-switch :change="updateList()" v-model="enabled" class="ma-2" label="Show Unavailable"></v-switch>
          </v-col>
          <v-spacer></v-spacer>
          <!-- Date -->
          <v-col cols="12" sm="4" md="2" class="py-0 my-0"
          style="display:none">
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Picker in dialog"
                  prepend-icon="event"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <!-- Time -->
          <v-col cols="12" sm="4" md="2" class="py-0 my-0"
          style="display:none">
            <v-select
              :items="time_options"
              label="Time"
              :value="time_options[0]"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Room List -->
        <v-row
          class="mx-5 mt-4"
          align="center"
          v-for="(room, index) in listedRooms"
          :key="index"
        >
          <v-col 
            cols="12" 
            class="pa-0 ma-0"
          >
            <v-divider></v-divider>
            <router-link :to="{name: 'room', params: { locationId : locationId, roomId: room.name}}">
              <v-card
                class="background"
                flat
              >
                <v-card-title class="text-left">
                  <v-icon :color="getCalendarIconColor(room.available)" class="mr-5">event_available</v-icon>
                  <div style="width:70px"> {{ room.name }} </div>
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
        <v-row
          class="mx-5 mt-4"
          align="center"
          style="display:none"
        >
          <v-col 
            cols="12" 
            class="pa-0 ma-0"
          >
            <v-divider></v-divider>
            <router-link :to="{name: 'room', params: { locationId : locationId, roomId: 4}}">
              <v-card
                class="background"
                flat
              >
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
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import LocationService from '../services/locationService';
  import DbService from '../services/dbService';
  import moment from 'moment';

  @Component
  export default class LocationRoomView extends Vue {
    locationService = new LocationService();
    dbService = new DbService();

    // Initialisation for reactive variables.
    msg = "";
    params: any = null;
    locationId = 0;
    buildingName = "";
    allRooms = [];
    availableRooms = [];
    unavailableRooms = [];
    listedRooms= [];
    hour = '';


    // Filter / Sort variables.
    enabled = true
    sort_options = ['Name', 'Available'];
    time_options = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00',
                    '6:00', '7:00', '8:00', '9:00', '10:00', '11:00',
                    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
                    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    date = new Date().toISOString().substr(0, 10);
    modal = false;

    async mounted() {
        this.msg = this.$route.path;
        this.params = this.$route.params;
        this.hour = moment().format('hh');
        this.locationId = this.params['locationId'];
        this.buildingName = this.locationService.getLocationbyId(this.locationId);
        this.allRooms = await this.dbService.getRoomsInBuilding(this.buildingName, this.hour);
        this.listedRooms = this.allRooms;
        this.availableRooms = this.filterRoomsAvailable(this.allRooms, true);
        this.unavailableRooms = this.filterRoomsAvailable(this.allRooms, false);
    }

    filterRoomsAvailable(rooms, filterAvailable) {
      if (filterAvailable) return rooms.filter(this.checkAvailable);
      return rooms.filter(this.checkUnavailable);
    }

    checkAvailable(room, index, array): boolean {
      if (room.available) return true;
      return false;
    }

    checkUnavailable(room, index, array): boolean {
      if (room.available) return false;
      return true;
    }

    updateList() {
      if (this.enabled == true) {
        this.listedRooms = this.allRooms;
      } else {
        this.listedRooms = this.availableRooms;
      }
    }

    // Get calendar markdown icon color depending on a room's availability.
    getCalendarIconColor(available: boolean): string {
      if (available == true) return "success";
      return "error";
    }

    getAvailabilityText(available: boolean): string {
      if (available == true) return "Available Now";
      return "Unavailable Now";
    }
  }
</script>
