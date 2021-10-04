<template>
  <div class="room-view">
    <v-expansion-panels class="pa-5 my-3" align="center">
      <v-expansion-panel class="primary pa-5" style="border-radius:10px">
        <!-- 
        TODO: Header is the text that will display before expansion, you can move the text around to see what is most appropriate.
      -->
        <v-expansion-panel-header class="d-flex flex-column">
          <p class="display-2 white--text ma-0 pa-5">
            Welcome to FreeRooms!
          </p>
          <div class="subtitle-3 white--text" align="center">
            <p>
              This is a tool to help students find vacant rooms across our UNSW
              campuses.
            </p>
            <p>
              Expand to read more info about us :)
            </p>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p class="subtitle-3 white--text">
            Some random content
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
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
