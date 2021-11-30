<template>
  <v-app-bar app outlined color="background">
    <v-app-bar-nav-icon>
      <router-link
        :to="{
          name: 'locations',
        }"
      >
        <AnimateLogo />
      </router-link>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="ml-3 mt-1 font-weight-medium primary--text">
      Freerooms
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <FeedbackButton />
    <v-dialog v-model="infoModal" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-bind="attrs" v-on="on">
          <font-awesome-icon :icon="['fas', 'info-circle']" />
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Welcome to Freerooms!
        </v-card-title>
        <v-card-text>
          <p>
            Freerooms is a tool helping UNSW students find their dream study
            location on campus. We have many features on the way,
            including a map with the real-time availabilities of each room in a
            UNSW building. It was created by CSESoc Projects - a place for
            student-led projects where you can learn something new and make some
            friends along the way. FreeRooms is free and open-source.
          </p>
          <p class="list">
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
          <p class="list">
            Features:
            <ul>
              <li>Plan ahead with our calendar, and have regular weekly meetings with your study groups!</li>
              <li>Dark mode 😎</li>
            </ul>
          </p>
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
    <theme-button />
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ThemeButton from "./ThemeButton.vue";
import AnimateLogo from "./AnimateLogo.vue";
import FeedbackButton from "./FeedbackButton.vue";

@Component({
  data() {
    return {
      infoModal: ""
    };
  },
  components: {
    ThemeButton,
    AnimateLogo,
    FeedbackButton,
  },
})
export default class Toolbar extends Vue {}
</script>

<style scoped>
.v-toolbar__title {
  font-size: 20pt;
}

p {
  padding-top: 1vh;
}

.list {
  text-align: left;
}
</style>
