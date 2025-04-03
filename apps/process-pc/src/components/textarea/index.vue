<template>
  <div class="text-area">
    <textarea
      v-model.trim="valueData"
      :maxlength="maxlength"
      :placeholder="disabled ? '' : placeholder"
      @input="$event => onChange($event.target.value)"
      :disabled="disabled"
    ></textarea>
    <div class="textarea-counter">
      <span>{{ valueData ? valueData.length : '0' }} </span>/{{ maxlength }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'new-textarea',
  model: {
    prop: 'value',
    event: 'changeVal'
  },
  props: {
    maxlength: {
      type: Number,
      required: false,
      default: () => 256
    },
    value: {
      required: true,
      default: () => null
    },
    placeholder: {
      type: String,
      required: false,
      default: () => '请输入...'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data() {
    return {
      valueData: this.value
    };
  },
  watch: {
    value(newVal) {
      this.valueData = this.value;
    }
  },
  methods: {
    onChange(item) {
      this.$emit('changeVal', item);
    }
  }
};
</script>

<style lang="scss">
.text-area {
  position: relative;
  width: 100% !important;

  textarea {
    width: 100%;
    height: 100%;
    min-height: 20px;
    border: 1px solid #d9d9d9;
    outline-color: #d9d9d9;
    padding: 4px 10px;
    line-height: 20px;
    resize: none;
    margin-bottom: -12px;
    font-size: 12px;
  }

  textarea::-webkit-input-placeholder {
    color: rgba(191, 191, 191, 1);
  }

  textarea:-moz-placeholder {
    color: rgba(191, 191, 191, 1);
  }

  textarea::-moz-placeholder {
    color: rgba(191, 191, 191, 1);
  }

  textarea:-ms-input-placeholder {
    color: rgba(191, 191, 191, 1);
  }

  .textarea-counter {
    position: absolute;
    bottom: 4px;
    right: 18px;
    color: rgba(191, 191, 191, 1);
    background-color: #fff;
    padding: 5px 1px;
    line-height: 18px;
    margin: 0;

    span {
      font-size: 14px !important;
      color: #1890ff;
    }
  }
}
</style>
