<template>
  <div class="side-wrapper">
    <logo :collapse="collapsed" />
    <scroll-bar class="side-main">
      <a-menu
        :mode="mode"
        :inline-collapsed="!collapsed"
        theme="dark"
        :selectedKeys="[isActivePath]"
        :open-keys="openKeys"
        @openChange="changeOpen"
      >
        <template v-for="item in baseRoute">
          <menu-item v-if="!item.children && !item.hidden" :key="item.path" :currentRoute="item" />
          <template v-else v-for="temp in item.children">
            <menu-item v-if="!temp.children" :key="temp.path" :currentRoute="temp" />
            <sub-menu v-else :key="temp.path" :currentRoute="temp"></sub-menu>
          </template>
        </template>
      </a-menu>
    </scroll-bar>
  </div>
</template>

<script>
import logo from './logo';
import subMenu from './subMenu';
import menuItem from './menuItem';
import { mapGetters } from 'vuex';

export default {
  name: 'sideBar',
  props: {
    collapsed: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String,
      default: 'inline'
    }
  },
  components: { logo, subMenu, menuItem },
  data() {
    return {
      openKeys: []
    };
  },
  computed: {
    ...mapGetters(['baseRoute']),
    isActivePath() {
      const { meta, path } = this.$route;
      if (meta && meta.isDetail) {
        return `/${meta.parentPath}`;
      }
      return path;
    }
  },
  mounted() {
    let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
    if (matched.length > 1) {
      this.openKeys = matched.map(item => item.path);
    }
  },
  methods: {
    changeOpen(keys) {
      const currentOpenKey = keys.find(key => this.openKeys.indexOf(key) === -1);
      const children = this.baseRoute.filter(item => item.children);

      if (children[0].children.findIndex(item => item.path == currentOpenKey) === -1) {
        this.openKeys = keys;
      } else {
        this.openKeys = currentOpenKey ? [currentOpenKey] : [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .ant-menu-submenu-vertical > .ant-menu-submenu-title {
  width: 60px !important; /*no*/
}

::v-deep .ant-menu-submenu .ant-menu-submenu-vertical > .ant-menu-submenu-title {
  padding: 0 !important;
}

::v-deep .ant-menu-submenu .ant-menu-submenu-vertical {
  width: 60px !important; /*no*/
}

::v-deep .ant-menu-vertical .ant-menu-item {
  padding: 0 !important;
  display: flex;
  justify-content: center;
}

::v-deep .ant-menu-item {
  padding: 0 !important;
  text-align: center;

  a {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

::v-deep .ant-menu-submenu-arrow {
  right: 12px !important;
  width: 10px !important;
}

::v-deep .ant-menu.ant-menu-vertical.ant-menu-root.ant-menu-dark.ant-menu-inline-collapsed {
  width: 60px; /*no*/
  margin-right: 0 !important;
}

::v-deep .vertical.ant-menu-submenu.ant-menu-submenu-vertical > .ant-menu-submenu-title {
  padding: 0 !important;
  text-align: center;
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side-wrapper {
  ::v-deep .ant-menu-dark.ant-menu-inline .ant-menu-item.else-menu-title-before,
  .horizontalSide-wrapper.flex-sub .ant-menu-dark.ant-menu-inline .ant-menu-submenu-title {
    padding-left: 47px !important; /*no*/
    text-align: left !important;
    height: 40px; /*no*/
    margin: 0 !important;
  }

  ::v-deep .ant-menu-dark.ant-menu-inline .ant-menu-item.first-menu-title-before,
  .horizontalSide-wrapper.flex-sub .ant-menu-dark.ant-menu-inline .ant-menu-submenu-title {
    padding-left: 36px !important; /*no*/
    text-align: left !important;
    height: 40px; /*no*/
    margin: 0 !important;
  }

  ::v-deep .ant-menu-submenu-title {
    padding-left: 36px !important; /*no*/
    text-align: left;
    height: 40px !important; /*no*/
    display: flex;
    align-items: center;
  }
}
</style>
