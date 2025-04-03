<template>
  <div>
    <a-modal width="800px" centered v-model="visible" title="选择成员" cancelText="取消" okText="确定" @ok="handleOk">
      <div class="content">
        <div class="top" v-if="chooseUsers.length">
          <div class="checked-row">
            <span class="title">已选：</span>
            <div class="item" v-for="(item, index) in chooseUsers" :key="index" :value="index">
              <span>{{ item.name }}</span>
              <a-icon type="close" @click="deleteUser(item, index)" />
            </div>
            <span v-if="chooseUsers.length" class="clear" @click="clearAll">清空</span>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="box tree-box">
              <a-select
                allowClear
                showSearch
                class="search"
                @select="onSearch"
                placeholder="请搜索"
                v-model="searchValue"
                :not-found-content="null"
                :filterOption="searchFilterOption"
              >
                <span slot="suffixIcon">
                  <a-icon type="search" slot="prefix" />
                </span>
                <span slot="placeholder">搜索</span>
                <a-select-option v-for="(item, index) in flattenData" :value="index" :key="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
              <div class="tabs">
                <p :class="currentTab === 1 ? 'active' : isSwitchable ? '' : 'un-active'" @click="changeTab(1)">
                  组织架构
                </p>
                <p :class="currentTab === 2 ? 'active' : isSwitchable ? '' : 'un-active'" @click="changeTab(2)">
                  角色列表
                </p>
              </div>
              <div class="tree">
                <a-tree
                  show-icon
                  default-expand-all
                  @select="onSelect"
                  :tree-data="currentTab === 1 ? orgData : roleData"
                  v-if="currentTab === 1 ? orgData.length : roleData.length"
                  :replace-fields="currentTab === 1 ? orgReplaceFields : roleReplaceFields"
                >
                  <a-icon slot="switcherIcon" type="down" />
                </a-tree>
              </div>
            </div>
          </div>
          <div class="right">
            <div class="box items-box">
              <div class="items">
                <div class="item" v-for="(item, index) in rightUserData" :key="index" @click="onChoose(item, index)">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import SipaJs from 'sipa-boot-sdk-js';
import { treeToArray } from '@/utils/func';
import { getCompanyUsers, getOrganizationTree, getOrgConfLabelTree, getUsersByOrgLevel } from '@/api/company';

export default {
  props: {
    companyId: {
      type: Number
    },
    defaultChooseUsers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      // true tab可切换; false 不可切换
      isSwitchable: true,
      // true 复选; false 单选
      isMultiple: true,
      // 当前tab 1:组织架构 2:角色
      currentTab: 1,
      // 搜索框数据
      searchValue: undefined,
      // 搜索框下拉数组
      flattenData: [],
      // 组织架构-树状图数据
      orgData: [],
      orgDataArray: [],
      orgReplaceFields: {
        children: 'childOrganizations',
        title: 'completeName',
        key: 'id'
      },
      // 角色列表-树状图数据
      roleData: [],
      roleDataArray: [],
      roleReplaceFields: {
        children: 'roles',
        title: 'completeName',
        key: 'id'
      },
      rightUserData: [],
      chooseUsers: []
    };
  },
  watch: {
    visible() {
      this.searchValue = undefined;
    }
  },
  methods: {
    init() {
      this.rightUserData.splice(0, this.rightUserData.length);
      this.flattenData.splice(0, this.flattenData.length);
      this.chooseUsers = this.defaultChooseUsers;
      this.getTreeData();
    },
    // tab 切换
    changeTab(tab) {
      if (this.currentTab === tab) return;
      if (!this.isSwitchable) return;
      this.currentTab = tab;
      this.flattenData.splice(0, this.flattenData.length);
      this.rightUserData.splice(0, this.rightUserData.length);
      if (tab === 1) {
        this.orgDataArray.forEach(item => {
          this.flattenData.push(item);
          this.rightUserData.push(item);
        });
      } else {
        this.roleDataArray.forEach(item => {
          this.flattenData.push(item);
        });
      }
    },
    // 获得接口数据
    getTreeData() {
      getOrganizationTree({ companyId: this.companyId }).then(res => {
        this.orgData = res.data;
        this.getChildNodeNum(this.orgData);
        //获得所有人员信息-下拉框数据
        getCompanyUsers({
          ids: [this.companyId]
        }).then(res => {
          res.data.forEach(item => {
            item.type = 'user';
          });
          this.orgDataArray = res.data;
        });
        if (this.currentTab === 1) {
          this.orgDataArray.forEach(item => {
            this.flattenData.push(item);
            this.rightUserData.push(item);
          });
        }
      });
      getOrgConfLabelTree({ ids: [this.companyId] }).then(res => {
        this.roleData = res.data.filter(item => item.id !== SipaJs.APPLICATION_ID_CP_PROCESS);
        this.fixRoleData(this.roleData);
        this.roleDataArray = treeToArray(this.roleData, 'roles');
        if (this.currentTab === 2) {
          this.roleDataArray.forEach(item => {
            item.type = 'role';
            this.flattenData.push(item);
          });
        }
      });
    },
    // 递归统计节点数量
    getChildNodeNum(arr) {
      arr.map(item => {
        item.completeName = `${item.name}  (${item.accountCount || 0}人)`;
        if (item.childOrganizations && item.childOrganizations.length) {
          this.getChildNodeNum(item.childOrganizations);
        }
      });
    },
    // 补充角色名称
    fixRoleData(arr) {
      arr.map(item => {
        item.completeName = item.name;
        item.type = 'role';
        if (item.roles && item.roles.length) {
          this.fixRoleData(item.roles);
        }
      });
    },
    // 下拉框过滤事件
    searchFilterOption(inputValue, option) {
      const targetValue = option.componentOptions.children[0].text;
      return targetValue.search(inputValue) !== -1;
    },
    // 下拉框搜索
    onSearch(value) {
      if (!value) {
        return false;
      }
      if (!this.isMultiple) {
        this.chooseUsers.splice(0, this.chooseUsers.length);
      }
      this.chooseUsers.push(this.flattenData[value]);
    },
    //  层级树结构节点点击事件
    onSelect(selectedKeys, e) {
      if (this.currentTab === 1) {
        if (e.selected) {
          let param = {
            pageNum: 1,
            pageSize: 9999,
            orgId: selectedKeys[0],
            companyId: this.companyId
          };
          getUsersByOrgLevel(param).then(res => {
            this.rightUserData.splice(0, this.rightUserData.length);
            res.data.records.forEach(item => {
              item.type = 'user';
              this.rightUserData.push(item);
            });
          });
        }
      } else {
        if (selectedKeys && selectedKeys.length > 0) {
          // 角色组不可选择
          if (e.node.dataRef.roles) {
            return;
          }
          // 该角色已选
          for (let i in this.chooseUsers) {
            if (this.chooseUsers[i].id === selectedKeys[0]) {
              return;
            }
          }
          let chooseRole = this.roleDataArray.find(item => item.id === selectedKeys[0]);
          if (!this.isMultiple) {
            this.chooseUsers.splice(0, this.chooseUsers.length);
          }
          this.chooseUsers.push(chooseRole);
        }
      }
    },
    // 选择用户
    onChoose(item) {
      for (let i in this.chooseUsers) {
        if (this.currentTab === 1 && this.chooseUsers[i].id === item.id) {
          return;
        }
        if (this.currentTab === 2 && this.chooseUsers[i].id === item.id) {
          return;
        }
      }
      if (!this.isMultiple) {
        this.chooseUsers.splice(0, this.chooseUsers.length);
      }
      this.chooseUsers.push(item);
    },
    // 删除单个用户
    deleteUser(item, index) {
      this.chooseUsers.splice(index, 1);
    },
    // 清空用户
    clearAll() {
      this.chooseUsers.splice(0, this.chooseUsers.length);
    },
    // 确定
    handleOk() {
      if (this.chooseUsers.length === 0) {
        this.$message.error({ content: '您未选择成员！' });
        return;
      }
      this.$emit('onChoose', this.chooseUsers || []);
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  min-width: inherit;

  .top {
    margin-bottom: 8px;

    .title {
      font-weight: 500;
      font-size: 14px;
      color: #333333;
      margin-bottom: 8px;
    }
  }

  .bottom {
    display: flex;

    .title {
      font-weight: 500;
      font-size: 14px;
      color: #333333;
      margin-bottom: 8px;
    }

    .box {
      width: 100%;
      height: 350px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px solid #d8d8d8;
      padding: 20px 16px;
    }

    .tabs {
      display: flex;
      width: 100%;
      margin-top: 16px;

      p {
        width: 50%;
        height: 28px;
        line-height: 28px;
        background: #ffffff;
        border-radius: 2px 0 0 2px;
        font-size: 12px;
        color: #333333;
        border: 1px solid #d8d8d8;
        border-right: none;
        text-align: center;
      }

      p:last-child {
        border-right: 1px solid #d8d8d8;
      }

      .active {
        color: #1890ff;
        border: 1px solid #2093fe !important;
      }

      .un-active {
        color: #d8d8d8;
      }
    }

    .left {
      width: 340px;

      .search {
        width: 100%;
      }

      .tree-box {
        ::v-deep .ant-select {
          .ant-select-selection {
            height: 28px;
            background: #ffffff;
            border-radius: 2px;
            border: 1px solid #d8d8d8;
          }

          .ant-select-selection__placeholder {
            height: 26px;
            line-height: 24px;
            font-size: 12px;
          }

          .ant-select-selection-selected-value {
            height: 26px;
            line-height: 24px;
            font-size: 12px;
          }
        }

        .tree {
          height: 226px;
          overflow-y: auto;
        }
      }
    }

    .right {
      width: 340px;
      margin-left: 40px;
      // margin-top: 28px;
      .items-box {
        .items {
          height: 310px;
          overflow-y: auto;

          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #333333;
            font-size: 12px;
            margin-bottom: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
