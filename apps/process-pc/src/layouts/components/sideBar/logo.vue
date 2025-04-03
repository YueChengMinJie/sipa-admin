<template>
  <router-link to="/" class="logo-wrapper ">
    <svg-icon icon="devicelink" class="verticalMiddle" :size="37" />
    <div class="logo-title verticalMiddle">流程中台</div>
  </router-link>
</template>

<script>
export default {
  name: 'logo',
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.box {
  height: 58px !important; /*no*/
}

::v-deep .ant-menu-item {
  padding: 0 !important; /*no*/
  text-align: center;
}
</style>
