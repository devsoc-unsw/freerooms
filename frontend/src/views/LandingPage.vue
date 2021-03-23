<template>
  <div class="room-view">
    <v-row no-gutters align="start">
      <v-col
        v-for="(n, index) in buildings"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        align="center"
        class="py-3 px-5"
      >
        <router-link
          :to="{ name: 'locationRoom', params: { locationId: index } }"
        >
          <v-card class="primary white--text text-center" flat>
            <!--TODO assign image programatically-->
            <v-img
              class="white--text align-end"
              height="200px"
              width="100%"
              src="../assets/building_photos/Tyree.png"
              gradient="to bottom, rgba(250,172,78,.25), rgba(180,82,49,.33)"
            ></v-img>
            <v-card-title class="text-center"> {{ n }} </v-card-title>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import LocationService from "../services/locationService";

@Component
export default class LandingPage extends Vue {
  service = new LocationService();

  buildings = [];

  mounted() {
    this.buildings = this.service.getAllBuildings();
  }
}
</script>

<style scoped></style>
