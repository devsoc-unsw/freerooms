<template>
    <div class="location-room-view">
        <!-- Header, Building Id -->
        <v-card class="primary mx-5" style="border-radius:10px">
          <v-row align="center" justify="left">
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
                Building McBuildingFace
              </p>
              <p class="display-1 white--text mb-5 ml-1" align="left">K-J12</p>
              <p class="subtitle-1 white--text ml-1" align="left">
                30 Rooms Listed<br>10 Currently Available<br>15 Available in the Next Hour
              </p>
            </v-col>
          </v-row>
        </v-card>

        <!-- Filters -->
        <v-row 
          class="mx-5 mt-5"
          align="end">
          <!-- Sort -->
          <v-col cols="12" sm="4" md="2" class="py-0 my-0">
            <v-select
              :items="sort_options"
              label="Sort"
              :value="sort_options[0]"
            ></v-select>
          </v-col>
          <!-- Hide Unavailable -->
          <v-col cols="12" sm="6" class="py-0 my-0 pl-1">
            <v-switch v-model="enabled" class="ma-2" label="Show Unavailable"></v-switch>
          </v-col>
          <v-spacer></v-spacer>
          <!-- Date -->
          <v-col cols="12" sm="4" md="2" class="py-0 my-0">
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
          <v-col cols="12" sm="4" md="2" class="py-0 my-0">
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
          justify="center"
          v-for="(n, index) in 4"
          :key="n"
        >
          <v-col 
            cols="12" 
            class="pa-0 ma-0"
          >
            <v-divider></v-divider>
            <router-link :to="{name: 'room', params: { locationId : locationId, roomId: index}}">
              <v-card
                class="background"
                flat
              >
                <v-card-title class="text-left">
                  <v-icon color="success" class="mr-5">event_available</v-icon>
                  <span> Room {{index}} </span>
                  <v-divider vertical class="mx-5"></v-divider>
                  Available Until 13:00
                </v-card-title>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
        <!-- Currently Unavailable but available later -->
        <v-row
          class="mx-5 mt-4"
          align="center"
          justify="center"
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
        <!-- Unavailable Today -->
        <v-row
          class="mx-5 mt-4"
          align="center"
          justify="center"
        >
          <v-col 
            cols="12" 
            class="pa-0 ma-0"
          >
            <v-divider></v-divider>
            <router-link :to="{name: 'room', params: { locationId : locationId, roomId: 5}}">
              <v-card
                class="background"
                flat
              >
                <v-card-title class="text-left">
                  <v-icon color="error" class="mr-5">event_busy</v-icon>
                  <span> Room 5 </span>
                  <v-divider vertical class="mx-5"></v-divider>
                  Unavailable Today
                </v-card-title>
              </v-card>
            </router-link>
          </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class LocationRoomView extends Vue {
      msg = "";
      params: any = null;
      locationId = 0;
      enabled="true"
      sort_options = ['Name', 'Available'];
      time_options = ['Now', '9:00', '9:30', '10:00', '10:30'];

      date= new Date().toISOString().substr(0, 10);
      menu= false;
      modal= false;
      menu2= false;


      mounted() {
          this.msg = this.$route.path;
          this.params = this.$route.params;
          this.locationId = this.params['locationId'];
      }
  }
</script>

<style scoped>

</style>
