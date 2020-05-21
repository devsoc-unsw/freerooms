<template>
  <div id="app">
    <v-app>
      <v-app-bar
        app
        color="primary"
        dark
      >
      
      </v-app-bar>

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

  @Component({
    components: {
      BreadCrumbs
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
  color: #2c3e50;
  margin-top: 60px;
  background-color: #f7f7ff; 
}

a {
  text-decoration: none;
  font-weight: bold;
}
</style>
