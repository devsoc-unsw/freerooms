<template>
  <v-switch
    v-model="$vuetify.theme.dark"
    label="Dark mode"
    inset
    hide-details
    persistent-hint
  ></v-switch>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class ThemeButton extends Vue {}
</script>
