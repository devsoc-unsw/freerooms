<template>
    <div class="location-room-view">
        <!-- Header, Building Id -->
        <v-row
          justify="left"
          align="center"
          class="mx-0 px-0 primary"
        >
          <v-spacer></v-spacer>
          <v-col 
            cols=12
            sm=3
            align="right"
            class="py-5"
          >
            <v-img
              src="../assets/building_photos/Tyree.png"
              gradient="to bottom, rgba(250,172,78,.25), rgba(180,82,49,.33)"
            ></v-img>
          </v-col>
          <v-spacer></v-spacer>
          <v-col
            cols=12
            sm=6
            align="left"
            class="white--text"
          >
            <div>
              <span class="display-2">Building McBuildingFace</span><br>
              <span class="display-1">K-J12</span><br>
              <span class="body-1">30 Rooms Listed</span><br>
              <span class="body-1">10 Currently Available</span><br>
              <span class="body-1">15 Available in the Next Hour</span><br>
            </div>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        <!-- Room List -->
          <v-row
            class="mx-0 mt-4"
            align="center"
            justify="center"
            v-for="(n, index) in 9"
            :key="n"
          >
          <v-spacer></v-spacer>
          <v-col 
            cols="12" 
            sm="10"
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
          <v-spacer></v-spacer>
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
