<template>
  <a-drawer class="drawer" :width="460" :visible="visible" :closable="false">
    <div slot="title">
      <div v-if="!isEdit">
        <span>{{ title }}</span>
        <div class="img" @click="isEdit = enabled && true">
          <image-icon icon="other/edit" width="14" height="14"></image-icon>
        </div>
      </div>
      <a-input v-else autoFocus v-model="title" allowClear @blur="isEdit = false" :maxLength="20"></a-input>
    </div>
    <a-form layout="vertical">
      <a-row>
        <a-col>
          <a-form-item label="抄送人：">
            <a-select
              placeholder="请选择"
              v-model="nodePersonnelType"
              :dropdownMatchSelectWidth="false"
              allowClear
              :disabled="!enabled"
            >
              <a-select-option
                @click="onSelect"
                v-for="(item, index) in userType"
                :key="item.id"
                :value="item.id"
                :index="index"
                >{{ item.name }}
              </a-select-option>
            </a-select>
            <div class="checked-row">
              <div class="item" v-for="(item, index) in chooseUsers" :key="index" :value="index">
                <span>{{ item.name }}</span>
                <a-icon type="close" @click="deleteUser(index, item)" />
              </div>
              <span v-if="chooseUsers.length && enabled" class="clear" @click="clearAll">清空</span>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="footer">
      <a-button @click="onClose">取消</a-button>
      <a-button type="primary" @click="onConfirm" v-if="enabled">确定</a-button>
    </div>
    <organizationDialog
      ref="organizationDialog"
      :companyId="companyId"
      @onChoose="finishedChooseUsers"
      :defaultChooseUsers="chooseUsers"
    />
  </a-drawer>
</template>

<script>
import { mapState } from 'vuex';
import { getLabelByCodes } from '@/api/company';
import organizationDialog from '../../components/organizationDialog';

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
      visible: false,
      userType: [
        { id: 10, name: '指定成员' },
        { id: 14, name: '添加标签' },
        { id: 13, name: '直属主管' }
      ],
      nodePersonnelType: null,
      chooseUsers: []
    };
  },

  components: { organizationDialog },

  computed: {
    ...mapState({
      companyId(state) {
        return state.process.companyId;
      }
    })
  },

  watch: {
    async visible(value) {
      if (value && this.chooseUsers.length > 0) {
        const users = this.chooseUsers.filter(item => typeof item === 'object');
        const codes = this.chooseUsers.filter(item => typeof item === 'string');

        const nodeValue = [];
        const codeList = [];

        users.forEach(item => {
          nodeValue.push({ name: item.name, account: item.id, type: 'user' });
        });

        const code = codes.filter(item => item !== 'R00008');
        const { data } = await getLabelByCodes({ ids: code });
        data.forEach(item => {
          codeList.push({ code: item.id, name: item.name, type: 'role' });
        });

        codes.includes('R00008') && codeList.push({ code: 'R00008', name: '直属主管', type: 'role' });

        this.chooseUsers = nodeValue.concat(codeList);
      }
    }
  },

  methods: {
    onSelect(e) {
      if (e.key === 10 || e.key === 14) {
        this.$refs.organizationDialog.currentTab = e.key === 10 ? 1 : 2;
        this.$refs.organizationDialog.visible = true;
        this.$refs.organizationDialog.init();
      } else {
        const isExit = this.chooseUsers.find(item => item.code === 'R00008');
        if (isExit) return;
        this.chooseUsers.push({ type: 'role', code: 'R00008', name: '直属主管' });
      }
    },

    finishedChooseUsers(result) {
      this.chooseUsers = this.chooseUsers.filter(item => item.code === 'R00008');
      result.forEach(item => {
        this.chooseUsers.push(item);
      });
    },

    /**
     * 删除已选用户
     */
    deleteUser(index) {
      if (this.enabled) {
        this.chooseUsers.splice(index, 1);
        if (this.chooseUsers.length === 0) this.nodePersonnelType = null;
      }
    },

    /**
     * 清空
     */
    clearAll() {
      this.chooseUsers = [];
      this.nodePersonnelType = null;
    },

    onClose() {
      this.visible = false;
    },

    onConfirm() {
      const users = this.chooseUsers.filter(item => item.type === 'user');
      const roles = this.chooseUsers.filter(item => item.type === 'role');

      let nodePersonnelType = null;
      const nodeValue = [];
      const codes = [];

      users.forEach(item => {
        nodeValue.push({ name: item.name, account: item.id });
      });
      roles.forEach(item => {
        codes.push(item.id);
      });

      if (codes.length === 0) {
        if (users.length > 0) {
          nodePersonnelType = 10;
        }
      } else {
        if (users.length > 0) {
          nodePersonnelType = 16;
        } else {
          if (codes.length === 1) {
            if (codes[0] === 'R00008') {
              nodePersonnelType = 13;
            } else {
              nodePersonnelType = 14;
            }
          } else {
            nodePersonnelType = 14;
          }
        }
      }
      const userContent = users.map(item => item.name).join('，');
      const roleContent = roles.map(item => item.name).join('，');
      let content = null;
      if (this.chooseUsers.length > 0) {
        if (roleContent.length === 0) {
          content = userContent;
        } else if (userContent.length === 0) {
          content = roleContent;
        } else {
          content = `${userContent}，${roleContent}`;
        }
        content = content.length > 18 ? `${content.slice(0, 18)}...` : content;
      }
      const copyData = { title: this.title, nodeValue, code: codes, nodePersonnelType, content };
      this.$emit('onDrawerConfirm', copyData);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.checked-row {
  margin-top: 12px;
  margin-bottom: 50px;
}
</style>
