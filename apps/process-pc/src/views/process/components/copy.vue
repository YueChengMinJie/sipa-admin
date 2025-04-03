<template>
  <div>
    <a-modal
      width="400px"
      centered
      v-model="visible"
      :confirm-loading="confirmLoading"
      title="复制流程"
      cancelText="取消"
      okText="确定"
      @cancel="onCancel"
      @ok="handleOk"
    >
      <a-form-model
        :rules="rules"
        :model="formData"
        ref="copyForm"
        :labelCol="{ style: 'width: 120px' }"
        :wrapperCol="{ style: 'width:70%' }"
        class="search-form-dropDown"
      >
        <a-row>
          <a-col>
            <a-form-model-item label="被复制审批流程">
              <div>{{ copyedItem.processDefName || '--' }}</div>
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item label="新审批流程名称" prop="processDefName">
              <a-input v-model.trim="formData.processDefName" :maxLength="32" placeholder="请输入" allowClear />
            </a-form-model-item>
          </a-col>
        </a-row>
        <p class="explain">复制完成后，请修改核对流程设置信息后发布</p>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { copyAllTemp } from '@/api/process';

export default {
  props: {
    copyedItem: {
      type: Object,
      require: true,
      default: () => {}
    }
  },
  data() {
    const checkProcessName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('该项为必填项！'));
      } else {
        callback();
        // checkProcessDefName({ processDefName: this.formData.processDefName }).then(res => {
        //   if (res.data) {
        //     callback(new Error('审批流程名称不可重复！'));
        //   }
        //   callback();
        // });
      }
    };
    return {
      visible: false,
      confirmLoading: false,
      isNameRepeat: false,
      formData: {},
      rules: {
        processDefName: [{ required: true, trigger: 'blur', validator: checkProcessName }]
      }
    };
  },
  methods: {
    onCancel() {
      this.formData = {};
      this.$refs.copyForm.resetFields();
      this.isNameRepeat = false;
    },
    handleOk(e) {
      this.$refs.copyForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          let param = {};
          param.processDefKey = this.copyedItem.processDefKey;
          param.processDefName = this.formData.processDefName;
          copyAllTemp(param).then(
            res => {
              if (res.data) {
                this.confirmLoading = false;
                this.$message.success('复制成功');
                this.$emit('refreshTable');
                this.visible = false;
              }
            },
            err => {
              this.confirmLoading = false;
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.explain {
  font-size: 12px;
  margin-left: 12px;
  color: rgba(0, 144, 255, 0.7);
}
</style>
