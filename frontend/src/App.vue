<template>
  <div id="app">
    <v-app>
      <Toolbar />
      <v-content>
        <BreadCrumbs />
        <router-view></router-view>
      </v-content>
    </v-app>
  </div>
</template>
 
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import BreadCrumbs from './components/BreadCumbs.vue';
  import Toolbar from './components/Toolbar.vue';

  @Component({
    components: {
      BreadCrumbs,
      Toolbar
    }
  })
  export default class App extends Vue {
    
    
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    /* color: #2c3e50; */
    background-color: #f7f7ff; 
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
    background-image: linear-gradient(to top, var(--v-tertiary-base) 0%, var(--v-primary-base) 100%);
  }
</style>
