<template>
  <a-breadcrumb class="flex-sub bread-wrapper" separator="/">
    <a-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <router-link
        v-if="item.path && index !== 0"
        :to="{ path: item.path, query: item.query, fullPath: item.fullPath, params: item.params }"
        >{{ item.meta.title }}
      </router-link>
      <!-- <a href="#" v-if="item.path" @click="handleBread(item, index)">{{ item.meta.title }}</a> -->
      <span v-else>{{ item.meta.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'breadCrumb',
  components: {},
  data() {
    return {
      breadList: []
    };
  },
  computed: {
    ...mapState({
      cacheBreadCrumbList: state => state.breadCrumb.cacheBreadCrumbList
    })
  },
  created() {
    this.getBreadCrumb();
  },
  methods: {
    getBreadCrumb() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      const index = matched.length;
      let tempList = this.cacheBreadCrumbList.filter(item => {
        return (
          item.meta &&
          item.meta.parentPath &&
          matched[index - 1] &&
          item.meta.parentPath === matched[index - 1].meta.parentPath
        );
      });
      if (tempList.length > 0) {
        if (index <= 1) {
          this.breadList = tempList;
        } else {
          this.breadList = [matched.pop(), ...tempList];
        }
      } else {
        this.breadList = [...matched];
      }
    },
    handleBread(route, index) {
      this.$router.push({
        path: route.path,
        query: route.query,
        params: route.params,
        fullPath: route.params
      });
    },
    async addCacheBreadCrumb(cur, old) {
      const router = {
        cur: cur,
        old: old
      };
      await this.$store.dispatch('breadCrumb/addCacheBreadCrumb', router);
      this.getBreadCrumb();
    }
  },
  watch: {
    // $route() {
    //   this.addCacheBreadCrumb();
    // }
    $route: {
      handler(cur, old) {
        this.addCacheBreadCrumb(cur, old);
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.bread-wrapper {
  height: 100%;
  line-height: 34px;
  // line-height: 54px;
}
</style>
