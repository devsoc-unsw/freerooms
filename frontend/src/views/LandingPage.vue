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
              FreeRooms is a tool helping UNSW students find their dream study
              location within the campus. We have many features on the way,
              including a map with the real-time availabilities of each room in a
              UNSW building. It was created by CSESoc Projects - a place for
              student-led projects where you can learn something new and make some
              friends along the way. FreeRooms is free and open-source.
            </p>
            <p>
              Expand to read more!
            </p>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>
            How it works:
            <ul>
              <li>
                Click on a building you want to study at and the availabilities of different rooms in that building will be listed on the page.
              </li>
              <li>
                If you want to see the availability of the room over a week, click on the calendar icon next to the room.
              </li>
              <li>
                If you want to plan your university day, you can change the time and day to see the availability of rooms in the future.
              </li>
            </ul>
          </p>
          <p>
            Features:
            <ul>
              <li>Plan ahead with our calendar, and have regular weekly meetings with your study groups!</li>
              <li>Dark mode 😎</li>
            </ul>
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
