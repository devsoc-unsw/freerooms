<template>
    <div class="location-room-view">
        Route: {{msg}}
        params: {{params}}
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
            <router-link :to="{name: 'room', params: { locationId : locationId, roomId: index}}">Room {{index}}</router-link>
          </v-card>
        </v-row>
    </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class LocationRoomView extends Vue {
      msg = "";
      params = {};
      locationId = 0;
      mounted() {
          console.log("hello", this.$route.path);
          this.msg = this.$route.path;
          this.params = this.$route.params;
          this.locationId = this.params['locationId'];
      }
  }
</script>


<style scoped>

</style>
