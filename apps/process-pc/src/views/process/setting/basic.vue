<template>
  <div class="page-detail">
    <a-form-model
      :rules="rules"
      :model="tempWorkflowModel"
      ref="basicInfoForm"
      :labelCol="{ style: 'width: 100px' }"
      :wrapperCol="{ style: 'flex: 1' }"
      class="search-form-validate"
    >
      <a-row :gutter="24">
        <a-col :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-model-item label="应用系统" prop="tenantId">
            <a-select
              placeholder="请选择"
              v-model.trim="tempWorkflowModel.tenantId"
              :dropdownMatchSelectWidth="false"
              allowClear
            >
              <a-select-option :value="item.id" v-for="item in platformList" :key="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-model-item label="适用商户/组织" class="multiple-select" prop="companyId">
            <a-select
              :disabled="isEditMode"
              placeholder="请选择"
              showSearch
              v-model.trim="tempWorkflowModel.companyId"
              :dropdownMatchSelectWidth="false"
              allowClear
              :filter-option="filterSearchOption"
              :maxTagTextLength="1"
            >
              <a-select-option
                :value="item.id"
                v-for="item in companyList"
                :key="item.id"
                @click="chooseCompany(item, 1)"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-model-item label="审批流程名称" prop="processDefName">
            <a-input
              v-model.trim="tempWorkflowModel.processDefName"
              :maxLength="50"
              placeholder="请输入"
              allowClear
              @change="isEdited = true"
            />
          </a-form-model-item>
        </a-col>
        <a-col :md="12" :lg="8" :xl="6" :xxl="6">
          <a-form-model-item label="审批人去重" prop="workFlowRepeatType">
            <a-select
              placeholder="请选择"
              v-model.trim="tempWorkflowModel.workFlowRepeatType"
              :dropdownMatchSelectWidth="false"
              allowClear
              @change="isEdited = true"
            >
              <a-select-option :value="item.id" v-for="item in nodeRepeatSel" :key="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- <a-row :gutter="24">
        <a-col :md="12" :lg="8" :xl="6" :xxl="6"
          ><a-form-model-item
            label="其它适用主体"
            prop="otherCompanyIds"
            class="multiple-select"
            style="margin-bottom: 2px !important;"
          >
            <a-select
              mode="multiple"
              placeholder="请选择"
              v-model.trim="tempWorkflowModel.otherCompanyIds"
              :dropdownMatchSelectWidth="false"
              :filter-option="filterSearchOption"
              allowClear
              @change="isEdited = true"
            >
              <a-select-option
                v-for="item in companyList"
                :key="item.id"
                :value="item.id"
                @click="chooseCompany(item, 2)"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row> -->
      <!-- <a-row>
        <a-col :span="24">
          <div class="checked-row">
            <div class="item" v-for="(item, index) in otherCompanyModels" :key="index" :value="index">
              <span>{{ item.companyName }}</span>
              <a-icon type="close" @click="delectOtherCompany(index, item)" />
            </div>
          </div>
        </a-col>
      </a-row> -->
      <a-row class="editor-box">
        <a-col>
          <a-form-model-item label="备注">
            <new-textarea
              :value="tempWorkflowModel.remark"
              placeholder="请输入..."
              @changeVal="changeVal"
              class="editor-input"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <div class="subject-label">
        <span class="subject-label-line"></span>
        <div class="label">分支条件</div>
        <a-button class="button-s" @click="addRow(0)">添加</a-button>
      </div>
      <a-table
        :locale="{ emptyText: '暂无数据' }"
        :columns="fieldTableColumns"
        :data-source="fieldTableData"
        :pagination="false"
        :scroll="{ x: 800 }"
        :rowKey="(record, index) => index"
        bordered
        class="table-noscoll"
      >
        <div slot="formFieldNameTitle">
          <span>条件描述</span>&nbsp;
          <span style="color: red">*</span>
        </div>

        <div slot="formFieldCodeTitle">
          <span>CODE</span>&nbsp;
          <span style="color: red">*</span>
        </div>
        <div slot="formFieldTypeTitle">
          <span>条件类型</span>&nbsp;
          <span style="color: red">*</span>
        </div>
        <div slot="formFieldValueTitle">
          <span>值</span>&nbsp;
          <span style="color: red">*</span>
        </div>
        <span slot="num" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="formFieldName" slot-scope="text, record">
          <a-input
            v-if="record.isEdit"
            :maxLength="32"
            v-model.trim="record.formFieldName"
            placeholder="请输入"
            allowClear
          />
          <span v-else>{{ record.formFieldName || '--' }}</span>
        </span>
        <span slot="formFieldCode" slot-scope="text, record">
          <a-input
            v-if="record.isEdit"
            :maxLength="32"
            v-model.trim="record.formFieldCode"
            placeholder="请输入"
            allowClear
          />
          <span v-else>{{ record.formFieldCode || '--' }}</span>
        </span>
        <span slot="formFieldType" slot-scope="text, record">
          <a-select
            v-if="record.isEdit"
            placeholder="请选择"
            v-model.trim="record.formFieldType"
            :dropdownMatchSelectWidth="false"
            allowClear
          >
            <a-select-option v-for="item in fieldTypeSel" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <span v-else>{{ transfer(record.formFieldType) || '--' }}</span>
        </span>
        <span slot="formFieldValues" slot-scope="text, record, index">
          <div v-if="record.formFieldType == 2 || record.formFieldType == 4">
            <a-select
              v-if="record.isEdit"
              v-model.trim="record.formFieldValues"
              mode="tags"
              :token-separators="[' ']"
              allowClear
              @change="
                value => {
                  onSelectChange(value, index);
                }
              "
            >
            </a-select>
            <span v-else>{{ record.formFieldValues || '--' }}</span>
          </div>
          <span v-else class="empty-txt">—</span>
        </span>
        <span slot="action" slot-scope="text, record, index" class="actions">
          <span v-if="record.isEdit" @click="addFiledData(record, index, 0)">保存</span>
          <span v-else @click="editFiledData(record, index, 0)">修改</span>
          <span @click="deleteFiledData(record, index, 0)">删除</span>
        </span>
      </a-table>
      <div class="subject-label">
        <span class="subject-label-line"></span>
        <div class="label">表单中的人</div>
        <a-button class="button-s" @click="addRow(1)">添加</a-button>
      </div>
      <a-table
        :locale="{ emptyText: '暂无数据' }"
        :columns="formPersonColumns"
        :data-source="formPersonData"
        :pagination="false"
        :rowKey="(record, index) => index"
        bordered
        style="width: 592px"
        class="table-noscoll"
      >
        <div slot="formFieldNameTitle">
          <span>条件描述</span>&nbsp;
          <span style="color: red">*</span>
        </div>

        <div slot="formFieldCodeTitle">
          <span>CODE</span>&nbsp;
          <span style="color: red">*</span>
        </div>
        <span slot="num" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="formFieldName" slot-scope="text, record">
          <a-input
            v-if="record.isEdit"
            :maxLength="32"
            v-model.trim="record.formFieldName"
            placeholder="请输入"
            allowClear
          />
          <span v-else>{{ record.formFieldName || '--' }}</span>
        </span>
        <span slot="formFieldCode" slot-scope="text, record">
          <a-input
            v-if="record.isEdit"
            :maxLength="32"
            v-model.trim="record.formFieldCode"
            placeholder="请输入"
            allowClear
          />
          <span v-else>{{ record.formFieldCode || '--' }}</span>
        </span>
        <span slot="action" slot-scope="text, record, index" class="actions">
          <span v-if="record.isEdit" @click="addFiledData(record, index, 1)">保存</span>
          <span v-else @click="editFiledData(record, index, 1)">修改</span>
          <span @click="deleteFiledData(record, index, 1)">删除</span>
        </span>
      </a-table>
    </a-form-model>

    <!-- 脚部按钮 -->
    <div class="page-footer">
      <a-button @click="forwardStep">取消</a-button>
      <a-button
        @click="onSave(null, 1)"
        :loading="loading.stashLoading"
        v-if="!tempWorkflowModel.status && tempWorkflowModel.status !== 1 && tempWorkflowModel.status !== 2"
      >
        暂存
      </a-button>
      <a-button type="primary" @click="nextStep" :loading="loading.nextStepLoading"> 下一步</a-button>
    </div>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { getCompanyList } from '@/api/company';
import {
  deleteTempFormField,
  saveTempForm,
  selectTempForm,
  storageTempWorkflow,
  updateTempFormField
} from '@/api/process';
import newTextarea from '@/components/textarea/index';
import processUtil from '../processUtil';
import { mapState } from 'vuex';
import { getApplicationList } from '@/api/application';

export default {
  props: {
    defualtTempWorkflowModel: {
      type: Object,
      default: () => {
        return {
          tenantId: null,
          workFlowRepeatType: 1,
          company: {},
          otherCompany: [],
          companyDto: {}
          // otherCompanyModels: []
        };
      }
    },
    defualtFieldTableData: {
      type: Array,
      default: () => []
    },
    defualtFormPersonData: {
      type: Array,
      default: () => []
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
      companyId(state) {
        return state.process.companyId;
      },
      flowChartInfo(state) {
        return state.process.flowChartInfo;
      },
      isEditMode() {
        return this.$route.query.type == 'edit' || this.processDefKey != null;
      }
    })
    // otherCompanyModels() {
    //   let otherCompanyModels = [];
    //   if (this.tempWorkflowModel.otherCompanyIds && this.companyList && this.companyList.length > 0) {
    //     this.tempWorkflowModel.otherCompanyIds.forEach(id => {
    //       let choosedCompany = this.companyList.find(item => {
    //         return item.id == id;
    //       });
    //       otherCompanyModels.push({
    //         companyId: choosedCompany.id,
    //         companyName: choosedCompany.name
    //       });
    //     });
    //   }

    //   return otherCompanyModels;
    // }
  },
  data() {
    const checkProcessName = (rule, value, callback) => {
      if (!value || value.trim().length === 0) {
        callback(new Error('该项为必填项！'));
      } else {
        callback();
        // if (this.$route.query.type == 'edit') {
        //   if (this.$store.state.process.companyName == value) {
        //     callback();
        //   } else {
        //     checkProcessDefName({ processDefName: this.tempWorkflowModel.processDefName }).then(res => {
        //       if (res.data) {
        //         callback(new Error('审批流程名称不可重复！'));
        //       }
        //       callback();
        //     });
        //   }
        // } else {
        //   if (this.$store.state.process.companyName == value) {
        //     callback();
        //   } else {
        //     checkProcessDefName({ processDefName: this.tempWorkflowModel.processDefName }).then(res => {
        //       if (res.data) {
        //         callback(new Error('审批流程名称不可重复！'));
        //       }
        //       callback();
        //     });
        //   }
        // }
      }
    };
    return {
      isEdited: false,
      locale: zhCN,
      loading: {
        stashLoading: false,
        nextStepLoading: false
      },
      tempFormVos: [],
      //应用系统下拉框
      platformList: [],
      //主体下拉框
      companyList: [],
      //审批人去重
      nodeRepeatSel: [],
      //条件类型
      fieldTypeSel: [],
      tempWorkflowModel: {},
      fieldTableData: [],
      formPersonData: [],
      fieldTableColumns: [
        {
          title: '序号',
          align: 'center',
          key: 'num',
          dataIndex: 'num',
          ellipsis: true,
          slots: { title: 'num' },
          scopedSlots: { customRender: 'num' },
          width: 80
        },
        {
          align: 'center',
          key: 'formFieldName',
          dataIndex: 'formFieldName',
          slots: { title: 'formFieldNameTitle' },
          scopedSlots: { customRender: 'formFieldName' },
          width: 180,
          ellipsis: true
        },
        {
          align: 'center',
          key: 'formFieldCode',
          dataIndex: 'formFieldCode',
          slots: { title: 'formFieldCodeTitle' },
          scopedSlots: { customRender: 'formFieldCode' },
          width: 180,
          ellipsis: true
        },
        {
          align: 'center',
          key: 'formFieldType',
          dataIndex: 'formFieldType',
          slots: { title: 'formFieldTypeTitle' },
          scopedSlots: { customRender: 'formFieldType' },
          width: 180,
          ellipsis: true
        },
        {
          align: 'left',
          key: 'formFieldValues',
          dataIndex: 'formFieldValues',
          slots: { title: 'formFieldValueTitle' },
          scopedSlots: { customRender: 'formFieldValues' },
          ellipsis: true
        },
        {
          title: '操作',
          align: 'left',
          dataIndex: 'action',
          width: 150,
          ellipsis: true,
          slots: { title: 'action' },
          scopedSlots: { customRender: 'action' }
        }
      ],
      formPersonColumns: [
        {
          title: '序号',
          align: 'center',
          key: 'num',
          dataIndex: 'num',
          ellipsis: true,
          slots: { title: 'num' },
          scopedSlots: { customRender: 'num' },
          width: 80
        },
        {
          // title: '条件描述',
          align: 'center',
          key: 'formFieldName',
          dataIndex: 'formFieldName',
          slots: { title: 'formFieldNameTitle' },
          scopedSlots: { customRender: 'formFieldName' },
          width: 180,
          ellipsis: true
        },
        {
          // title: 'CODE',
          align: 'center',
          key: 'formFieldCode',
          dataIndex: 'formFieldCode',
          slots: { title: 'formFieldCodeTitle' },
          scopedSlots: { customRender: 'formFieldCode' },
          width: 180,
          ellipsis: true
        },
        {
          title: '操作',
          align: 'left',
          dataIndex: 'action',
          width: 150,
          ellipsis: true,
          slots: { title: 'action' },
          scopedSlots: { customRender: 'action' }
        }
      ],

      rules: {
        tenantId: [{ required: true, trigger: 'blur', message: '该项为必填项！' }],
        companyId: [{ required: true, trigger: 'blur', message: '该项为必填项！' }],
        processDefName: [{ required: true, trigger: 'blur', validator: checkProcessName }],
        workFlowRepeatType: [{ required: true, trigger: 'blur', message: '该项为必填项！' }]
      }
    };
  },

  watch: {
    defualtTempWorkflowModel: {
      handler(newVal) {
        if (newVal) {
          this.tempWorkflowModel = JSON.parse(JSON.stringify(newVal)) || {};
        }
      },
      deep: true,
      immediate: true
    },
    defualtFieldTableData: {
      handler(newVal) {
        this.fieldTableData = JSON.parse(JSON.stringify(newVal)) || [];
      },
      deep: true,
      immediate: true
    },
    defualtFormPersonData: {
      handler(newVal) {
        this.formPersonData = JSON.parse(JSON.stringify(newVal)) || [];
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.fieldTypeSel = processUtil.fieldTypeSel;
    getApplicationList().then(res => {
      this.platformList = res.data;
    });
    this.nodeRepeatSel = processUtil.nodeRepeatSel;
  },
  mounted() {
    getCompanyList().then(res => {
      this.companyList = res.data;
    });
  },

  components: { 'new-textarea': newTextarea },
  methods: {
    /**
     * 获得临时表单数据
     */
    getTempFormList() {
      selectTempForm({ processDefKey: this.processDefKey }).then(res => {
        this.tempFormInfo = res.data;
        this.fieldTableData = res.data.tempFormVos;
        this.formPersonData = res.data.peopleFormVos;
        this.$store.dispatch('process/changeConditionList', res.data.tempFormVos);
        this.$store.dispatch('process/changeFormPersonList', res.data.peopleFormVos);
      });
    },

    /**
     * 新增一行
     */
    addRow(type) {
      if (type == 0) {
        this.fieldTableData.push({ isEdit: true });
      } else {
        this.formPersonData.push({ isEdit: true });
      }
    },
    /**
     * 新增/修改分支条件
     */
    addFiledData(item, index, type) {
      const promise = new Promise((resolve, inject) => {
        let errorArr = [];
        if (type == 0) {
          if (!item.formFieldName || !item.formFieldCode || !item.formFieldType) {
            errorArr = [...errorArr, '输入不可为空！'];
          }
          if ((item.formFieldType == 2 || item.formFieldType == 4) && !item.formFieldValues) {
            errorArr = [...errorArr, '输入不可为空！'];
          }
        } else {
          if (!item.formFieldName || !item.formFieldCode) {
            errorArr = [...errorArr, '条件描述和CODE不可为空！'];
          }
        }
        if (errorArr.length) {
          inject(errorArr);
        } else {
          resolve();
        }
      });
      promise.then(
        resolve => {
          let param = {};
          param.formFieldCode = item.formFieldCode;
          param.formFieldName = item.formFieldName;
          param.formFlag = type;
          param.processDefKey = this.processDefKey;
          param.formFieldId = item.tempFormId;
          if (type == 0) {
            param.formFieldType = item.formFieldType;
            param.formFieldValues = item.formFieldValues;
          }
          if (!this.processDefKey) {
            this.onSave(res => {
              param.processDefKey = this.processDefKey || res.data.processDefKey;
              saveTempForm(param).then(res => {
                this.$message.success('保存成功');
                item.isEdit = false;
                item.tempFormId = res.data.tempFormId;
              });
            });
          } else {
            if (item.tempFormId && item.tempFormId !== 0) {
              updateTempFormField(param).then(res => {
                this.$message.success('修改成功');
                item.isEdit = false;
              });
            } else {
              saveTempForm(param).then(res => {
                this.$message.success('保存成功');
                item.isEdit = false;
                item.tempFormId = res.data.tempFormId;
              });
            }
          }
        },
        err => {
          this.$message.error(err[0]);
        }
      );
    },
    /**
     * 修改分支条件
     */
    editFiledData(item, index, type) {
      if (type == 0) {
        this.$set(this.fieldTableData[index], 'isEdit', true);
      } else {
        this.$set(this.formPersonData[index], 'isEdit', true);
      }
    },
    /**
     * 删除分支条件
     */
    deleteFiledData(item, index, type) {
      if (item.isEdit) {
        if (type == 0) {
          this.fieldTableData.splice(index, 1);
        } else {
          this.formPersonData.splice(index, 1);
        }
        return;
      }
      if (!item.tempFormId) {
        this.$message.info('表单ID不存在，请刷新重试！');
      } else {
        deleteTempFormField({ tempFormId: item.tempFormId }).then(res => {
          this.$message.success('删除成功');
          if (type == 0) {
            this.fieldTableData.splice(index, 1);
          } else {
            this.formPersonData.splice(index, 1);
          }
        });
      }
    },

    //主体下拉框选择
    chooseCompany(item, type) {
      // if (type == 1) {
      this.tempWorkflowModel.companyDto = item;
      // } else {
      //   this.tempWorkflowModel.otherCompanyModels = this.tempWorkflowModel.otherCompanyModels || [];
      //   this.tempWorkflowModel.otherCompanyModels.push(item);
      // }
    },
    //其它适用主体-删除
    delectOtherCompany(index, item) {
      this.tempWorkflowModel.otherCompanyIds.splice(index, 1);
    },
    /**
     * 暂存
     * flag 1:暂存  2:下一步 （区分loading）
     */
    onSave(callback = null, flag) {
      this.$refs.basicInfoForm.validate(valid => {
        if (valid) {
          // 暂存基础信息
          let baseInfoParam = {};
          baseInfoParam.processDefKey = this.tempWorkflowModel.processDefKey || this.processDefKey;
          baseInfoParam.processDefName = this.tempWorkflowModel.processDefName;
          baseInfoParam.tenantId = this.tempWorkflowModel.tenantId;
          baseInfoParam.companyDto = {
            companyId: this.tempWorkflowModel.companyDto.id || this.tempWorkflowModel.companyDto.companyId,
            companyName: this.tempWorkflowModel.companyDto.name || this.tempWorkflowModel.companyDto.companyName
          };
          // baseInfoParam.otherCompanyModels = [];
          // this.otherCompanyModels.forEach(item => {
          //   baseInfoParam.otherCompanyModels.push({
          //     companyId: item.companyId,
          //     companyName: item.companyName
          //   });
          // });
          baseInfoParam.remark = this.tempWorkflowModel.remark;
          baseInfoParam.workFlowRepeatType = this.tempWorkflowModel.workFlowRepeatType;
          baseInfoParam.createName = this.createName;
          baseInfoParam.uploadUser = this.createName;

          if (flag == 1) {
            this.loading.stashLoading = true;
          } else if (flag == 2) {
            this.loading.nextStepLoading = true;
          }
          storageTempWorkflow({ tempWorkflowModel: baseInfoParam }).then(
            res => {
              let processDefKey = res.data.processDefKey;
              this.$store.dispatch('process/changeProcessDefKey', processDefKey);
              this.$store.dispatch('process/changeCompanyId', this.tempWorkflowModel.companyDto.id);
              this.$store.dispatch('process/changeCompanyName', this.tempWorkflowModel.processDefName);
              this.loading.stashLoading = false;
              this.loading.nextStepLoading = false;
              this.$message.success('暂存成功');
              if (callback && typeof callback == 'function') {
                callback(res);
              }
            },
            err => {
              this.loading.stashLoading = false;
              this.loading.nextStepLoading = false;
            }
          );
        }
      });
    },

    onSelectChange(value, index) {
      this.fieldTableData[index].formFieldValues = value.map(item => item.replace(/[^\d.]/g, ''));
      this.fieldTableData[index].formFieldValues = this.fieldTableData[index].formFieldValues.filter(
        item => item.length > 0
      );
    },

    /**
     * 备注
     */
    changeVal(value) {
      this.tempWorkflowModel.remark = value;
      this.isEdited = true;
    },

    transfer(id) {
      return this.fieldTypeSel.find(item => item.id == id).name;
    },

    /**
     * 取消
     */
    forwardStep() {
      this.$router.replace({
        path: '/process'
      });
    },

    /**
     * 下一步
     */
    nextStep() {
      if (this.isEditMode) {
        if (this.isEdited) {
          this.onSave(() => {
            this.$emit('nextStep');
          }, 2);
        } else {
          this.$emit('nextStep');
        }
      } else {
        this.onSave(() => {
          this.$emit('nextStep');
        }, 2);
      }
    },
    // 过滤搜索内容
    filterSearchOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.page-detail {
  margin-top: 20px;
  padding-bottom: 35px;
}

.editor-box,
.editor-input {
  height: 60px;
}

.checked-row {
  margin-top: 2px;
  margin-bottom: 20px;
  margin-left: 100px;
}
</style>
