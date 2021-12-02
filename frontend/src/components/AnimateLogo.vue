<template>
  <div>
    <img
      :src="pictureHover()"
      @mouseover="setHover(true)"
      @mouseleave="setHover(false)"
    />
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
@Component
export default class AnimateLogo extends Vue {
  name = "FreeRoomsLogo";
  pictureStatic = require("@/assets/favicon/free_rooms_logo.png");
  pictureGif = require("@/assets/favicon/free_rooms_logo.gif");
  hover = false;
  pictureHover() {
    if (this.hover == true) {
      return this.pictureGif;
    } else {
      return this.pictureStatic;
    }
  }
  setHover(newHover) {
    this.hover = newHover;
  }
}
</script>

<style scoped>
img {
  height: 50px;
}
</style>
