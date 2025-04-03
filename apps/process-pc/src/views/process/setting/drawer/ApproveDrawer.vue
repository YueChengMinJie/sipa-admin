<template>
  <a-drawer class="drawer" :width="460" :visible="visible" :closable="false">
    <div slot="title">
      <div v-if="!isEdit">
        <span>{{ title || '--' }}</span>
        <div class="img" @click="isEdit = enabled && true">
          <image-icon icon="other/edit" width="14" height="14"></image-icon>
        </div>
      </div>
      <a-input v-else autoFocus v-model="title" allowClear @blur="isEdit = false" :maxLength="20"></a-input>
    </div>
    <a-form layout="vertical">
      <div class="content-box">
        <p class="title">设置审批人</p>
        <a-radio-group v-model="nodePersonnelType" @change="onChange" :disabled="!enabled">
          <a-radio v-for="(item, index) in chooseType" :key="index" :value="item.id">
            {{ item.name }}
          </a-radio>
        </a-radio-group>
        <a-button v-show="btnVisible && enabled" class="btn" @click="addUser">{{ btnName }}</a-button>
        <div v-if="nodePersonnelType === 10 || nodePersonnelType === 14" class="checked-row">
          <div class="item" v-for="(item, index) in chooseUsers" :key="index" :value="index">
            <span>{{ item.name }}</span>
            <a-icon type="close" @click="deleteUser(index, item)" />
          </div>
          <span v-if="chooseUsers.length && enabled" class="clear" @click="clearAll">清空</span>
        </div>
        <p v-if="nodePersonnelType === 15" class="desc">发起人自己将作为审批人处理审批单</p>
      </div>
      <div class="content-box" v-if="nodePersonnelType === 20">
        <p class="title">请选择表单中的人的类型</p>
        <a-radio-group v-model="formId" style="width: 100%" @change="onChange">
          <a-radio v-for="(item, index) in formPersonList" :key="index" :value="item.tempFormId">
            {{ item.formFieldName }}
          </a-radio>
        </a-radio-group>
        <div class="flex align-center" v-if="formId">
          <span class="related-button" @click="addUser">关联标签</span>
          <div class="checked-row" style="padding-top: 0">
            <div class="item" v-for="(item, index) in chooseUsers" :key="index" :value="index">
              <span>{{ item.name }}</span>
              <a-icon type="close" @click="deleteUser(index, item)" />
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <p class="title">多人审批时采用的审批方式</p>
        <a-radio-group v-model="approvalType" class="radio-vertical" :disabled="!enabled">
          <a-radio v-for="(item, index) in approveType" :key="index" :value="item.id">
            {{ item.name }}
          </a-radio>
        </a-radio-group>
      </div>
      <div class="content-box">
        <p class="title">审批人去重</p>
        <a-select placeholder="请选择" v-model="nodeRepeatType" :disabled="!enabled">
          <a-select-option v-for="item in repeatType" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </div>
      <div class="content-box">
        <p class="title">是否为特殊节点</p>
        <a-radio-group v-model="isSpecialNode" class="radio-horizontal" :disabled="!enabled">
          <a-radio v-for="(item, index) in specialNodeType" :key="index" :value="item.id">
            {{ item.name }}
          </a-radio>
        </a-radio-group>
      </div>
      <div class="content-box" v-if="isSpecialNode === 1">
        <p class="title">特殊节点备份数据</p>
        <new-textarea
          :disabled="!enabled"
          :maxlength="maxlength"
          v-model.trim="specialBackMsg"
          placeholder="请输入"
          class="editor-input"
        />
      </div>
    </a-form>
    <div class="footer">
      <a-button @click="onClose">取消</a-button>
      <a-button type="primary" @click="onConfirm" v-if="enabled">确定</a-button>
    </div>
    <organizationDialog
      :companyId="companyId"
      ref="organizationDialog"
      @onChoose="finishedChooseUsers"
      :defaultChooseUsers="chooseUsers"
    />
  </a-drawer>
</template>

<script>
import { mapState } from 'vuex';
import { getLabelByCodes } from '@/api/company';
import newTextarea from '@/components/textarea/index';
import organizationDialog from '../../components/organizationDialog.vue';

export default {
  props: {
    enabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isEdit: false,
      title: '',
      nodePersonnelType: 10,
      chooseType: [
        { id: 10, name: '指定成员' },
        { id: 14, name: '指定角色' },
        { id: 13, name: '直属主管' },
        { id: 17, name: '发起人自选' },
        { id: 15, name: '发起人自己' },
        { id: 20, name: '表单中的人' }
      ],
      approvalType: null,
      approveType: [
        { id: 2, name: '会签（需所有人同意）' },
        { id: 3, name: '或签（一位审批人同意或拒绝即可）' }
      ],
      visible: false,
      chooseUsers: [],
      nodeRepeatType: null,
      repeatType: [
        { id: 1, name: '开启' },
        { id: 2, name: '关闭' }
      ],
      formId: null,
      isSpecialNode: 0,
      specialBackMsg: null,
      maxlength: 1000,
      specialNodeType: [
        { id: 1, name: '是' },
        { id: 0, name: '否' }
      ]
    };
  },
  components: { organizationDialog, newTextarea },
  computed: {
    ...mapState({
      companyId(state) {
        return state.process.companyId;
      },
      formPersonList(state) {
        return state.process.formPersonList;
      }
    }),
    btnVisible() {
      return this.nodePersonnelType === 10 || this.nodePersonnelType === 14;
    },
    btnName() {
      if (this.nodePersonnelType === 10) {
        if (this.chooseUsers.length > 0) {
          return '修改成员';
        } else {
          return '添加成员';
        }
      } else if (this.nodePersonnelType === 14) {
        if (this.chooseUsers.length > 0) {
          return '修改角色';
        } else {
          return '添加角色';
        }
      }
      return null;
    }
  },
  watch: {
    visible(value) {
      if (value && this.chooseUsers.length > 0) {
        if (this.nodePersonnelType === 10) {
          this.chooseUsers = this.chooseUsers.map(item => {
            return {
              id: item.id,
              name: item.name
            };
          });
        } else if (this.nodePersonnelType === 14 || this.nodePersonnelType === 20) {
          this.getCodeName(this.chooseUsers);
        }
      }
    }
  },
  methods: {
    async getCodeName(users) {
      try {
        const { data } = await getLabelByCodes({ ids: users.map(item => item.id) });
        this.chooseUsers = data;
      } catch (error) {
        console.error(error);
      }
    },

    onChange() {
      this.chooseUsers = [];
    },

    addUser() {
      if (this.nodePersonnelType === 10) {
        this.$refs.organizationDialog.currentTab = 1;
        this.$refs.organizationDialog.isMultiple = true;
      } else if (this.nodePersonnelType === 14) {
        this.$refs.organizationDialog.currentTab = 2;
        this.$refs.organizationDialog.isMultiple = true;
      } else if (this.nodePersonnelType === 20) {
        this.$refs.organizationDialog.currentTab = 2;
        this.$refs.organizationDialog.isMultiple = false;
      }
      this.$refs.organizationDialog.visible = true;
      this.$refs.organizationDialog.isSwitchable = false;
      this.$refs.organizationDialog.init();
    },

    finishedChooseUsers(result) {
      this.chooseUsers = result;
    },

    /**
     * 删除已选用户
     */
    deleteUser(index) {
      this.enabled && this.chooseUsers.splice(index, 1);
    },

    /**
     * 清空
     */
    clearAll() {
      this.chooseUsers = [];
    },

    onClose() {
      this.visible = false;
    },

    onConfirm() {
      let copyData = {};
      if (this.nodePersonnelType === 10) {
        const nodeValue = [];
        this.chooseUsers.forEach(item => {
          nodeValue.push({ name: item.name, account: item.id });
        });
        copyData.nodeValue = nodeValue;
        let content = null;
        if (nodeValue.length > 0) {
          content = nodeValue.map(item => item.name).join('，');
          content = content.length > 18 ? `${content.slice(0, 18)}...` : content;
        }
        copyData.content = content;
        copyData.code = [];
      } else if (this.nodePersonnelType === 14) {
        const codes = [];
        this.chooseUsers.forEach(item => {
          codes.push(item.id);
        });
        copyData.code = codes;
        let content = null;
        if (codes.length > 0) {
          content = this.chooseUsers.map(item => item.name).join('，');
          content = content.length > 18 ? `${content.slice(0, 18)}...` : content;
        }
        copyData.content = content;
        copyData.nodeValue = [];
      } else if (this.nodePersonnelType === 13) {
        copyData.code = ['R00008'];
        copyData.content = '直属主管';
        copyData.nodeValue = [];
      } else if (this.nodePersonnelType === 17) {
        copyData.code = ['R00006'];
        copyData.content = '发起人自选';
        copyData.nodeValue = [];
      } else if (this.nodePersonnelType === 15) {
        copyData.code = ['R00009'];
        copyData.content = '发起人自己';
        copyData.nodeValue = [];
      } else if (this.nodePersonnelType === 20) {
        const codes = [];
        this.chooseUsers.forEach(item => {
          codes.push(item.code);
        });
        copyData.code = codes;
        copyData.formId = this.formId;
        copyData.content = '表单中的人';
        copyData.nodeValue = [];
      }
      copyData.nodeRepeatType = this.nodeRepeatType;
      copyData.approvalType = this.approvalType;
      copyData.nodePersonnelType = this.nodePersonnelType;
      copyData.title = this.title;
      copyData.special = this.isSpecialNode;
      copyData.specialBackMsg = this.specialBackMsg;
      this.$emit('onDrawerConfirm', copyData);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .ant-drawer-body {
  padding: 0;

  .ant-radio-wrapper {
    width: calc(100% / 3);
    height: 16px;
    margin-right: 0;
    margin-bottom: 16px;
  }

  .radio-vertical .ant-radio-wrapper {
    width: 100%;
  }

  .radio-horizontal .ant-radio-wrapper {
    width: auto;
    margin-right: 20px;
  }
}

.content-box {
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;

  .title {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
    margin-bottom: 16px;
  }

  .desc {
    margin-top: 20px;
    font-size: 12px;
    color: #333333;
  }

  .btn {
    margin-top: 4px;
  }

  .editor-input {
    height: 80px;
    word-break: break-all;
    border-radius: 2px;
  }
}

.content-box:last-child {
  border-bottom: none;
}

.checked-row {
  padding-top: 12px;
}

.related-button {
  font-size: 10px;
  color: #40a9ff;
  cursor: pointer;
  margin-right: 16px;
}
</style>
