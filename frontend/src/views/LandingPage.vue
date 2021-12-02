<template>
  <div class="room-view">
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
          <v-card class="primary white--text text-center card">
            <v-img
              class="white--text align-end"
              height="12.5em"
              width="100%"
              :src="`./assets/building_photos/${buildingData.id}.png`"
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

<style scoped>
.heading {
  width: 45vw;
  text-align: center;
}

p {
  width: 25vw;
  text-align: left;
  color: white;
  line-height: 1.2em;
}

.beta {
  font-size: 0.4em;
  font-weight: 300;
}

.card:hover {
  opacity: 0.9;
}
</style>
