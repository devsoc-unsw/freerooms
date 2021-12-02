<template>
  <v-btn
    v-model="$vuetify.theme.dark"
    icon
    persistent-hint
    @click="$vuetify.theme.dark = !$vuetify.theme.dark"
  >
    <v-icon color="primary">{{ getIcon($vuetify.theme.dark) }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ThemeButton extends Vue {
  getIcon(darkMode: boolean) {
    if (darkMode) {
      return "mdi-brightness-2";
    } else {
      return "mdi-white-balance-sunny";
    }
  }
}
</script>
