<template>
  <div id="app">
    <v-app>
      <Toolbar />
      <v-main>
        <BreadCrumbs class="mt-1" />
        <router-view></router-view>
      </v-main>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BreadCrumbs from "./components/BreadCrumbs.vue";
import Toolbar from "./components/Toolbar.vue";

@Component({
  components: {
    Toolbar,
    BreadCrumbs,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: var(--v-background-base) !important;
}

a {
  text-decoration: none;
  font-weight: bold;
}

/* scroll bar styling */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--v-info-base);
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 1rem;
  background-color: var(--v-primary-base);
  background-image: linear-gradient(
    to top,
    var(--v-tertiary-base) 0%,
    var(--v-primary-base) 100%
  );
}
</style>
