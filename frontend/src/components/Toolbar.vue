<template>
  <v-app-bar app outlined color="background">
    <router-link
      :to="{
        name: 'locations',
      }"
    >
      <v-toolbar-title class="mr-2 font-weight-medium primary--text">
        <v-app-bar-nav-icon>
          <AnimateLogo />
        </v-app-bar-nav-icon>
        FreeRooms
      </v-toolbar-title>
    </router-link>
    <p class="ma-0 text-sm-subtitle-1 primary--text">
      22T1
    </p>
    <v-spacer></v-spacer>
    <FeedbackButton />
    <v-btn icon @click="infoModal = true">
      <v-icon color="primary">mdi-information</v-icon>
    </v-btn>
    <InfoDialog v-if="infoModal" :modal.sync="infoModal" />
    <ThemeButton />
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ThemeButton from "./ThemeButton.vue";
import AnimateLogo from "./AnimateLogo.vue";
import FeedbackButton from "./FeedbackButton.vue";
import InfoDialog from "./InfoDialog.vue";

@Component({
  components: {
    ThemeButton,
    AnimateLogo,
    FeedbackButton,
    InfoDialog,
  },
})
export default class Toolbar extends Vue {
  infoModal = false;
}
</script>

<style scoped>
.v-toolbar__title {
  font-size: 1.75em;
}
</style>
