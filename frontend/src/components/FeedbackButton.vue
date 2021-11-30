<template>
  <div>
    <button class=feedback @click="gotoGoogle()">FEEDBACK</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
 @Component
export default class FeedbackButton extends Vue {
    gotoGoogle() {
        window.open("https://forms.gle/T9pFovpn2sWSymEY6");
    }
}
</script>

<style scoped>
.feedback {
  font-size: 14px;
  padding-right: 1vw;
}
</style>

