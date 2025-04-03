<template functional>
  <a-sub-menu :key="props.currentRoute.path" class="vertical">
    <template slot="title">
      <svg-icon :icon="props.currentRoute.meta.icon" v-if="props.currentRoute.meta.icon" :size="21"></svg-icon>
      <span style="margin-left:16px" class="menu-title">{{ props.currentRoute.meta.title }}</span>
    </template>
    <template v-for="item in props.currentRoute.children">
      <menu-item v-if="!item.children" :key="item.path" :currentRoute="item" />
      <sub-menu v-else :key="item.path" :currentRoute="item" />
    </template>
  </a-sub-menu>
</template>

<script>
import menuItem from './menuItem';

export default {
  name: 'subMenu',
  components: { menuItem },
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
  font-weight: 400; /*no*/
  line-height: 17px; /*no*/
}

::v-deep .vertical.ant-menu-submenu.ant-menu-submenu-vertical > .ant-menu-submenu-title {
  padding: 0 !important;
}

::v-deep .ant-menu-item {
  padding: 0 !important;
  text-align: center;
}

::v-deep .ant-menu-submenu-popup {
  left: 61px !important; /*no*/
}

.vertical {
  ::v-deep .menu-title {
    margin-left: 13px !important; /*no*/
  }
}
</style>
