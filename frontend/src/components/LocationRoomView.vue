<template>
    <div class="location-room-view">
        <v-row
          align="center"
          justify="left"
          class="mx-0 px-0"
        >
          <v-col 
            cols="12"
            lg="3"
            fluid
            align="center"
          >
            <v-card
              class="primary white--text text-center"
              flat
              height="300px"
              width="250px"
            >
              <v-img
                class="white--text align-end"
                height="200px"
                width="300px"
                src="../assets/building_photos/Tyree.png"
                gradient="to bottom, rgba(250,172,78,.25), rgba(180,82,49,.33)"
              ></v-img>
              <v-card-title class="text-center">
                Location {{index}}
              </v-card-title>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            lg="9"
          >
            <v-row
              align="center"

              class="pl-3 pr-3 pl-md-0"
            >
              <!-- Booked class -->
              <v-col v-for="(n, index) in 20"
                :key="n"
                cols="12"
                sm="5"
                lg="3"
              >
                <router-link :to="{name: 'room', params: { locationId : locationId, roomId: index}}">
                  <v-card
                    class="primary white--text"
                    flat
                  >
                    <v-card-title class="text-center"> Room {{index}} </v-card-title>
                  </v-card>
                </router-link>
              </v-col>

              <!-- Currently booked class -->
              <v-col
                cols="12"
                sm="5"
                lg="3"
              >
                <v-tooltip top>
                <template v-slot:activator="{ on }">
                <router-link :to="{name: 'room', params: { locationId : locationId, roomId: index}}">
                  <v-card
                    class="info primary--text"
                    flat
                    v-on="on"
                  >
                      <v-card-title class="text-center">
                        <v-icon color="primary" left>event_busy</v-icon>
                        Booked Boi
                      </v-card-title>
                  </v-card>
                </router-link>
                </template>
                <span>Room is currently booked.</span>
                </v-tooltip>
              </v-col>

            </v-row>
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
      mounted() {
          console.log("hello", this.$route.path);
          this.msg = this.$route.path;
          this.params = this.$route.params;
          this.locationId = this.params['locationId'];
      }
  }
</script>


<style scoped>

</style>
