<template>
  <div class="all-container flex" :class="{ closeSide: !open, horizontal: horizontal }">
    <!-- <div class="bg" ref="watermarkLayout" :style="watermarkStyle"></div> -->
    <!-- 暂去掉菜单栏 -->
    <!-- <side-bar class="aside-container" :collapsed="open" v-if="!horizontal" /> -->
    <div class="main-container" :class="{ hasTag: tagShow }">
      <div :class="{ 'fixed-header': fixHeader }">
        <nav-bar :collapsed="open" v-if="!horizontal" @changePassword="changePassword" />
        <div v-else class="horizontal-nav flex">
          <horizontal-side />
          <nav-bar :horizontal="horizontal" class="nav-user" @changePassword="changePassword"></nav-bar>
        </div>
        <!-- <tag-view v-if="tagShow" /> -->
      </div>
      <setting />
      <!-- <div class="rightPanl fixed pointer" @click="changeVisivle">
        <a-icon type="setting" class="settingIcon" />
        <setting />
      </div> -->
      <!-- <div class="empty-header-top"></div> -->
      <div class="app-main">
        <div class="bread-crumb-warp">
          <bread-crumb v-show="!horizontal" />
        </div>
        <div :class="isEmptyBox ? '' : 'page-body'">
          <router-view />
        </div>

        <back-top />
      </div>
    </div>
    <!-- 修改密码框 -->
    <password ref="passwordDialog" />
  </div>
</template>

<script>
import { horizontalSide, navBar, setting } from './components';
import breadCrumb from './components/navBar/breadCrumb.vue';
import password from './password.vue';
import backTop from '@/components/backTop/index';
import { mapState } from 'vuex';

export default {
  name: 'layout',
  components: { navBar, setting, backTop, horizontalSide, password, breadCrumb },
  data() {
    return {
      dataURLImg: ''
    };
  },
  computed: {
    ...mapState({
      open: state => state.setting.open,
      fixHeader: state => state.setting.fixHeader,
      tagShow: state => state.setting.tagShow,
      layout: state => state.setting.layout,
      accountInfo: state => state.user.accountInfo
    }),
    horizontal() {
      return this.layout == 'horizontal';
    },
    isEmptyBox() {
      return this.$route.meta.emptyBox;
    },
    watermarkStyle() {
      return {
        backgroundImage: 'url(' + this.dataURLImg + ')',
        backgroundPosition: '0 0',
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat'
      };
    }
  },
  methods: {
    changeVisivle() {
      this.$store.dispatch('setting/changeVisible', true);
    },
    // 水印
    waterMarkFun() {
      const date = new Date();
      const realName = `${this.accountInfo.username} ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const node = document.createElement('canvas');
      node.height = this.$refs.watermarkLayout.offsetHeight * 1.5;
      node.width = this.$refs.watermarkLayout.offsetWidth * 2;
      const ctx = node.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0.33)';
      for (let i = 0; i * 20 < node.height; i++) {
        for (let n = 0; n * 20 < node.height; n++) {
          ctx.save();
          ctx.font = '18px Arial';
          ctx.translate(i * 300, n * 200);
          ctx.rotate(-Math.PI / 9);
          if (n % 2) {
            ctx.fillText(realName, 0, 0);
          } else {
            ctx.fillText(realName, 0, 0);
          }
          ctx.restore();
        }
      }
      const dataURL = node.toDataURL('image/png');

      this.dataURLImg = dataURL;
    },
    changePassword() {
      this.$refs.passwordDialog.visible = true;
    }
  },
  mounted() {
    setTimeout(() => {
      // this.waterMarkFun();
    }, 1000);
  }
};
</script>
<style lang="scss" scoped>
.aside-container {
  background: #1b1c2f;
  transition: width 0.28s;
  width: 218px; /*no*/
  position: fixed;
  top: 0;
  left: 0;
  z-index: 996;
  height: 100%;
}

.main-container {
  // height: 100%;
  //暂去掉菜单栏-开始
  width: 100%;
  // width: calc(100% - 218px); /*no*/
  background: #f0f2f5;
  // margin-left: 218px; /*no*/

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 996;
    transition: width 0.28s;
    width: 100%;
    // width: calc(100% - 218px); /*no*/
    & ~ .empty-header-top {
      height: 54px; /*no*/
    }
  }

  // 暂去掉菜单栏-结束
  .paddingBox-container {
    height: calc(100vh - 54px);
  }

  .nav-bar-top-box {
    width: 100%;
    height: 58px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
  }
}

.hasTag {
  .fixed-header {
    & ~ .app-main {
      padding-top: 54px !important; /*no*/
      border-radius: 2px;
      min-height: 100vh;
      background: #f0f2f5;
      padding-bottom: 16px;
    }

    & ~ .empty-header-top {
      height: 100px; /*no*/
    }
  }

  .bread-crumb-warp {
    padding: 0 16px;
    background: #f0f2f5;

    ::v-deep .ant-breadcrumb {
      font-size: 12px;
    }
  }

  .paddingBox-container {
    background: #f0f2f5;
    height: calc(100% - 48px);
  }
}

.closeSide {
  .aside-container {
    width: 60px; /*no*/
  }

  .main-container {
    width: calc(100% - 60px); /*no*/
    margin-left: 60px; /*no*/
  }

  .fixed-header {
    width: calc(100% - 60px); /*no*/
  }
}

.empty-header-top {
  height: 100px;
}

//水平布局
.horizontal {
  .aside-container {
    width: 0;
  }

  .horizontal-nav {
    background: #293348;
    color: #f1f1f1;
    height: 54px; /*no*/
    line-height: 54px; /*no*/
  }

  .main-container {
    width: 100%;
    margin-left: 0;
  }

  .fixed-header {
    width: 100%;
  }

  .nav-user {
    background: #293348;
  }

  .app-main {
    width: 100%;
    box-sizing: border-box;
    padding: 0 6%;
    background: #f0f2f5;
  }
}

// 水印
.bg {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: transparent;
  pointer-events: none;
}
</style>
