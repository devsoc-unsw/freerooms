<template>
    <v-app-bar
    app
    flat
    color="accent"
    >
    <v-img
    max-height="50px"
    max-width="50px"
    src="../assets/favicon/free_rooms_logo.png"
    ></v-img>
    <v-toolbar-title class="ml-3 mt-1 font-weight-medium tertiary--text">
    FreeRooms
    </v-toolbar-title>

    </v-app-bar>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class Toolbar extends Vue {
  }
</script>


<style scoped>
</style>
