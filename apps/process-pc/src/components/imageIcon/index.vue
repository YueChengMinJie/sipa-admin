<template>
  <img :src="imgSrc" class="imageIcon" :style="{ width: width + 'px', height: height + 'px' }" />
</template>

<script>
export default {
  name: 'imageIcon',
  props: {
    icon: {
      type: String,
      required: true
    },
    width: {
      default: 20
    },
    height: {
      default: 20
    }
  },
  data() {
    return {};
  },
  computed: {
    imgSrc() {
      let img = require('@/assets/' + this.icon + '.png');
      return img;
    }
  }
};
</script>

<style scoped>
.imageIcon {
  display: inline-block;
}
</style>
