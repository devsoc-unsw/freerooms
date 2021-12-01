<template>
  <div>
    <button @click="gotoGoogle()">
      <p
        v-if="$vuetify.breakpoint.width > 450"
        class="text-sm-subtitle-1 feedback ma-0"
      >
        FEEDBACK
      </p>
      <v-icon v-else-if="$vuetify.breakpoint.width > 400" color="primary"
        >mdi-comment-quote</v-icon
      >
    </button>
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
}
</style>
