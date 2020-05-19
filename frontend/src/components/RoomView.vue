<template>
    <div class="room-view">
        Route: {{msg}}
        params: {{params}}
        <v-row
          align="end"
          justify="center"
          class="grey lighten-5"
          style="height: 300px;"
        >
          <v-card
            v-for="n in 3"
            :key="n"
            class="ma-3 pa-6"
            outlined
            tile
          >
            Room View
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
      mounted() {
          this.msg = this.$route.path;
          this.params = this.$route.params;
      }
  }
</script>


<style scoped>

</style>
