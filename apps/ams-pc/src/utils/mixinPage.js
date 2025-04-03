/*
 * @Author: caszhou
 * @Date: 2021-04-29 14:32:24
 * @Description: 基础模板页面混入
 * mixin 翻页引入 需要重写的变量
 * pageApi => 翻页api
 * deleteApi => 删除api
 * initList() => 重置列表分页条件, 并且loading
 * getList()  => 获取分页列表
 */

import fileDownload from 'js-file-download'
import dayjs from 'dayjs'
import store from '@/store'

export default {
  data() {
    return {
      loading: false, // 加载loading
      // 分页
      pagination: {
        current: 1, // 当前页
        sizes: [10, 20, 30, 50, 100], // 页面条数控制
        size: 100, // 每页条数控制
        total: 0, // 总条数
        totalPage: 0, // 总页数
        pagerCount: 5 // 多少条开始省略翻页
      },
      tableData: [], //表单数据
      multipleSelection: [], // 多选数据
      /**可替换变量 */
      search: {}, // 搜索条件
      deleteKey: 'ids', // 删除的key
      deleteArrKey: 'id', // 删除对象的id
      listApi: new Promise(() => {}), // 分页调用的api
      deleteApi: new Promise(() => {}), // 删除分页数据
      now: null,
      onlyOnce: false,
      maxSelectionCount: 1
    }
  },
  methods: {
    // 重新获取页面数据
    async initList() {
      try {
        this.loading = true
        this.pagination.current = 1
        await this.getList()
      } catch (error) {
        console.error('await:', error)
      } finally {
        this.loading = false
      }
    },
    getParams() {
      let params = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        now: this.now
      }
      return Object.assign(params, this.search)
    },
    // 获取页面数据
    async getList() {
      this.now = dayjs().valueOf()
      const params = this.getParams()
      const { data } = await this.listApi(params)
      if (Array.isArray(data)) {
        if (this.tableDataHook) {
          const length = data.length
          if (length) {
            this.tableData = await this.tableDataHook(data)
          } else {
            this.tableData = await this.tableDataHook([])
          }
        } else {
          this.tableData = data
        }
        this.pagination.size = 2147483647
        this.pagination.total = this.tableData.length
        this.pagination.totalPage = 1
      } else if (data.records) {
        if (this.tableDataHook) {
          const length = data.records.length
          if (length) {
            this.tableData = await this.tableDataHook(data.records)
          } else {
            this.tableData = await this.tableDataHook([])
          }
        } else {
          this.tableData = data.records
        }
        this.pagination.total = data.total
        this.pagination.totalPage = data.pages
      } else {
        return Promise.reject('响应数据格式不正确')
      }
    },
    // 设置每页条数
    handleSizeChange(val) {
      this.pagination.size = val
      this.initList()
    },
    // 设置当前页数
    async handleCurrentChange(val) {
      try {
        this.pagination.current = val
        this.loading = true
        await this.getList()
      } catch (error) {
        console.error('await:', error)
      } finally {
        this.loading = false
      }
    },
    // 批量全选
    handleSelectionChange(val) {
      if (this.onlyOnce && val.length > this.maxSelectionCount) {
        let del_row = val.shift()
        this.$refs['tableRef'].toggleRowSelection(del_row, false)
        this.multipleSelection = val
      } else {
        this.multipleSelection = val
      }
    },
    // 删除
    async handleTableDelete(data, ifString = false) {
      let ids = []
      if (typeof data === 'string') {
        ids = [data]
      } else {
        if (data.length < 1) {
          this.$message.warning('至少需要选择一条数据进行删除！')
          return false
        } else {
          ids = data.map(item => {
            return item[this.deleteArrKey]
          })
        }
      }
      this.loading = true
      const params = {
        [this.deleteKey]: ifString ? ids.join() : ids
      }
      try {
        await this.deleteApi(params)
        const totalPage = Math.ceil((this.pagination.total - ids.length) / this.pagination.size)
        this.pagination.current = this.pagination.current > totalPage ? totalPage || 1 : this.pagination.current
        await this.getList()
        this.$notify({
          title: '消息',
          message: '删除成功',
          type: 'success'
        })
      } catch (error) {
        console.error('await错误:', error)
      } finally {
        this.loading = false
      }
    },
    handleExport() {
      this.loading = true
      this.exportApi(this.getParams())
        .then(response => {
          const { data, headers } = response
          const fileName = window.decodeURI(headers['content-disposition'].split('=')[1])
          fileDownload(data, fileName)
        })
        .catch(e => {
          console.log('promise error', e.message)
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * @description: 按钮权限
     * @param {*} permissionKey 按钮key
     * @return {*} 是否有权限
     */
    getBtnPermissions(permissionKey) {
      const { permissionList } = store.state
      if (permissionKey === true) {
        return true
      } else {
        return permissionList?.find(item => item.aliasName === permissionKey)
          ? !permissionList?.find(item => item.aliasName === permissionKey).hidden
          : true
      }
    }
  }
}
