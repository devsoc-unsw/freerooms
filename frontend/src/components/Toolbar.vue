<template>
  <v-app-bar app floating outlined color="background">
    <v-app-bar-nav-icon>
      <router-link
        :to="{
          name: 'locations',
        }"
      >
        <v-img
          max-height="50px"
          max-width="50px"
          src="../assets/favicon/free_rooms_logo.png"
        ></v-img>
      </router-link>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="ml-3 mt-1 font-weight-medium primary--text">
      FreeRooms
    </v-toolbar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Toolbar extends Vue {}
</script>

<style scoped>
.v-toolbar__title {
  font-size: 20pt;
}
</style>
