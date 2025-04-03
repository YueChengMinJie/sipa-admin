<template functional>
  <a-menu-item
    :key="props.currentRoute.path"
    v-if="!props.currentRoute.hidden"
    :class="{
      'first-menu-title-before': props.currentRoute.meta.level === 'first',
      'else-menu-title-before': props.currentRoute.meta.level !== 'first'
    }"
  >
    <router-link :to="props.currentRoute.path">
      <svg-icon
        v-if="props.currentRoute.meta.icon && props.currentRoute.meta.level !== 'first'"
        :icon="props.currentRoute.meta.icon"
        :size="21"
      >
      </svg-icon>
      <svg-icon
        v-if="props.currentRoute.meta.icon && props.currentRoute.meta.level === 'first'"
        :icon="props.currentRoute.meta.icon"
        :size="21"
      >
      </svg-icon>
      <!-- <div v-if="!props.currentRoute.meta.icon" class="menu-title-before"></div>
      <div v-if="props.currentRoute.meta.level" class="three-menu-title-before"></div> -->
      <span
        class="menu-title"
        :class="{
          'menu-title-before': !props.currentRoute.meta.icon || props.currentRoute.meta.level === 'first',
          'three-menu-title-before': props.currentRoute.meta.level === 'three'
        }"
        >{{ props.currentRoute.meta.title }}</span
      >
    </router-link>
  </a-menu-item>
</template>

<script>
export default {
  name: 'menuItem',
  props: {
    currentRoute: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-title {
  font-size: 15px; /*no*/
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  line-height: 17px; /*no*/
}

::v-deep .ant-menu-item {
  padding: 0 !important;
  text-align: center;
}

.menu-title-before {
  padding-left: 16px; /*no*/
}

.three-menu-title-before {
  padding-left: 30px; /*no*/
}

.side-wrapper-test {
  ::v-deep .menu-title {
    margin-left: 13px !important; /*no*/
  }
}
</style>
