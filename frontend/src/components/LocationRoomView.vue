<template>
    <div class="location-room-view">
        Route: {{msg}}
        params: {{params}}
        <v-row
          no-gutters
          align="center"
          justify="center"
          style="height: 300px;"
        >
          <!-- Booked class -->
          <div v-for="(n, index) in 10"
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
          </div>

          <!-- Currently booked class -->
          <div class="ma-3">
            <router-link :to="{name: 'room', params: { locationId : locationId, roomId: 3}}">
              <v-card
                class="info primary--text"
                flat
              >
                <v-card-title class="text-center">
                  Room 3 <v-icon color="primary" right>event_busy</v-icon>
                </v-card-title>
              </v-card>
            </router-link>
          </div>

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
