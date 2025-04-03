<template>
  <div class="steps">
    <div class="step" v-for="(item, index) in steps" :key="item.id">
      <div v-if="index + 1 < currentStep" class="item item-active">
        <image-icon icon="other/step" width="28" height="28"></image-icon>
        <p>{{ item.name }}</p>
      </div>
      <div v-else :class="currentStep == item.id ? 'item item-active' : 'item'">
        <div class="circle">{{ item.id }}</div>
        <p>{{ item.name }}</p>
      </div>
      <div v-if="index != steps.length - 1" class="line"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'svgIcon',
  props: {
    steps: {
      type: Array,
      required: true,
      default: () => []
    },
    currentStep: {
      type: Number,
      require: true,
      default: () => 1
    }
  },
  data() {
    return {};
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.steps {
  display: flex;

  .step {
    display: flex;

    .item {
      img {
        display: inline-block;
        margin-left: 14px;
      }

      .circle {
        width: 28px;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        font-weight: 500;
        color: #bfbfbf;
        border-radius: 14px;
        background-color: #f0f0f0;
        text-align: center;
        margin: auto;
      }

      p {
        font-size: 14px;
        font-weight: 500;
        color: #bfbfbf;
        margin-top: 8px;
        margin-bottom: 0;
      }
    }

    .item-active {
      .circle {
        color: #ffffff;
        background-color: #1890ff;
      }

      p {
        color: #1890ff;
      }
    }

    .line {
      width: 100px;
      height: 1px;
      background-color: #e5e6ec;
      margin-top: 13px;
    }
  }
}
</style>
