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
      FreeRooms
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <theme-button />
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ThemeButton from "./ThemeButton.vue";
import AnimateLogo from "./AnimateLogo.vue";

@Component({
  components: {
    ThemeButton,
    AnimateLogo,
  },
})
export default class Toolbar extends Vue {}
</script>

<style scoped>
.v-toolbar__title {
  font-size: 20pt;
}
</style>
