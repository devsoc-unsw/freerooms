<template>
    <div class="room-view">
        hELLO WORLD
        <v-row
          align="start"
          justify="center"
          class="grey lighten-5"
          style="height: 300px;"
        >
          <v-card
            v-for="(n, index ) in 3"
            :key="n"
            class="ma-3 pa-6"
            outlined
            tile
          >
            Location {{index}}
          </v-card>
        </v-row>
    </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class Home extends Vue {
  }
</script>


<style scoped>

</style>
