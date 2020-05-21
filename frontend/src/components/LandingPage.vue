<template>
    <div class="room-view">
        {{msg}}
        <v-row
          no-gutters
          align="start"
          justify="center"
          style="height: 300px;"
        >
          <!-- Booked class -->
          <div v-for="(n, index) in 3"
            :key="n"
            class="ma-3" 
          >
            <router-link :to="{name: 'locationRoom', params: { locationId : index }}">
              <v-card
                class="primary white--text text-center"
                flat
              >
                <v-img
                  class="white--text align-end"
                  height="200px"
                  src="../assets/building_photos/download-1.jpg"
                  gradient="to top right, rgba(130,177,255,.5), rgba(25,118,210,.33)"
                ></v-img>
                <v-card-title class="text-center">
                  Location {{index}}
                </v-card-title>
              </v-card>
            </router-link>
          </div>
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
