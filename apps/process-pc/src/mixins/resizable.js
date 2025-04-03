export default {
  computed: {
    tabComponents() {
      if (this.bordered) {
        return {
          header: {
            cell: (h, props, children) => {
              const { key, ...restProps } = props;
              const col = this.columns.find(col => {
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
  }
};
