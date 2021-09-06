<template>
  <v-switch
    v-model="syncedEnabled"
    :label="label"
    @change="$emit('onChange')"
    class="ma-2"
  ></v-switch>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component
export default class ToggleFilter extends Vue {
  @Prop(Function) onChange!: Function;
  @Prop(String) readonly label!: string;
  @PropSync("enabled", { type: Boolean }) syncedEnabled!: boolean;
}
</script>
