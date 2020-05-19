<template>
    <div class="location-room-view">
        <v-row
          align="center"
          justify="center"
          class="grey lighten-5"
          style="height: 300px;"
        >
          <v-card
            v-for="(n, index) in 3"
            :key="n"
            class="ma-3 pa-6"
            outlined
            tile
          >
            Room {{index}}
          </v-card>
        </v-row>
    </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class LocationRoomView extends Vue {
  }
</script>


<style scoped>

</style>
