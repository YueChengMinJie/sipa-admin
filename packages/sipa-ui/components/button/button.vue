<!--
 * @Author: zhouxiajie86@gmail.com
 * @Date: 2023-08-15 14:53:45
 * @LastEditors: zhouxiajie86@gmail.com
 * @LastEditTime: 2023-10-07 17:21:41
 * @FilePath: /sipa-ui/packages/core/components/button/button.vue
 * @Description:
-->
<template>
  <button
    :class="[
      className.defaultName,
      {
        [className.types.isPrimary]: type === 'primary',
        [className.types.isDefault]: type !== 'primary',
      },
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
import { useDefaultPrefix } from '@sipa-ui/core/hooks/usePrefix';
import { defaultComponentPrefix } from '@sipa-ui/core/utils/config';

export default {
  name: `${defaultComponentPrefix}Button`,
  props: {
    type: String,
  },
  data() {
    return {
      className: useDefaultPrefix('button'),
    };
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>
