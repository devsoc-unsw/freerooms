<template>
    <div class="RoomView">
      <v-container>
        <v-row           
          no-gutters
          align="start"
          justify="center"
        >
          <v-col cols="12">
            <v-card class="control-card">
              <v-list-item>
                <v-btn
                  fab
                  small
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
                  right
                  :color="color"
                  @click="$refs.calendar.next()"
                >
                  <v-icon dark>mdi-chevron-right</v-icon>
                </v-btn>
              </v-list-item>
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
                <v-date-picker
                  v-model="start"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    :color="color"
                    @click="$refs.startMenu.save(today)"
                  >
                    Today
                  </v-btn>
                  <v-btn
                    text
                    :color="color"
                    @click="startMenu = false"
                  >
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

            <v-sheet height="500">
              <v-calendar
                ref="calendar"
                v-model="start"
                :type="type"
                :start="start"
                :weekdays="weekdays"
                :color = "color"
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
  // We should look into spliting up the menu and the calendar into different components
  // and using vuex to handle state control. Was Ceebs doing that so the html tags are cancer to read now...
  import { Vue, Component } from 'vue-property-decorator';
  import moment from 'moment';
  import DbService from '../services/dbService';

  @Component
  export default class LocationRoomView extends Vue {  
    dbService = new DbService();

    params: any = [];

    roomName = ''; //TODO: modify to take actual current room name
    bookedNameText = 'Occupied'; // Name of all bookings shown on calendar 

    intervalsDefault = {
      // first time slot
      first: 6,
      // num of mins betwween time slots
      minutes: 60,
      // how many slots
      count: 24-6,
      // height of the individual time slots
      height: 48,
    }

    today = moment().format('YYYY-MM-DD');
    start = this.today;
    events = [];
    type = 'week';
    mode = 'stack';
    weekdays = [1,2,3,4,5,6,0];
    intervals = this.intervalsDefault;
    color = 'secondary';

    // initial state of time menu
    startMenu = false;

    // Get all bookings for the room in the given time range.
    getEvents () {
      const gEvents = [];

      const events = this.getEventsFromDb();
      for (const event of events) {
        gEvents.push({
          name: this.bookedNameText,
          start: event.start,
          end:  event.end,

        });
      }
      
      return gEvents;
    }

    getEventsFromDb() {
      const startTime = moment().format('YYYY-MM-DD');
      const endTime = moment().format('YYYY-MM-DD');
      const result = this.dbService.getRoomBookingsInTimeRange(this.roomName, startTime, endTime);
      return result;
    }

    mounted() {
      this.events = this.getEvents();
      this.params = this.$route.params;
      this.roomName = this.params['roomId'];
      if (this.roomName == null) this.roomName = '';
    }
  }
</script>


<style scoped>
  .control-card {
    margin-right: 20px;
    width:100%;
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
