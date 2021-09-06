<template>
  <v-dialog
    ref="timeDialog"
    v-model="syncedModal"
    @return-value="syncedTime"
    width="290px"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="syncedTime"
        label="Choose time"
        prepend-icon="schedule"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker mode="time" v-model="syncedTime" scrollable>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="syncedModal = false">Cancel</v-btn>
      <v-btn
        text
        color="primary"
        @click="
          $refs.timeDialog.save(syncedTime);
          $emit('onChange');
        "
        >OK</v-btn
      >
    </v-time-picker>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component
export default class TimePicker extends Vue {
  @Prop(Function) onChange;
  @PropSync("modal", { type: Boolean }) syncedModal!: boolean;
  @PropSync("time", { type: String }) syncedTime!: string;
}
</script>
