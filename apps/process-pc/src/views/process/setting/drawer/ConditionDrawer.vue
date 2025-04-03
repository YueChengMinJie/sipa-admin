<template>
  <div>
    <a-drawer class="drawer" :width="460" :visible="visible" :closable="false">
      <div slot="title">
        <div v-if="!isEdit">
          <span>{{ title || '--' }}</span>
          <div class="img" @click="isEdit = enabled && true">
            <image-icon icon="other/edit" width="14" height="14"></image-icon>
          </div>
        </div>
        <a-input v-else autoFocus v-model.trim="title" allowClear @blur="isEdit = false" :maxLength="20"></a-input>
      </div>
      <a-form class="form" :label-col="{ style: 'width: auto' }" :wrapper-col="{ style: 'flex: 1' }">
        <p class="desc">当审批单同时满足以下条件时进入此流程</p>
        <a-button
          v-if="!currentCondition || !currentCondition.formFieldCode"
          class="btn"
          @click="dialogVisible = true"
          v-show="enabled"
          >添加条件
        </a-button>
        <div v-else v-for="(formItem, index) in conditionFormList" :key="index">
          <div class="conditons">
            <!-- 数字 -->
            <div v-if="formItem.formFieldType == 1" class="content">
              <a-form-item :label="formItem.formFieldName + '：'">
                <a-input-group compact>
                  <a-select v-model="formItem.symbol" placeholder="请选择" style="width: 50%" :disabled="!enabled">
                    <a-select-option
                      v-for="(item, index) in numberSymbolSel"
                      :key="index"
                      :value="item.id"
                      @click="onSymbolChange(formItem, item)"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <a-input-number
                    v-if="formItem.symbol != 6 || !formItem.symbol"
                    :disabled="!enabled"
                    v-model="formItem.formValues"
                    style="width: 50%"
                    default-value="请输入数字"
                  />
                  <a-input-number
                    v-if="formItem.symbol == 6"
                    :disabled="!enabled"
                    v-model="formItem.formValueStart"
                    style="width: 25%"
                    default-value="请输入数字"
                  />
                  <a-input-number
                    v-if="formItem.symbol == 6"
                    :disabled="!enabled"
                    v-model="formItem.formValueEnd"
                    style="width: 25%"
                    default-value="请输入数字"
                  />
                </a-input-group>
              </a-form-item>
            </div>
            <!-- 多选 -->
            <div v-if="formItem.formFieldType == 2" class="content">
              <p class="label">请选择{{ formItem.formFieldName }}</p>
              <a-form-item>
                <a-checkbox-group
                  v-model="formItem.formValues"
                  :disabled="!enabled"
                  name="formcheckout"
                  :options="formItem.formFieldValues"
                  @change="onCheckboxChange"
                />
              </a-form-item>
            </div>
            <!-- 日期 -->
            <div v-if="formItem.formFieldType == 3" class="content">
              <a-form-item :label="formItem.formFieldName + '：'" :label-col="{ style: 'min-width: 80px' }">
                <a-select
                  v-model="formItem.symbol"
                  placeholder="请选择"
                  :dropdownMatchSelectWidth="false"
                  allowClear
                  :disabled="!enabled"
                >
                  <a-select-option
                    v-for="(item, index) in timeSymbolSel"
                    :key="index"
                    :value="item.id"
                    @click="onSymbolChange(formItem, item)"
                    >{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item v-if="formItem.symbol == 6" label="选择日期：" :label-col="{ style: 'width: 80px' }">
                <a-range-picker
                  v-model="formItem.formValues"
                  :disabled="!enabled"
                  format="YYYY-MM-DD"
                  :placeholder="['开始日期', '结束日期']"
                  :locale="locale.Calendar"
                  separator="至"
                >
                  <svg-icon icon="date" :size="12" slot="suffixIcon"></svg-icon>
                </a-range-picker>
              </a-form-item>
              <a-form-item v-else label="选择日期：" :label-col="{ style: 'width: 80px' }">
                <a-date-picker
                  v-model="formItem.formValues"
                  :locale="locale.Calendar"
                  placeholder="请选择"
                  :disabled="!enabled"
                >
                  <svg-icon icon="date" :size="12" slot="suffixIcon"></svg-icon>
                </a-date-picker>
              </a-form-item>
            </div>
            <!-- 单选 -->
            <div v-else class="conditons">
              <div v-if="formItem.formFieldType == 4" class="content">
                <a-form-item :label="formItem.formFieldName + '：'">
                  <a-radio-group v-model="formItem.formValues" @change="onRadioChange" :disabled="!enabled">
                    <a-radio v-for="(item, index) in formItem.formFieldValues" :key="index" :value="item">
                      {{ item }}
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
            </div>
            <!-- 文本 -->
            <div v-if="formItem.formFieldType == 5" class="content">
              <a-form-item :label="formItem.formFieldName + '：'">
                <a-input-group compact>
                  <a-select v-model="formItem.symbol" style="width: 50%" :disabled="!enabled">
                    <a-select-option
                      v-for="(item, index) in textSymbolSel"
                      :key="index"
                      :value="item.id"
                      @click="onSymbolChange(formItem, item)"
                    >
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <a-input
                    v-model.trim="formItem.formValues"
                    :disabled="!enabled"
                    style="width: 50%"
                    placeholder="请输入"
                  />
                </a-input-group>
              </a-form-item>
            </div>
            <a-icon v-if="enabled" class="delIcon" @click="onDelete(index)" type="delete" />
          </div>
        </div>
        <a-button
          v-if="currentCondition && (currentCondition.formFieldType == 1 || currentCondition.formFieldType == 3)"
          v-show="enabled"
          class="btn"
          @click="addMore"
          >继续添加
        </a-button>
      </a-form>
      <div class="footer">
        <a-button @click="onCancel"> 取消</a-button>
        <a-button type="primary" @click="onConfirm" v-if="enabled"> 确定</a-button>
      </div>
    </a-drawer>

    <!-- 添加条件 -->
    <a-modal
      width="500px"
      centered
      v-model="dialogVisible"
      title="添加条件"
      cancelText="取消"
      okText="确定"
      @cancel="onDialogCancel"
      @ok="onDialogConfirm"
      class="conditionDialog"
    >
      <p class="desc">请选择用来区分审批流程的条件字段</p>
      <a-radio-group v-model="currentConditionCopy" @change="onConditionChange">
        <a-radio v-for="(item, index) in conditionSel" :key="index" :value="item">
          {{ item.formFieldName }}
        </a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
// import { selectTempForm } from '@/api/process';
import processUtil from '../../processUtil';
import { mapState } from 'vuex';

const moment = require('moment');

export default {
  props: {
    enabled: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      //初始值
      locale: zhCN,
      visible: false,
      isEdit: false,
      title: '条件',
      // 添加条件
      dialogVisible: false,
      currentCondition: {},
      currentConditionCopy: {},
      conditionFormList: [],
      // 下拉框
      symbolSel: [],
      numberSymbolSel: [],
      timeSymbolSel: [],
      textSymbolSel: [],
      // 单选
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    };
  },
  watch: {
    visible(value) {
      if (this.visible && this.conditionFormList && this.conditionFormList.length > 0) {
        this.currentCondition = this.conditionSel.find(item => {
          return item.tempFormId == this.conditionFormList[0].formId;
        });
        this.conditionFormList.map(item => {
          item.formId = this.currentCondition.tempFormId;
          item.formFieldType = this.currentCondition.formFieldType;
          item.formFieldName = this.currentCondition.formFieldName;
          item.formFieldCode = this.currentCondition.formFieldCode;
          item.formFieldValues = this.currentCondition.formFieldValues;
          //日期
          if (item.formFieldType == 3) {
            item.formValues = moment(item.formValueStart);
            if (item.symbol == 6) {
              item.formValues = [moment(item.formValueStart), moment(item.formValueEnd)];
            }
          } else if (item.formFieldType == 2) {
            // item.formValues = item.formValueStart;
          } else {
            if (item.formFieldType != 1 || item.symbol != 6) {
              item.formValues = item.formValueStart;
            }
          }
        });
        //多选去重
        if (this.currentCondition.formFieldType == 2) {
          let formValues = [];
          this.conditionFormList.forEach(item => {
            formValues.push(item.formValueStart);
          });
          this.conditionFormList[0].formValues = formValues;
          this.conditionFormList.splice(1, this.conditionFormList.length - 1);
        }
      } else {
        this.$nextTick(() => {
          this.currentCondition = {};
          this.currentConditionCopy = {};
          this.conditionFormList.splice(0, this.conditionFormList.length);
        });
      }
    }
  },
  computed: {
    ...mapState({
      createName(state) {
        return state.user.accountInfo.name;
      },
      processDefKey(state) {
        return state.process.processDefKey;
      },
      conditionSel(state) {
        return state.process.conditionList;
      }
    })
  },
  created() {
    this.symbolSel = processUtil.symbolSel;
    this.numberSymbolSel = processUtil.numberSymbolSel;
    this.textSymbolSel = processUtil.textSymbolSel;
    this.timeSymbolSel = processUtil.timeSymbolSel;
  },
  components: {},
  methods: {
    onConditionChange(e) {
      this.currentConditionCopy = e.target.value;
    },
    onSymbolChange(formItem, item) {
      if (this.currentCondition.formFieldType == 3) {
        this.$set(formItem, 'formValues', undefined);
        this.$set(formItem, 'formValueStart', undefined);
        this.$set(formItem, 'formValueEnd', undefined);
      }
      if (this.currentCondition.formFieldType == 1) {
        if (item.id == 6) {
          this.$set(formItem, 'formValueStart', formItem.formValues);
          this.$set(formItem, 'formValues', undefined);
          this.$set(formItem, 'formValueEnd', undefined);
        } else if (formItem.formValueStart) {
          this.$set(formItem, 'formValues', formItem.formValueStart);
          this.$set(formItem, 'formValueStart', undefined);
          this.$set(formItem, 'formValueEnd', undefined);
        }
      }
    },
    /**
     * 弹框-确定
     */
    onDialogConfirm() {
      this.symbol = null;
      this.formValues = undefined;
      this.currentCondition = this.currentConditionCopy;
      this.conditionFormList.push(JSON.parse(JSON.stringify(this.currentCondition)));
      this.dialogVisible = false;
    },
    /**
     * 弹框-取消
     */
    onDialogCancel() {
      this.dialogVisible = false;
    },

    /**
     * 删除条件
     */
    onDelete(index) {
      this.conditionFormList.splice(index, 1);
      if (this.conditionFormList.length == 0) {
        this.currentCondition = {};
      }
    },
    /**
     * 继续添加
     */
    addMore() {
      this.conditionFormList.push(JSON.parse(JSON.stringify(this.currentCondition)));
    },
    /**
     * 确定
     */
    onConfirm() {
      let copyData = {};
      copyData.title = this.title;
      copyData.tempNodeFormModelList = [];
      copyData.content = '';
      this.conditionFormList = this.conditionFormList.filter(item => {
        if (item.formFieldType == 1) {
          return (
            item.symbol &&
            (item.formValues || item.formValueStart || item.formValues === 0 || item.formValueStart === 0)
          );
        } else if (item.formFieldType == 2 || item.formFieldType == 4) {
          return item.formValues || item.formValues == 0;
        } else {
          return item.symbol && (item.formValues || item.formValues == 0);
        }
      });
      this.conditionFormList.forEach(formItem => {
        formItem.formValues = formItem.formValues === 0 ? 0 : formItem.formValues || '';
        //选择日期时,给formValueStart，formValueEnd复制
        if (formItem.formFieldType == 3) {
          if (Array.isArray(formItem.formValues)) {
            formItem.formValues.forEach((item, index) => {
              formItem.formValues[index] = moment(item).format('YYYY-MM-DD');
            });
            formItem.formValueStart = formItem.formValues[0];
            formItem.formValueEnd = formItem.formValues[1];
          } else {
            formItem.formValues = moment(formItem.formValues).format('YYYY-MM-DD');
            formItem.formValueStart = formItem.formValues;
          }
        } else {
          //除数字-之间，日期（上面已处理）外, 其它都为一个输入框
          if (formItem.formFieldType != 1 || formItem.symbol != 6) {
            formItem.formValueStart = formItem.formValues;
          }
        }

        //卡片內容展示
        let symbolObj = this.symbolSel.find(item => {
          return item.id == formItem.symbol;
        });
        if (formItem.formFieldType == 1) {
          if (symbolObj.id == 6) {
            let content =
              formItem.formValueStart + ' < ' + formItem.formFieldName + ' < ' + formItem.formValueEnd + ' || ';
            copyData.content = copyData.content.concat(content);
          } else {
            copyData.content = copyData.content.concat(
              formItem.formFieldName + ' ' + (symbolObj.mathSign || '') + ' ' + formItem.formValues + ' || '
            );
          }
        } else if (formItem.formFieldType == 2) {
          copyData.content = copyData.content.concat(
            '（多选）' + formItem.formFieldName + '：' + formItem.formValues + ' || '
          );

          //节点数据（多选）
          formItem.formValues.forEach(value => {
            let item = {};
            item.formValues = formItem.formValues;
            item.formId = formItem.tempFormId || formItem.formId;
            item.symbol = formItem.symbol;
            item.formValueStart = value;
            item.formValueEnd = null;
            copyData.tempNodeFormModelList.push(item);
          });
        } else if (formItem.formFieldType == 3) {
          if (formItem.symbol == 6) {
            copyData.content = copyData.content.concat(
              formItem.formFieldName +
                '：' +
                formItem.formValueStart +
                ' ' +
                (symbolObj.mathSign || '') +
                ' ' +
                formItem.formValueEnd +
                ' || '
            );
          } else {
            copyData.content = copyData.content.concat(
              formItem.formFieldName + ' ' + (symbolObj.mathSign || '') + ' ' + formItem.formValues + ' || '
            );
          }
        } else if (formItem.formFieldType == 4) {
          copyData.content = copyData.content.concat(
            '（单选）' + formItem.formFieldName + '：' + formItem.formValues + ' || '
          );
        } else if (formItem.formFieldType == 5) {
          copyData.content = copyData.content.concat(
            formItem.formFieldName + ' ' + (symbolObj.mathSign || '') + ' ' + formItem.formValues + ' || '
          );
        }

        //节点数据（非多选时）
        if (formItem.formFieldType != 2) {
          let item = {};
          item.formValues = formItem.formValues;
          item.formId = formItem.tempFormId || formItem.formId;
          item.symbol = formItem.symbol;
          item.formValueStart = formItem.formValueStart;
          item.formValueEnd = formItem.formValueEnd || null;
          copyData.tempNodeFormModelList.push(item);
        }
      });
      if (copyData.content.length > 4) {
        copyData.content = copyData.content.substring(0, copyData.content.length - 4);
        copyData.content = copyData.content.length > 28 ? `${copyData.content.slice(0, 28)}...` : copyData.content;
      }
      this.$emit('onDrawerConfirm', copyData);
      this.visible = false;
    },

    //条件-单选
    onRadioChange(e) {
      let conditionFormCopy = JSON.parse(JSON.stringify(this.conditionFormList[0]));
      conditionFormCopy.formValues = e.target.value;
      this.conditionFormList.splice(0, this.conditionFormList.length);
      this.conditionFormList.push(conditionFormCopy);
    },
    //条件-多选
    onCheckboxChange(checkedValue) {
      let conditionFormCopy = JSON.parse(JSON.stringify(this.conditionFormList[0]));
      conditionFormCopy.formValues = checkedValue;
      this.conditionFormList.splice(0, this.conditionFormList.length);
      this.conditionFormList.push(conditionFormCopy);
    },
    /**
     * 取消
     */
    onCancel() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.desc {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 16px;
}

.form {
  .ant-form-item {
    margin-bottom: 16px !important;
  }
}

.conditons {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .content {
    width: 360px;
    min-width: 100px !important;

    .label {
      font-size: 12px;
      color: #333333;
      margin-bottom: 16px;
    }
  }

  .delIcon {
    width: 14px;
    margin-top: 7px;
  }
}

.conditionDialog {
  .desc {
    font-size: 12px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 12px;
  }

  .ant-radio-group {
    width: 100%;
    min-height: 40px;

    .ant-radio-wrapper {
      ::v-deep.ant-radio {
        width: 14px;
        height: 15px;
      }

      width: calc(100% / 3);
      height: 16px;
      padding-right: 8px;
      margin-bottom: 16px;
      margin-right: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
