<template>
  <a-modal v-model="visible" centered @cancel="cancel">
    <div slot="title" style="text-align: center; font-weight: 600">密码修改</div>
    <div slot="footer" style="display: flex; justify-content: space-around">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="confirm"> 保存 </a-button>
    </div>
    <a-form-model
      :label-col="{ md: { span: 6 }, sm: { span: 6 }, lg: { span: 4 }, xl: { span: 4 } }"
      :wrapper-col="{ md: { span: 18 }, sm: { span: 18 }, lg: { span: 20 }, xl: { span: 20 } }"
      ref="passwordForm"
      :model="formData"
      :rules="rules"
      class="search-form-validate"
    >
      <a-form-model-item label="用户名">
        <span>{{ accountInfo.userName }}</span>
      </a-form-model-item>
      <a-form-model-item label="新密码" prop="credential">
        <a-input-password
          v-model.trim="formData.credential"
          placeholder="密码为8-15位"
          autocomplete="off"
          :maxLength="15"
          allowClear
        />
        <!-- <p v-if="passInfoVisible">密码为8-15位</p> -->
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="confirmCredential">
        <a-input-password
          v-model.trim="formData.confirmCredential"
          placeholder="请保持与新密码一致"
          autocomplete="off"
          :maxLength="15"
          allowClear
          oncopy="return false"
          onpaste="return false"
        />
        <!-- <p v-if="rePassInfoVisible">请保持与新密码一致</p> -->
      </a-form-model-item>
      <a-form-model-item
        label="手机验证码"
        prop="verificationCode"
        :wrapperCol="{ style: 'width:70%;min-width:100px;' }"
      >
        <div class="phone-box">
          <a-input
            v-model.trim="formData.verificationCode"
            placeholder="填写验证码"
            :maxLength="6"
            style="width: 74%"
          />
          <a-button :disabled="disabled" style="margin-left: 15px" type="primary" @click="getVerificationCode">
            {{ btnMsg }}
          </a-button>
        </div>
      </a-form-model-item>
      <p v-if="disabled" style="padding-left: 100px">
        验证码已发送至手机：{{ String(accountInfo.phoneNo).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }}
      </p>
    </a-form-model>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex';
import { getPhoneCode, updatePassword } from '@/api/user';

export default {
  data() {
    return {
      passInfoVisible: true,
      rePassInfoVisible: true,
      visible: false,
      disabled: false,
      btnMsg: '获取验证码',
      formData: {
        credential: '',
        confirmCredential: '',
        verificationCode: ''
      },
      passwordReg: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9]{8,15}$/,
      rules: {
        credential: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                this.passInfoVisible = false;
                callback('密码不能为空');
                // } else if (!this.passwordReg.test(value)) {
                //   callback('密码只能为大写字母+小写字母+数字的8至15位字符组合');
              } else if (value.trim().length < 8) {
                this.passInfoVisible = false;
                callback(new Error('密码为8-15位'));
              } else {
                this.passInfoVisible = true;
                callback();
              }
            }
          }
        ],
        confirmCredential: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value !== this.formData.credential) {
                this.rePassInfoVisible = false;
                callback('请保持两次输入密码一致');
              } else {
                this.rePassInfoVisible = true;
                callback();
              }
            }
          }
        ],
        verificationCode: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                callback('验证码不能为空');
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
      accountInfo: state => state.user.accountInfo || {}
    })
  },
  methods: {
    changePassword() {
      this.visible = true;
      this.passInfoVisible = true;
      this.rePassInfoVisible = true;
    },

    getVerificationCode() {
      let num = 600;
      const countDown = setInterval(() => {
        num -= 1;
        this.btnMsg = `重新获取验证码(${num}秒)`;
        if (num === 0) {
          this.btnMsg = `获取验证码`;
          this.disabled = false;
          clearInterval(countDown);
        }
      }, 1000);
      getPhoneCode({
        phoneNo: this.accountInfo.phoneNo,
        applicationId: this.accountInfo.applicationId,
        type: 'RESET_PASSWORD'
      })
        .then(() => {
          this.disabled = true;
        })
        .catch(() => {
          this.btnMsg = `获取验证码`;
          this.disabled = false;
          clearInterval(countDown);
        });
    },

    /**
     * 修改密码
     */
    confirm() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          let self = this;
          const { id, phoneNo } = this.accountInfo;
          let param = {};
          param.id = id;
          param.phoneNo = phoneNo;
          param.credential = this.formData.credential;
          param.verificationCode = this.formData.verificationCode;
          this.$confirm({
            title: '密码修改确认',
            content: '密码修改成功后，需重新登录',
            centered: true,
            cancelText: '取消',
            okText: '确定',
            onOk() {
              updatePassword(param).then(async () => {
                self.$store.dispatch('user/feLogout').then(async () => {
                  await self.$store.dispatch('tagsView/clearTag');
                  window.toSso();
                  self.$message.success('退出登陆成功');
                });
              });
            }
          });
        }
      });
    },
    cancel() {
      this.visible = false;
      this.passInfoVisible = true;
      this.rePassInfoVisible = true;
      this.$refs.passwordForm.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.phone-box {
  width: 100%;
  display: flex;
  align-content: space-around;
}

.verification-code {
  width: 80%;
}

::v-deep.ant-form-item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;

  .ant-form-item-label {
    width: 100px;
  }

  .ant-form-item-control-wrapper {
    flex: 1 1 0;
  }

  .ant-calendar-picker {
    width: 100%;
  }

  p {
    margin-bottom: 0;
    height: 20px;
    line-height: 20px;
    color: rgb(180, 180, 180);
  }
}

::v-deep .verification-code-item.ant-form-item {
  display: flex;
  align-items: center;

  .phone-box {
    display: flex;
    align-items: center;
  }
}

::v-deep .ant-modal-footer {
  div {
    justify-content: flex-end !important;
  }
}
</style>
