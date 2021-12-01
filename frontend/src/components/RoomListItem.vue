<template>
  <router-link
    :to="{
      name: 'room',
      params: {
        locationId,
        roomId: room.name,
        datetime: date,
      },
    }"
  >
    <v-card class="background" flat>
      <v-card-title class="text-left">
        <v-icon :color="getCalendarIconColor(room.status)" class="mr-5"
          >event_available</v-icon
        >
        <div style="width:70px">{{ room.name }}</div>
        <v-divider vertical class="mx-5"></v-divider>
        {{ getAvailabilityText(room.status, room) }}
      </v-card-title>
    </v-card>
  </router-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Room, RoomStatus } from "../types";
import { DateTime } from "luxon";

@Component
export default class RoomListItem extends Vue {
  @Prop(Object) readonly room!: Room;
  @Prop(String) readonly locationId!: string;
  @Prop(String) readonly time!: string;
  @Prop(String) readonly date!: string;

  // Get calendar markdown icon color depending on a room's availability.
  getCalendarIconColor(available: RoomStatus): string {
    switch (available) {
      case "free":
        return "success";
      case "soon":
        return "orange";
      case "busy":
        return "error";
      default:
        return "error";
    }
  }

  getAvailabilityText(available: RoomStatus): string {
    // ! Not setting AM/PM format - Currently in 24hr format
    const date = DateTime.fromISO(this.room.classEndTime, {
      setZone: true,
    });
    switch (available) {
      case "free":
        return "Available now";
      case "soon":
        return `Available after ${date.toLocaleString(DateTime.TIME_SIMPLE)}`;
      case "busy":
        return "Unavailable now";
      default:
        return "Unavailable now";
    }
  }
}
</script>
