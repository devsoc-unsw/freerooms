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
              <h1 class="white--text" align="left">
                Building McBuildingFace
              </h1>
              <h2 class="white--text mb-5" align="left">K-J12</h2>
              <p class="white--text my-0 py-0" align="left">30 Rooms Listed</p>
              <p class="white--text my-0 py-0" align="left">10 Currently Available</p>
              <p class="white--text my-0 py-0" align="left">15 Available in the Next Hour</p>
            </v-col>
          </v-row>
        </v-card>

        <!-- Room List -->
        <v-row
          class="mx-5 mt-4"
          align="center"
          justify="center"
          v-for="(n, index) in 9"
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
                  <v-icon color="success" class="mr-5">event_busy</v-icon>
                  <span> Room {{index}} </span>
                  <v-divider vertical class="mx-5"></v-divider>
                  Available Until 13:00
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
      mounted() {
          this.msg = this.$route.path;
          this.params = this.$route.params;
          this.locationId = this.params['locationId'];
      }
  }
</script>


<style scoped>

</style>
