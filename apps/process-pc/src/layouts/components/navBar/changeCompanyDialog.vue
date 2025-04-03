<template>
  <div>
    <a-modal
      v-model="visible"
      title="登录"
      ok-text="确认"
      cancel-text="取消"
      @ok="confirmSwitchCompany"
      @cancel="onCancel"
    >
      <a-form-model
        :label-col="{ md: { span: 6 }, sm: { span: 6 }, lg: { span: 4 }, xl: { span: 4 } }"
        :wrapper-col="{ md: { span: 15 }, sm: { span: 15 }, lg: { span: 18 }, xl: { span: 18 } }"
        ref="passwordForm"
        :rules="rules"
        :model="formData"
      >
        <a-form-model-item label="公司">
          <span>{{ choosedCompany.name }}</span>
        </a-form-model-item>
        <a-form-model-item label="用户名">
          <span>{{ username }}</span>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input-password v-model.trim="formData.password" placeholder="请输入密码" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'change-company',
  props: {
    choosedCompany: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      formData: { password: null },
      passwordReg: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,15}$/,
      rules: {
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback('请填写密码');
                // } else if (!this.passwordReg.test(value)) {
                //   callback('密码只能为大写字母+小写字母+数字的8至15位字符组合');
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      username: state => (state.user.accountInfo != null ? state.user.accountInfo.userName : '')
    })
  },
  mounted() {},
  methods: {
    ...mapActions({
      getMenuPermission: 'user/getMenuPermission',
      clearTag: 'tagsView/clearTag',
      checkPassword: 'user/checkPassword',
      getAcountInfo: 'user/getAcountInfo'
    }),

    /**
     * 确定
     */
    confirmSwitchCompany() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          let param = {
            password: this.formData.password,
            companyId: this.choosedCompany.id
          };
          this.checkPassword(param).then(res => {
            window.location.reload();
          });
        } else {
          return false;
        }
      });
    },

    /**
     * 取消
     */
    onCancel() {
      this.reset();
    },

    /**
     * 重置
     */
    reset() {
      this.visible = false;
      this.formData = {
        password: null
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-form-item {
  margin-bottom: 8px !important;
}
</style>
