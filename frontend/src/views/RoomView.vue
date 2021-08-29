<template>
  <div class="RoomView">
    <v-container>
      <v-row no-gutters align="start" justify="center">
        <v-col cols="12">
          <v-card class="control-card">
            <!--Go forward or back one week-->
            <!-- TODO: unhide buttons once code to resend request to backend for a new week is done. -->
            <v-list-item>
              <v-btn
                fab
                small
                hidden
                absolute
                left
                :color="color"
                @click="$refs.calendar.prev()"
              >
                <v-icon dark>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                fab
                small
                absolute
                hidden
                right
                :color="color"
                @click="$refs.calendar.next()"
              >
                <v-icon dark>mdi-chevron-right</v-icon>
              </v-btn>
            </v-list-item>
            <!--Date Picker-->
            <v-list-item class="input-item">
              <v-menu
                ref="startMenu"
                v-model="startMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="start"
                transition="scale-transition"
                min-width="290px"
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="start"
                    class="mt-3"
                    label="Date"
                    prepend-icon="event"
                    dense
                    readonly
                    outlined
                    hide-details
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="start" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    :color="color"
                    @click="$refs.startMenu.save(today)"
                  >
                    Today
                  </v-btn>
                  <v-btn text :color="color" @click="startMenu = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    :color="color"
                    @click="$refs.startMenu.save(start)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-list-item>
          </v-card>

          <!--Calendar-->
          <v-sheet height="500">
            <v-calendar
              ref="calendar"
              v-model="start"
              :type="type"
              :start="start"
              :weekdays="weekdays"
              :color="color"
              :first-interval="intervals.first"
              :interval-count="intervals.count"
              :interval-minutes="intervals.minutes"
              :interval-height="intervals.height"
              :events="events"
              :event-overlap-mode="mode"
              :event-overlap-threshold="45"
            ></v-calendar>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
// TODO Turn each part of the view into components, as detailed above.
// TODO Use vuex to handle state
import { Vue, Component } from "vue-property-decorator";
import moment from "moment";
import DbService from "../services/dbService";
import { EventModel } from "../models/BindingModel";
import { Route } from "vue-router";

@Component
export default class LocationRoomView extends Vue {
  dbService = new DbService();

  params: any = [];

  locationId = ""; 
  roomId = ""; // TODO: modify to take actual current room name
  bookedNameText = "Occupied"; // Name of all bookings shown on calendar

  intervalsDefault = {
    // TODO First time slot buggy
    first: 6,
    // Minutes between each time slot
    minutes: 60,
    // How many slots
    count: 24 - 6,
    // Height of the individual time slots
    height: 48,
  };

  today = moment().format("YYYY-MM-DD");
  start = this.today;
  events: EventModel[] = [];
  type = "week";
  mode = "stack";
  weekdays = [1, 2, 3, 4, 5, 6, 0];
  intervals = this.intervalsDefault;
  color = "secondary";

  // initial state of time menu
  startMenu = false;

  // Get all bookings for the room in the given time range.
  async getEventsFromDb() {
    const startTime = moment().format("YYYY-MM-DD");
    const endTime = moment().format("YYYY-MM-DD");
    const result = await this.dbService.getRoomBookingsInTimeRange(
      this.locationId,
      this.roomId,
      startTime,
      endTime,
    );
    return result;
  }

  // Add name and colour to events
  async getEvents() {
    const allEvents: EventModel[] = [];

    const events = await this.getEventsFromDb();
    for (const event of events) {
      allEvents.push({
        name: this.bookedNameText,
        start: event.start,
        end: event.end,
        color: "",
      });
    }

    return allEvents;
  }

  async mounted() {
    this.locationId = this.$route.params["locationId"];
    this.roomId = this.$route.params["roomId"];
    if (this.roomId == null) this.roomId = "";
    this.events = await this.getEvents();
  }
}
</script>

<style scoped>
.control-card {
  margin-right: 20px;
  width: 100%;
  margin-bottom: 10px;
}

.input-item {
  padding-bottom: 20px;
}
</style>

<style>
.v-btn--fab.v-size--default {
  height: 30px;
  width: 30px;
}
</style>
