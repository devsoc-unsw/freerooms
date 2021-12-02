<template>
  <v-footer outlined class="footer">
    <div>
      <p>
        While we try our best, FreeRooms is not an official UNSW site, and
        cannot guarantee data accuracy or reliability.
      </p>
      <p>
        Made by >_ CSESoc UNSW
      </p>
      <a href="mailto:projects@csesoc.unsw.edu.au" target="#">Email</a>
      &nbsp;&nbsp;•&nbsp;&nbsp;
      <a href="https://forms.gle/T9pFovpn2sWSymEY6" target="#">Feedback</a>
      &nbsp;&nbsp;•&nbsp;&nbsp;
      <a href="https://github.com/csesoc/freerooms" target="#">Source</a>
    </div>
  </v-footer>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Footer extends Vue {}
</script>
<style scoped>
.footer {
  font-size: 12px;
  justify-content: center;
}
</style>
