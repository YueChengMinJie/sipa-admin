<template>
  <a-result class="error-page" status="404" title="404" sub-title="对不起，您访问的页面不存在">
    <template #extra>
      <a-button type="primary" @click="returnHome">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    role() {
      return this.$store.getters.roles;
    }
  },
  methods: {
    returnHome() {
      this.$router.push({
        path: '/process'
      });
    }
  }
};
</script>
