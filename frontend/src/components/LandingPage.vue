<template>
    <div class="room-view">
        {{msg}}
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
            <router-link :to="{name: 'locationRoom', params: { locationId : index }}">Location {{index}}</router-link>
          </v-card>
        </v-row>
    </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';

  @Component
  export default class Home extends Vue {
      msg = "";
      mounted() {
          console.log("hello", this.$route.path);
          this.msg = this.$route.path;
      }
  }
</script>


<style scoped>

</style>
