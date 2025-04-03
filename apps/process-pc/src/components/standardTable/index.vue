<template>
  <div class="tableCommon-wrapper">
    <a-table
      :bordered="bordered"
      :components="components"
      :columns="tableHead"
      :dataSource="tableData"
      :loading="loading"
      :pagination="pagination"
      :row-selection="rowSelection"
      @change="handleTableChange"
      rowKey="id"
      :scroll="scroll"
    >
      <!-- 支持自定义头部 -->
      <template :slot="slotTitle" v-for="slotTitle in Object.keys($slots)">
        <slot :name="slotTitle"></slot>
      </template>
      <template
        slot-scope="text, record, index"
        :slot="slot"
        v-for="slot in Object.keys($scopedSlots).filter(key => key !== 'expandedRowRender')"
      >
        <slot :name="slot" v-bind="{ text, record, index }"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'standardTable',
  props: {
    tableHead: {
      type: Array,
      required: true,
      default: () => []
    },
    bordered: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: [Object, Boolean],
      default: false
    },
    rowSelection: {
      type: Object
    },
    scroll: {
      type: Object
    }
  },
  computed: {
    components() {
      if (this.bordered) {
        return {
          header: {
            cell: (h, props, children) => {
              const { key, ...restProps } = props;
              const col = this.tableHead.find(col => {
                const k = col.dataIndex || col.key;
                return k === key;
              });

              if (!col || !col.width) {
                return h('th', { ...restProps }, [...children]);
              }

              const dragProps = {
                key: col.dataIndex || col.key,
                class: 'table-draggable-handle',
                attrs: {
                  w: 10,
                  x: col.width,
                  z: 1,
                  axis: 'x',
                  draggable: true,
                  transform: 'none',
                  resizable: false
                },
                on: {
                  dragging: (x, y) => {
                    col.width = Math.max(x, 1);
                  }
                }
              };

              const drag = h('vue-draggable-resizable', { ...dragProps });
              return h('th', { ...restProps, class: 'resize-table-th' }, [...children, drag]);
            }
          }
        };
      } else {
        return {};
      }
    }
  },
  methods: {
    handleTableChange(val) {
      this.$emit('changeCurrent', val.current);
    }
  }
};
</script>

<style lang="scss">
.tableCommon-wrapper {
  // 实现可伸缩列样式
  .resize-table-th {
    position: relative;

    .table-draggable-handle {
      height: 100% !important;
      bottom: 0;
      position: absolute;
      left: auto !important;
      transform: none !important;
      right: -5px;
      z-index: 1000 !important;
      cursor: col-resize;
      touch-action: none;
    }

    .vdr {
      border: none !important;
    }
  }
}
</style>
