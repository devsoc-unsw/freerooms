<template>
  <v-dialog
    ref="dateDialog"
    v-model="syncedModal"
    @return-value="syncedDate"
    width="290px"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="syncedDate"
        label="Choose date"
        prepend-icon="event"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <!-- TODO: Change hardcoded date values every term -->
    <v-date-picker
      mode="date"
      v-model="syncedDate"
      min="2022-02-15"
      max="2022-05-13"
      scrollable
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="syncedModal = false">Cancel</v-btn>
      <v-btn
        text
        color="primary"
        @click="
          $refs.dateDialog.save(syncedDate);
          $emit('onChange');
        "
        >OK</v-btn
      >
    </v-date-picker>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component
export default class DatePicker extends Vue {
  @Prop(Function) onChange!: Function;
  @PropSync("modal", { type: Boolean }) syncedModal!: boolean;
  @PropSync("date", { type: String }) syncedDate!: string;
}
</script>
