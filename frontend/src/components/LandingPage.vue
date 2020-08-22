<template>
    <div class="room-view">
        <v-row
          no-gutters
          align="start"

        >
          <v-col v-for="(n, index) in 10"
            :key="n"
            cols="12"
            sm="5"
            lg="3"
            align="center"
            class="py-3 px-5"
          >
            <router-link :to="{name: 'locationRoom', params: { locationId : index }}">
              <v-card
                class="primary white--text text-center"
                flat
              >
                <v-img
                  class="white--text align-end"
                  height="200px"
                  width="100%"
                  src="../assets/building_photos/Tyree.png"
                  gradient="to bottom, rgba(250,172,78,.25), rgba(180,82,49,.33)"
                ></v-img>
                <v-card-title class="text-center">
                  Location {{index}}
                </v-card-title>
              </v-card>
            </router-link>

          </v-col>
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
