<!--
 * @Author: zhouxiajie86@gmail.com
 * @Date: 2023-08-15 14:53:45
 * @LastEditors: zhouxiajie86@gmail.com
 * @LastEditTime: 2023-10-07 17:21:41
 * @FilePath: /sipa-ui/packages/core/components/button/button.vue
 * @Description:
-->
<template>
  <div :id="id" class="process-view-container" />
</template>

<script>
import G6Editor from '@antv/g6-editor';
import registerNode from './registerNode';
import { defaultComponentPrefix } from '@sipa-ui/core/utils/config';

registerNode(G6Editor);

export default {
  name: `${defaultComponentPrefix}ProcessPreview`,
  props: {
    data: Object,
  },
  data() {
    return {
      id: `${defaultComponentPrefix}-editor-container`,
      editor: null,
      flow: null,
    };
  },
  mounted() {
    const editor = new G6Editor();
    this.editor = editor;

    G6Editor.track(false);

    const flow = new G6Editor.Flow({
      graph: {
        container: this.id,
      },
      align: {
        line: {
          stroke: '#dadce0',
          lineWidth: 1,
        },
        item: true,
      },
      edge: {
        shape: 'flow-smooth',
      },
    });
    this.flow = flow;
    editor.add(flow);
  },
  destroyed() {
    this.editor.destroy();
  },
};
</script>

<style scoped lang="scss"></style>
