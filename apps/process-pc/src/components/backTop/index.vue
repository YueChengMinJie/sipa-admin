<template>
  <div class="backTop">
    <a-back-top :visibilityHeight="320">
      <svg-icon icon="rocket" :size="24" />
    </a-back-top>
  </div>
</template>

<script>
export default {
  name: 'backTop',
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.backTop {
  ::v-deep .ant-back-top {
    background-color: #1890ff;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    bottom: 50px !important;
    right: 50px !important;
  }

  ::v-deep .svgClass {
    position: relative;
    top: 2px;
  }
}
</style>
