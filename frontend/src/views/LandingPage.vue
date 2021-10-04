<template>
  <div class="room-view">
    <v-card
      class="primary mx-5 mb-10 pa-5"
      align="center"
      style="border-radius:10px"
    >
      <p class="display-2 white--text">
        Welcome to FreeRooms!
      </p>
      <div class="subtitle-1 white--text">
        <p>
          This is a tool to help students find vacant rooms across our UNSW
          campuses.
        </p>
        <p>
          Click one of the buildings below to find a free room :)
        </p>
      </div>
    </v-card>
    <v-row no-gutters align="start">
      <v-col
        v-for="buildingData in buildings"
        :key="buildingData.location"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        align="center"
        class="py-3 px-5"
      >
        <router-link
          :to="{
            name: 'locationRoom',
            params: { locationId: buildingData.id },
          }"
        >
          <v-card class="primary white--text text-center" flat>
            <v-img
              class="white--text align-end"
              height="12.5em"
              width="100%"
              :src="`./assets/building_photos/${buildingData.id}.png`"
              gradient="to bottom, rgba(250,172,78,.25), rgba(180,82,49,.33)"
            ></v-img>

            <v-card-title class="text-center">
              {{ buildingData.name }}
            </v-card-title>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DbService from "../services/dbService";
import { BuildingData } from "../types";

@Component
export default class LandingPage extends Vue {
  service = new DbService();

  buildings: BuildingData[] = [];

  async mounted() {
    this.buildings = await this.service.getAllBuildings();
  }
}
</script>

<style scoped></style>
