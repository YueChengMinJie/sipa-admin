<template>
  <div class="nav-wrapper flex justify-between align-center">
    <div class="left-menu">
      <!-- <a-icon
        :type="collapsed ? 'menu-fold' : 'menu-unfold'"
        class="nav-fold boxHover"
        @click="toggleOpen"
        v-show="!horizontal"
      /> -->
      <!-- <image-icon icon="nav/dpadLogo" width="79" height="31"></image-icon> -->
      <span class="title">流程中台-流程管理</span>
      <!-- <div class="bread-crumb-warp">
        <bread-crumb v-show="!horizontal" />
      </div> -->
    </div>
    <div class="right-menu flex">
      <!-- <div @click.stop="screenFull" class="pointer boxHover fullscreen-icon">
        <svg-icon :icon="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" :size="14" />
      </div> -->
      <!-- <a-tooltip placement="bottom">
        <template slot="title">
          主题配置
        </template>
        <div class="right-menu-item pointer boxHover" @click="changeVisible">
          <svg-icon icon="color" :size="18" />
        </div>
      </a-tooltip> -->

      <!-- <div class="right-menu-item pointer boxHover" style="margin-right:15px" @click="toNotice">
        <a-badge :count="count" :overflow-count="99" :offset="[3, -4]">
          <svg-icon icon="bell" :size="18" />
        </a-badge>
      </div> -->
      <nav-user class="right-menu-item pointer boxHover flex-sub" @changePassword="changePassword" />
    </div>
  </div>
</template>

<script>
import navUser from './navUser';
import screenfull from 'screenfull';
// import breadCrumb from './breadCrumb.vue';

export default {
  name: 'navBar',
  props: {
    collapsed: {
      type: Boolean,
      default: true
    },
    horizontal: {
      type: Boolean,
      default: false
    }
  },
  components: { navUser },
  data() {
    return {
      count: 6,
      isFullscreen: false
    };
  },
  methods: {
    toggleOpen() {
      this.$store.commit('setting/TOGGLE_OPEN');
    },
    screenFull() {
      if (!screenfull.isEnabled) {
        this.$message.warning('不好意思，你的电脑不支持全屏，赶紧换个电脑吧，谢谢~');
        return false;
      }
      screenfull.toggle();
      this.isFullscreen = !this.isFullscreen;
    },
    changeVisible() {
      this.$store.dispatch('setting/changeVisible', true);
    },
    toNotice() {
      this.count = 0;
      this.$router.push({
        name: 'userInfo',
        params: {
          key: 'noticePage'
        }
      });
    },
    changePassword() {
      this.$emit('changePassword');
    }
  }
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
  height: 54px; /*no*/
  overflow: hidden;
  position: relative;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .boxHover {
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .nav-fold {
    padding: 0 20px; /*no*/
    height: 100%;
    cursor: pointer;
    font-size: 16px;
    line-height: 58px; /*no*/
    transition: all 0.3s, padding 0s;
  }

  .menu-icon {
    // margin: 0 14px;
    margin-left: 26px;
    margin-right: 8px;
    cursor: pointer;
  }

  .title {
    height: 31px;
    line-height: 31px;
    font-weight: 500;
    color: #333333;
    font-size: 16px;
  }

  .right-menu {
    height: 100%;

    .right-menu-item {
      height: 100%;
      line-height: 54px; /*no*/
    }
  }
}

.fullscreen-icon {
  height: 100%;
  display: flex;
  align-items: center;
}

.right-menu.flex {
  display: flex;
  align-items: center;
}

.left-menu {
  display: flex;
  margin-left: 20px;

  .bread-crumb-warp {
    padding: 0 20px;

    ::v-deep .ant-breadcrumb {
      font-size: 14px;
      line-height: 54px;
    }
  }
}
</style>
