<template>
  <v-select
    v-model="syncedSelected"
    :items="sortOptions"
    :label="label"
    @item-value="syncedSelected"
    @change="$emit('onChange')"
    return-object
  ></v-select>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component
export default class SortFilter extends Vue {
  @Prop(Function) onChange;
  @Prop(String) readonly label;
  @Prop(Array) readonly sortOptions: string[];
  @PropSync("selected", { type: String }) syncedSelected!: string;
}
</script>
