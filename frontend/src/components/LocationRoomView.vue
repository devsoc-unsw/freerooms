<template>
    <div class="location-room-view">
        <v-row
          no-gutters
          align="center"
          justify="center"

        >
        <v-col 
          lg="3"
          fluid
          justify="center"
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
              width="250px"
              src="../assets/building_photos/Tyree.png"
              gradient="to bottom, rgba(250,172,78,.25), rgba(180,82,49,.33)"
            ></v-img>
            <v-card-title class="text-center">
              Location {{index}}
            </v-card-title>
          </v-card>
        </v-col>
        <v-col>
          <v-row>
            <!-- Booked class -->
            <v-col v-for="(n, index) in 20"
              :key="n"
              class="ma-3" 
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
            <v-col class="ma-3" min-width="50px">
              <v-tooltip top>
              <template v-slot:activator="{ on }">
                <router-link :to="{name: 'room', params: { locationId : locationId, roomId: 3}}">
                  <v-card
                    class="info primary--text"
                    flat
                    v-on="on"
                  >
                    <v-card-title class="text-center">
                      Room 3 <v-icon color="primary" right>event_busy</v-icon>
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
