<!--
 * @Author: caszhou
 * @Date: 2023-06-15 09:47:54
 * @Description: 上传文件
-->

<template>
  <div class="upload-file">
    <el-upload
      class="upload"
      ref="uploadRef"
      list-type="text"
      :action="action"
      :limit="limit"
      :disabled="disabled"
      multiple
      :auto-upload="autoUpload"
      :file-list="fileList"
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :headers="headers"
    >
      <el-button size="small" type="primary">{{ buttonText }}</el-button>
    </el-upload>
  </div>
</template>

<script>
import Config from '@/config'

export default {
  name: 'UploadFile',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    /** 文件格式 */
    formats: {
      type: Array,
      default: () => ['xls', 'xlsx']
    },
    /** 文件大小 10M */
    size: {
      type: Number,
      default: 10
    },
    /** 上传数量 */
    limit: {
      type: Number,
      default: 1
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: '导入'
    },
    autoUpload: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (newVal) {
        this.fileList = newVal.map((val, index) => {
          return { uid: `custom-${index + 1}`, name: val, url: val }
        })
      }
    }
  },
  data() {
    return {
      action: Config.associationServices[0].url + '/os',
      fileList: [],
      initialIndex: 0,
      headers: {
        Authorization: `Bearer ${this.$store.getters.getToken}`
      }
    }
  },
  methods: {
    handleBeforeUpload(file) {
      return this.formatCheck(file)
    },
    formatCheck(file) {
      const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
      if (!this.formats.includes(suffix)) {
        this.$message.error(`上传文件格式只允许为: ${this.formats.join('/')}格式!`)
        return false
      }
      if (file.size / 1024 / 1024 > this.size) {
        this.$message.error(`上传文件大小不能超过: ${this.size}MB!`)
        return false
      }
      return true
    },
    handleSuccess({ data }, file, fileList) {
      file.url = data.url
      if (fileList.every(item => item.status === 'success')) {
        this.handleSetValue(fileList)
      }
      this.$emit('success', data, file, fileList)
    },
    handleError(error) {
      console.error(error)
      this.$notify({
        showClose: true,
        title: '错误',
        message: String(error),
        type: 'error'
      })
    },
    handleExceed() {
      this.$message.error(`上传文件不能超过${this.limit}个`)
    },
    handleRemove(file, fileList) {
      this.$emit('remove', file, fileList)
      this.handleSetValue(fileList)
    },
    handleSetValue(fileList) {
      const values = fileList.map(item => item.url)
      this.$emit('input', values)
    },
    handleChange(file) {
      const checkRes = this.formatCheck(file)
      if (!checkRes) {
        const uploadFiles = this.$refs['uploadRef'].uploadFiles
        const findIndex = uploadFiles.findIndex(item => item.uid === file.uid)
        if (findIndex !== -1) {
          uploadFiles.splice(findIndex, 1)
        }
      } else if (!this.autoUpload) {
        this.$emit('input', [file])
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-file {
  overflow: hidden;
  position: relative;

  .upload {
    display: flex;
    flex-wrap: wrap;
  }

  ::v-deep {
    .el-upload {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .el-upload-list--text {
      display: none;
    }
  }
}
</style>
