<template>
  <div class="page-footer">
    <a-button class="btn" @click="onCancel">取消</a-button>
    <a-button type="primary" class="btn btn-primary left-margin" @click="onSave">保存</a-button>
  </div>
</template>

<script>
export default {
  methods: {
    onCancel() {
      this.$router.go(-1);
    },
    onSave() {
      this.$emit('onSave');
    }
  }
};
</script>

<style lang="scss" scoped></style>
