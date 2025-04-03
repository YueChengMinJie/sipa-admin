<template>
  <div class="page-box">
    <a-form
      v-if="!isShowDrawer"
      :model="searchConfig"
      :labelCol="{ style: 'width: 100px' }"
      :wrapperCol="{ style: 'width:70%' }"
      class="baseline"
    >
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item label="审批流程名称">
            <a-input :maxLength="50" v-model.trim="searchConfig.processDefName" placeholder="请输入" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="审批流程代码">
            <a-input :maxLength="50" v-model.trim="searchConfig.processDefKey" placeholder="请输入" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="适用商户/组织">
            <a-select
              placeholder="请选择"
              v-model.trim="searchConfig.companyId"
              :dropdownMatchSelectWidth="false"
              allowClear
              showSearch
              :filter-option="filterSearchOption"
            >
              <a-select-option :value="item.id" v-for="item in companyList" :key="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- <a-col :span="5">
          <a-form-item label="其它适用主体">
            <a-select
              placeholder="请选择"
              v-model.trim="searchConfig.otherCompanyId"
              :dropdownMatchSelectWidth="false"
              allowClear
              showSearch
              :filter-option="filterSearchOption"
            >
              <a-select-option :value="item.id" v-for="item in companyList" :key="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <a-col :span="6">
          <div class="btns">
            <a-button @click="() => (this.isShowDrawer = true)"> 展开</a-button>
            <a-button type="primary" @click="search">查询</a-button>
          </div>
        </a-col>
      </a-row>
    </a-form>
    <a-form
      v-if="isShowDrawer"
      class="search-form-dropDown baseline"
      :labelCol="{ style: 'width: 100px' }"
      :wrapperCol="{ style: 'width:70%' }"
    >
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item label="审批流程名称">
            <a-input v-model.trim="searchConfig.processDefName" placeholder="请输入" :maxLength="32" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="审批流程代码">
            <a-input :maxLength="50" v-model.trim="searchConfig.processDefKey" placeholder="请输入" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="适用商户/组织">
            <a-select
              placeholder="请选择"
              v-model.trim="searchConfig.companyId"
              :dropdownMatchSelectWidth="false"
              allowClear
            >
              <a-select-option :value="item.id" v-for="item in companyList" :key="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- <a-col :span="5">
          <a-form-item label="其它适用主体">
            <a-select
              placeholder="请选择"
              v-model.trim="searchConfig.otherCompanyId"
              :dropdownMatchSelectWidth="false"
              allowClear
            >
              <a-select-option :value="item.id" v-for="item in companyList" :key="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col> -->
        <a-col :span="6">
          <a-form-item label="流程状态">
            <a-select
              placeholder="请选择"
              v-model.trim="searchConfig.status"
              :dropdownMatchSelectWidth="false"
              allowClear
            >
              <a-select-option :value="item.id" v-for="item in processStatusSel" :key="item.id"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24" class="btns">
          <a-button @click="isShowDrawer = false"> 收起</a-button>
          <a-button @click="reset"> 重置</a-button>
          <a-button
            type="primary"
            @click="
              search(() => {
                isShowDrawer = false;
              })
            "
          >
            确定
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    <div class="functions">
      <a-button @click="toAdd">新建审批流程</a-button>
      <a-button @click="onImport" style="margin-left: 16px">导入</a-button>
    </div>

    <a-table
      :components="tabComponents"
      :columns="columns"
      :data-source="dataList"
      :pagination="false"
      :locale="{ emptyText: '暂无数据' }"
      :scroll="{ x: 1900 }"
      rowKey="processDefKey"
      bordered
    >
      <span slot="processDefKey" slot-scope="text, item">
        <span v-if="item.released === 0">
          {{ text }}
        </span>
        <a
          v-else-if="item.released === 1"
          href="javascript:;"
          @click="$router.push({ path: '/process/view', query: { processDefKey: text } })"
        >
          {{ text }}
        </a>
      </span>
      <div slot="tenantId" slot-scope="text">
        <span>{{ platformList && platformList.get(text) }}</span>
      </div>
      <div slot="companyName" slot-scope="text, item">
        <span>{{ item.companyDto.companyName || '--' }}</span>
      </div>
      <div slot="otherCompanyNames" slot-scope="text, item">
        <span>{{ getOtherConpanyName(item.otherCompanyModels) || '--' }}</span>
      </div>
      <div slot="status" slot-scope="text">
        <span>{{ processStatusSel[text].name || '--' }}</span>
      </div>
      <div slot="action" class="actions" slot-scope="text, item">
        <router-link
          :to="{
            path: '/process/setting',
            query: {
              processDefKey: item.processDefKey,
              type: 'edit'
            }
          }"
        >
          修改
        </router-link>
        <!-- <span @click="onCopy(item)">复制</span> -->
        <a-popconfirm
          v-if="item.status == 1"
          title="是否确认停用该流程"
          ok-text="是"
          cancel-text="否"
          @confirm="updateWorkFlowStatus(item, 2)"
        >
          <span>停用</span>
        </a-popconfirm>
        <span v-if="item.status == 1" @click="onExport(item)">导出</span>
        <a-popconfirm
          v-else-if="item.status == 2"
          title="是否确认启用该流程"
          ok-text="是"
          cancel-text="否"
          @confirm="updateWorkFlowStatus(item, 1)"
        >
          <span>启用</span>
        </a-popconfirm>
      </div>
    </a-table>
    <a-config-provider :locale="locale">
      <a-pagination
        :page-size-options="pageSizeOptions"
        show-size-changer
        show-quick-jumper
        :show-total="total => `共 ${listTotal} 条`"
        :page-size.sync="searchConfig.pageSize"
        v-model.trim="searchConfig.pageNum"
        :default-current="searchConfig.pageNum"
        :total="listTotal"
        @showSizeChange="onShowSizeChange"
        @change="onPageChange"
        class="pagination-position"
      />
    </a-config-provider>
    <copyProcess ref="copyProcessDialog" :copyedItem="copyedItem" @refreshTable="getList"></copyProcess>
  </div>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import { saveAs } from 'file-saver';
import { getCompanyList } from '@/api/company';
import { exportProcess, getProcessList, importProcess, importProcessCheck, updateWorkFlowStatus } from '@/api/process';
import resizable from '@/mixins/resizable.js';
import { formatData } from '@/utils/func';
import { formatTime } from '@/utils';
import copyProcess from './components/copy.vue';
import { getApplicationList } from '@/api/application';

export default {
  data() {
    return {
      locale: zhCN,
      dateFormat: 'YYYY-MM-DD',
      isShowDrawer: false,
      bordered: true,
      copyedItem: {},
      //主体下拉框
      companyList: [],
      pageSizeOptions: ['20', '30', '40', '50'],
      processStatusSel: [
        { id: 0, name: '草稿' },
        { id: 1, name: '已发布' },
        { id: 2, name: '已停用' },
        { id: 3, name: '未发布' }
      ],
      //查询参数
      searchConfig: {
        processDefName: undefined,
        processDefKey: null,
        status: undefined,
        pageNum: 1,
        pageSize: 20
      },
      columns: [
        {
          key: 'listIndex',
          dataIndex: 'listIndex',
          title: '序号',
          width: 80,
          align: 'center',
          fixed: 'left',
          scopedSlots: {
            filterDropdown: 'filterDropdown'
          },
          customRender: (text, record, index) => {
            return (
              <div>
                <span>{(this.searchConfig.pageNum - 1) * this.searchConfig.pageSize + (index + 1)}</span>
              </div>
            );
          }
        },
        {
          title: '审批流程代码',
          dataIndex: 'processDefKey',
          key: 'processDefKey',
          width: 200,
          scopedSlots: { customRender: 'processDefKey' },
          alignItems: 'center',
          ellipsis: true
        },
        {
          title: '审批流程名称',
          align: 'left',
          ellipsis: true,
          width: 200,
          dataIndex: 'processDefName',
          key: 'processDefName'
        },
        {
          title: '适用系统',
          align: 'center',
          ellipsis: true,
          dataIndex: 'tenantId',
          key: 'tenantId',
          width: 100,
          scopedSlots: { customRender: 'tenantId' }
        },
        {
          title: '适用主体',
          align: 'left',
          ellipsis: true,
          dataIndex: 'companyName',
          key: 'companyName',
          width: 200,
          scopedSlots: { customRender: 'companyName' }
        },
        // {
        //   title: '其它适用主体',
        //   align: 'left',
        //   ellipsis: true,
        //   dataIndex: 'otherCompanyNames',
        //   key: 'otherCompanyNames',
        //   width: 200,
        //   scopedSlots: { customRender: 'otherCompanyNames' }
        // },
        {
          title: '流程状态',
          align: 'center',
          ellipsis: true,
          dataIndex: 'status',
          key: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'createTime',
          width: 150,
          key: 'createTime'
        },
        {
          title: '最新发布时间',
          align: 'center',
          ellipsis: true,
          dataIndex: 'uploadTime',
          width: 150,
          key: 'uploadTime'
        },
        {
          title: '发布人',
          align: 'center',
          dataIndex: 'uploadUser',
          width: 150,
          key: 'uploadUser'
        },
        {
          title: '备注',
          align: 'left',
          ellipsis: true,
          dataIndex: 'remark',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataList: [], //表格数据
      listTotal: 0, //表格总行数，
      platformList: null
    };
  },
  components: { copyProcess },
  mixins: [resizable],
  mounted() {
    getApplicationList().then(res => {
      const platformList = new Map();
      for (const item of res.data) {
        platformList.set(item.id, item.name);
      }
      this.platformList = platformList;
    });
  },
  created() {
    getCompanyList().then(res => {
      this.companyList = res.data;
    });
    this.getList();
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      vm.$store.dispatch('process/changeProcessDefKey', null);
      vm.$store.dispatch('process/changeCompanyId', null);
      vm.$store.dispatch('process/changeCompanyName', null);
      vm.$store.dispatch('process/changeFlowchartInfo', { edges: [], nodes: [] });
      vm.$store.dispatch('process/changeConditionList', []);
      vm.$store.dispatch('process/changeFormPersonList', []);
    });
  },
  methods: {
    /**
     * 获得接口数据
     */
    getList() {
      let config = {
        processDefName: this.searchConfig.processDefName,
        processDefKey: this.searchConfig.processDefKey,
        majorCompanyId: this.searchConfig.companyId,
        otherCompanyId: this.searchConfig.otherCompanyId,
        status: this.searchConfig.status,
        page: {
          pageNum: this.searchConfig.pageNum,
          pageSize: this.searchConfig.pageSize
        }
      };
      getProcessList(config).then(res => {
        this.dataList = res.data.processList ? formatData(res.data.processList) : [];
        this.listTotal = res.data.totalCount || 0;
      });
    },

    /**
     * 新建审批流程
     */
    toAdd() {
      this.$router.push({
        path: '/process/setting',
        query: { type: 'add' }
      });
    },

    /**
     * 分页
     */
    onPageChange(pageNum) {
      this.searchConfig.pageNum = pageNum;
      this.getList();
    },
    onShowSizeChange(pageNum, pageSize) {
      this.searchConfig.pageSize = pageSize;
      this.searchConfig.pageNum = pageNum;
      this.getList();
    },

    /**
     *
     * 查询
     */
    search() {
      this.searchConfig.pageNum = 1;
      this.getList();
    },

    /**
     * 复制
     */
    onCopy(item) {
      this.copyedItem = item;
      this.$refs.copyProcessDialog.visible = true;
    },

    /**
     * 1 启用/ 2 停用
     */
    updateWorkFlowStatus(item, status) {
      let param = {
        processDefKey: item.processDefKey,
        status: status
      };
      updateWorkFlowStatus(param).then(res => {
        if (status == 1) {
          this.$message.success('启用成功！');
        } else if (status == 2) {
          this.$message.success('停用成功！');
        }
        this.getList();
      });
    },

    getOtherConpanyName(arr = []) {
      if (arr == '--') arr = [];
      let value = arr.reduce((total, item) => {
        return total + item.companyName + '，';
      }, '');
      return value.substring(0, value.length - 1);
    },

    async onExport(item) {
      try {
        const { data } = await exportProcess({ processDefKey: item.processDefKey });
        const file = JSON.stringify(data.processContent);
        const blob = new Blob([file], { type: 'text/plain;charset=utf-8' });
        const time = formatTime(null, 'yyyy-MM-dd HH:mm:ss');
        saveAs(blob, `${item.processDefName}__${time}.txt`);
        this.$message.success('导出成功');
      } catch (error) {
        console.error(error);
      }
    },

    async onImport() {
      try {
        const arrFile = await window.showOpenFilePicker({
          types: [
            {
              accept: {
                'text/plain': ['.txt']
              }
            }
          ]
        });
        if (!arrFile || !arrFile.length) return;
        const file = arrFile[0];
        const fileData = await file.getFile();
        const content = await fileData.text();
        const processContent = JSON.parse(content);
        const { data } = await importProcessCheck({ processContent });
        if (data.existed === 0) {
          await importProcess({ processContent });
          this.$message.success('导入成功');
          this.getList();
        } else {
          this.$confirm({
            content: h => (
              <div>
                已存在
                <span style="color:red">{data.existed === 1 ? '未发布' : '已发布'}</span>
                状态编号
                <span style="color:red">{data.existedProcessDefKey}</span>
                的流程，请确认是否导入并覆盖!
              </div>
            ),
            okText: '确认导入',
            cancelText: '暂不导入',
            centered: true,
            width: 500,
            onOk: async () => {
              await importProcess({ processContent });
              this.$message.success('导入成功');
              this.getList();
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    },

    // 过滤搜索内容
    filterSearchOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },

    /**
     * 重置
     */
    reset() {
      this.searchConfig = {
        processDefName: undefined,
        status: undefined,
        pageNum: 1,
        pageSize: 20
      };
    }
  }
};
</script>
