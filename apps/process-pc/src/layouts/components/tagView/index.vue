<template>
  <div class="tagView-wrapper relative white">
    <a-icon type="left" class="absolute pointer tag_btn" style="left:0" @click="handleScroll(240)" v-show="hanldeBtn" />
    <div class="scroll-outer" ref="scrollOuter" :style="outerWidth">
      <div class="scroll-body absolute" ref="scrollBody" :style="{ left: tagBodyLeft + 'px' }">
        <router-link
          class="tag-item pointer inline-block"
          :to="{ path: item.path, query: item.query, fullPath: item.fullPath, params: item.params }"
          v-for="(item, index) in tagList"
          :key="item.path"
          :class="isActive(item.path) ? 'activeTag' : ''"
          ref="tagWrapper"
        >
          <span class="tag-title">{{ item.meta.title }}</span>
          <a-icon
            type="close"
            v-if="index != 0"
            class="verticalMiddle tag-icon"
            @click.prevent.stop.native="closeTag(item)"
            size="10"
          />
          <!-- <svg-icon
            icon="close-grid"
            v-if="index != 0 && !isActive(item.path)"
            class="verticalMiddle tag-icon"
            :size="14"
            @click.prevent.stop.native="closeTag(item.path)"
          /> -->
          <!-- <svg-icon
            icon="close-blue"
            v-if="index != 0 && isActive(item.path)"
            class="verticalMiddle tag-icon"
            :size="14"
            @click.prevent.stop.native="closeTag(item.path)"
          /> -->
        </router-link>
      </div>
    </div>

    <a-icon
      type="right"
      class="absolute pointer tag_btn"
      style="right:0"
      @click="handleScroll(-240)"
      v-show="hanldeBtn"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import { asyncRoutes } from '@/router';

export default {
  name: 'tagView',
  data() {
    return {
      tagBodyLeft: 0,
      hanldeBtn: false
    };
  },
  computed: {
    ...mapState({
      tagList: state => state.tagsView.tagList,
      cacheTagList: state => state.tagsView.cacheTagList
    }),
    outerWidth() {
      if (this.hanldeBtn) {
        return {
          left: '30px',
          right: '34px'
        };
      }
      return {
        left: '15px',
        right: '15px'
      };
    }
  },
  mounted() {
    this.addTag();
    this.changeTagWidth();
    this.initTag();
  },

  methods: {
    isActive(path) {
      const { meta } = this.$route;
      if (meta.isDetail) {
        return path === `/${meta.parentPath}`;
      }
      return path === this.$route.path;
    },
    initTag() {
      const { matched, meta, path } = this.$route;
      let routeList = matched.filter(v => v.path === `/${meta.parentPath}`);
      if (meta.isDetail && routeList.length === 0) {
        this.$store.dispatch('tagsView/removeCacheTag', path);
        this.$router.push({ path: `/${meta.parentPath}` });
        return;
      }
      this.$store.dispatch('tagsView/addCacheTag', this.$route);
      if (!routeList.length) return;
      this.$store.dispatch('tagsView/addTag', routeList[0]);
    },
    addTag() {
      const { meta, path } = this.$route;
      this.$store.commit('user/SET_CURRENT_URI', path);
      // 如果是详情内嵌页面，不需要加入tag标签
      if (!meta.isDetail) {
        this.$store.dispatch('tagsView/addTag', this.$route);
      }
      this.$store.dispatch('tagsView/addCacheTag', this.$route);
    },
    closeTag(item) {
      const { path, meta } = item;
      if (meta.isTip) {
        this.$confirm({
          icon: () => {
            return <a-icon type="exclamation-circle" />;
          },
          content: '您正在编辑该页面，确定要离开吗?',
          centered: true,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.$store.dispatch('tagsView/removeCacheTag', path);
            this.$store.dispatch('tagsView/removeTag', path).then(data => {
              if (this.isActive(path)) {
                this.$router.push({
                  path: data[data.length - 1].path,
                  query: data[data.length - 1].query
                });
              }
              this.changeTagWidth();
              this.moveToTag();
            });
          },
          onCancel: () => {
            this.$message.info({
              content: '已取消'
            });
          }
        });
        return;
      }
      this.$store.dispatch('tagsView/removeCacheTag', path);

      this.$store.dispatch('tagsView/removeTag', path).then(data => {
        if (this.isActive(path)) {
          this.$router.push({
            path: data[data.length - 1].path,
            query: data[data.length - 1].query
          });
        }
        this.changeTagWidth();
        this.moveToTag();
      });
    },
    handleScroll(val) {
      const scrollOuterWidth = this.$refs.scrollOuter.offsetWidth;
      const scrollBodyWidth = this.$refs.scrollBody.offsetWidth;
      if (val > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + val);
      } else {
        this.tagBodyLeft = Math.max(this.tagBodyLeft + val, scrollOuterWidth - scrollBodyWidth);
      }
    },
    changeTagWidth() {
      const scrollOuterWidth = this.$refs.scrollOuter.offsetWidth;
      const scrollBodyWidth = this.$refs.scrollBody.offsetWidth;
      if (scrollBodyWidth >= scrollOuterWidth - 50) {
        this.hanldeBtn = true;
      } else {
        this.hanldeBtn = false;
      }
    },
    moveToTag() {
      this.$nextTick(() => {
        const index = this.tagList.findIndex(item => item.path == this.$route.path);
        if (index === -1) return;
        const eleWidth = this.$refs.tagWrapper[index].$el.offsetWidth;
        const eleLeft = this.$refs.tagWrapper[index].$el.offsetLeft;
        const scrollOuterWidth = this.$refs.scrollOuter.offsetWidth;

        //标签在左边
        if (eleLeft == 0 && index == 0) {
          return;
        }
        if (eleLeft < -this.tagBodyLeft) {
          this.tagBodyLeft = -eleLeft + 4;
        } else if (eleLeft > -this.tagBodyLeft && eleLeft + eleWidth < -this.tagBodyLeft + scrollOuterWidth) {
          this.tagBodyLeft = Math.min(0, scrollOuterWidth - eleWidth - eleLeft - 4);
        } else {
          this.tagBodyLeft = -(eleLeft - (scrollOuterWidth - 4 - eleWidth));
        }
      });
    }
  },
  watch: {
    $route(to, from) {
      // 当路由从详情页面进入其他页面时面包屑去掉详情页
      if (!!from && !!to && from.meta.isDetail) {
        this.$store.dispatch('tagsView/removeCacheTag', from.path);
      }
      this.changeTagWidth();
      this.addTag();
      this.moveToTag();
    }
  }
};
</script>

<style lang="scss" scoped>
$height: 36px;

.tagView-wrapper {
  width: 100%;
  height: $height; /*no*/
  border-bottom: 1px solid #e0e0e0;
  // -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0 25px; /*no*/
  .tag_btn {
    width: 26px; /*no*/
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
  }

  .scroll-outer {
    position: absolute;
    height: 100%;
    left: 20px !important;
    overflow: hidden;
    z-index: 1;
    bottom: -1px;

    .scroll-body {
      transition: left 0.3s ease;
      // bottom: -11px;
      z-index: 1;
      display: inline-block;
      white-space: nowrap;
      height: 100%;
      line-height: $height; /*no*/
      .tag-item {
        height: 32px; /*no*/
        line-height: 26px; /*no*/
        text-align: center;
        border: 1px solid #d9d9d9;
        border-radius: 3px 3px 0 0; /*no*/
        padding: 0 18px; /*no*/
        margin-right: 8px; /*no*/
        color: #333333;

        &:hover {
          color: #1890ff !important;
        }

        .tag-title {
          display: inline-block;
          vertical-align: middle;
          margin-right: 7px; /*no*/
          font-size: 14px; /*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 17px; /*no*/
        }

        .tag-icon {
          font-size: 11px; /*no*/
          &:hover {
            color: #1890ff;
            background: #fff;
            border-radius: 50%;
          }
        }
      }

      .activeTag {
        background: #f0f2f5;
        color: #1890ff;
        border-bottom-color: #f0f2f5 !important;

        .tag-title {
          margin-right: 0 !important;
          color: #1890ff;
          font-size: 14px; /*no*/
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500; /*no*/
          color: #1890ff;
          line-height: 17px; /*no*/
        }

        .tag-icon {
          margin-left: 6px; /*no*/
        }

        // &:before {
        //   content: '';
        //   background: #fff;
        //   height: 8px; /*no*/
        //   width: 8px; /*no*/
        //   display: inline-block;
        //   border-radius: 50%;
        //   margin-right: 4px; /*no*/
        //   vertical-align: middle;
        // }
      }
    }
  }
}
</style>
