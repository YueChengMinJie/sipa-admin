<template>
  <div class="screen-box">
    <div class="screen-options-box">
      <div v-for="(column, columnIndex) in tableColumns" :key="column.dataIndex">
        <div class="screen-options" v-if="showCloums(column)">
          <a-checkbox
            :id="`screen-options-${columnIndex}`"
            :defaultChecked="column.visible"
            @change="
              e => {
                return screenOptionChange(e, columnIndex);
              }
            "
          >
          </a-checkbox>
          <label :for="`screen-options-${columnIndex}`">{{ column.title }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    noShowCloumns: {
      type: Array,
      default: () => ['num', 'operation']
    }
  },
  data() {
    return {
      tableColumns: []
    };
  },
  created() {
    this.tableColumns = [...this.columns];
    this.tableColumns.forEach(item => {
      item.visible = true;
    });
  },
  mounted() {},
  methods: {
    showCloums(item) {
      const index = this.noShowCloumns.indexOf(item.key);
      return index === -1;
    },
    screenOptionChange(e, columnIndex) {
      const {
        target: { checked }
      } = e;
      this.tableColumns[columnIndex].visible = checked;
      this.$emit('change', {
        colums: [...this.tableColumns.filter(item => item.visible)]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.screen-box {
  overflow: auto;

  .screen-options-box {
    padding: 10px;
    min-width: 200px;
    max-height: 400px;

    .screen-options {
      cursor: pointer;
      display: flex;
      justify-content: flex-start;

      label {
        margin-left: 15px;
        display: inline-block;
        cursor: pointer;
      }
    }
  }
}
</style>
