<template>
  
    <v-dialog v-model="infoModal" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color='primary'>mdi-information</v-icon>
        </v-btn>
      </template>

      <v-card outlined>
        <v-card-title class="text-h5 primary--text justify-center">
          Welcome to FreeRooms!
        </v-card-title>
        <v-divider/>
        <v-card-text>
          <p>
            <b>FreeRooms</b> is a tool helping UNSW students find their dream study
            location on campus. We have many features on the way,
            including a map with the real-time availabilities of each room in a
            UNSW building. It was created by CSESoc Projects - a place for
            student-led projects where you can learn something new and make some
            friends along the way. FreeRooms is free and open-source.
          </p>
          <p class="list">
            <b>How it works:</b>
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
          <p class="list">
            <b>Features:</b>
            <ul>
              <li>Plan ahead with our calendar, and have regular weekly meetings with your study groups!</li>
              <li>Dark mode 😎</li>
            </ul>
          </p>
          <p><b>NOTE:</b> Currently can only check Term 1, 2022 data</p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="infoModal = false"
              class="open-modal"
            >
              Close
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  data() {
    return {
      infoModal: ""
    };
  }
})
export default class AboutDialog extends Vue {}
</script>

<style scoped>
p {
  padding-top: 1vh;
}

.list {
  text-align: left;
}
</style>
