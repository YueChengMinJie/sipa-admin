<template>
  <div class="login-container">
    <div class="layout">
      <div class="layout-left-login">
        <img src="../../assets/login/login.png" alt="背景图片" />
      </div>
      <div class="layout-right-login">
        <div style="width: 100%">
          <div class="title">
            <div class="title-content-welcome">欢迎登录</div>
            <div class="title-content">流程中台</div>
          </div>
          <div class="form">
            <div v-if="currentStep === 0">
              <a-form-model :model="loginForm" :rules="phoneNoLoginRules" layout="vertical" ref="phoneNoLoginForm">
                <a-form-model-item class="login-item" prop="phoneNo" style="width: 100%">
                  <a-input
                    v-model.trim="loginForm.phoneNo"
                    placeholder="请输入手机号"
                    size="large"
                    allow-clear
                    @pressEnter="focusValidateCode"
                    :maxLength="11"
                  >
                    <template slot="prefix">
                      <img src="../../assets/login/phone.png" class="phoneIcon" alt="" />
                    </template>
                  </a-input>
                </a-form-model-item>

                <a-form-model-item class="login-item" prop="password">
                  <a-input-password
                    v-model.trim="loginForm.password"
                    placeholder="请输入密码"
                    size="large"
                    allow-clear
                    @pressEnter="loginByPassword"
                    ref="password"
                    :maxLength="15"
                  >
                    <template slot="prefix">
                      <img src="../../assets/login/password.png" class="phoneIcon" alt="" />
                    </template>
                  </a-input-password>
                </a-form-model-item>

                <a-form-item class="login-item" prop="geetest">
                  <div id="geetest"></div>
                </a-form-item>

                <a-form-item class="login-btn">
                  <a-button
                    class="btn"
                    type="primary"
                    block
                    size="large"
                    :loading="loading"
                    @click="loginByPassword"
                    :disabled="!(loginForm.phoneNo && loginForm.password && loginForm.geetest)"
                  >
                    登 录
                  </a-button>
                </a-form-item>
              </a-form-model>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isCode, isPhone } from '@/utils/validate';
import { removeAll } from '@/utils/session';
import { geetest, getPhoneCode } from '@/api/user';
import SipaJs from 'sipa-boot-sdk-js';
import '@/utils/gt';

export default {
  name: 'login',
  data() {
    const validatePhoneNo = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('手机号码不能为空'));
      } else if (!isPhone(value)) {
        callback(new Error('手机号码有误，请重新填写'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('密码不能为空'));
      } else if (value.trim().length < 6) {
        callback(new Error('密码至少为六位'));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('验证码不能为空'));
      } else if (!isCode(value)) {
        callback(new Error('验证码有误，请重新填写'));
      } else {
        callback();
      }
    };
    const validateCompany = (rule, value, callback) => {
      if (value.id == null) {
        callback(new Error('请选择公司'));
      } else {
        callback();
      }
    };
    return {
      // 当前步骤  0：首页  1：选择主体  2：首次登录密码校验
      currentStep: 0,
      loginForm: {
        // 手机号
        phoneNo: null,
        // 密码
        password: null,
        // 极验
        geetest: null,
        // 验证码
        verificationCode: null,
        // 选择主体
        selectedCompany: {},
        // 首次登录密码
        firstLoginPassword: null
      },
      // 选择主体界面公司下拉框
      loginCompanyList: [],
      // 校验
      phoneNoLoginRules: {
        phoneNo: [{ required: true, trigger: 'blur', validator: validatePhoneNo }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      codeLoginRules: {
        phoneNo: [{ required: true, trigger: 'blur', validator: validatePhoneNo }],
        verificationCode: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      switchCompanyRules: {
        selectedCompany: [{ required: true, trigger: 'blur', validator: validateCompany }]
      },
      passwordLoginRules: {
        firstLoginPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      // 验证码按钮文字
      phoneNoCodeText: '获取验证码',
      // 验证码按钮是否置灰
      codeStatus: false,
      tabBarStyle: {
        'border-bottom': 0,
        'margin-bottom': '28px'
      },
      // 极验
      geetest: {
        challenge: null,
        validate: null,
        seccode: null
      }
    };
  },
  computed: {
    ...mapState({
      selectedCompany: state => state.user.selectedCompany || {}
    })
  },
  created() {
    if (this.$route.params.index) {
      //登录后切换主体，新公司需要输密码
      this.currentStep = this.$route.params.index || 2;
    } else {
      // 登录页面的时候清除上一次的cookie
      localStorage.removeItem(SipaJs.STORAGE_TOKEN_KEY);
      localStorage.removeItem(SipaJs.STORAGE_LOGIN_INFO_KEY);
      localStorage.removeItem(SipaJs.STORAGE_USER_INFO_KEY);
      // 清除所有缓存
      removeAll();
    }
  },
  mounted() {
    this.initGeetest();
  },
  methods: {
    /**
     * 初始化极验
     */
    initGeetest() {
      geetest().then(({ data }) => {
        const _this = this;
        window.initGeetest(
          {
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.newCaptcha,
            product: 'float',
            width: '100%'
          },
          geetest => {
            geetest.appendTo('#geetest');
            geetest.onSuccess(() => {
              const val = geetest.getValidate();
              _this.loginForm.geetest = val;

              _this.geetest.challenge = val.geetest_challenge;
              _this.geetest.validate = val.geetest_validate;
              _this.geetest.seccode = val.geetest_seccode;

              this.loginByPassword();
            });
          }
        );
      });
    },

    /**
     * 验证码焦点
     */
    focusValidateCode() {
      this.$refs.verificationCode.focus();
    },

    /**
     * 手机号 + 密码 登录
     */
    loginByPassword() {
      this.$refs.phoneNoLoginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const phoneNo = this.loginForm.phoneNo;
          const password = this.loginForm.password;
          const data = {
            phoneNo,
            password,
            applicationId: SipaJs.APPLICATION_ID_CP_PROCESS,
            geetest: this.geetest
          };
          this.$store
            .dispatch('user/loginByPassword', data)
            .then(async res => {
              await this.$store.dispatch('user/getInfo');
              await this.$store.dispatch('permission/getRoute');
              let { data } = res;
              this.loginCompanyList = data.companyList;
              this.toMainPage();

              this.loading = false;
            })
            .catch(() => {
              setTimeout(() => {
                this.loading = false;
              }, 500);
            });
        } else {
          return false;
        }
      });
    },

    /**
     * 手机号+验证码 登录
     */
    loginByValidateCode() {
      this.$refs.codeLoginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const phoneNo = this.loginForm.phoneNo;
          const verificationCode = this.loginForm.verificationCode;
          const applicationId = this.loginForm.applicationId;
          const param = {
            phoneNo,
            verificationCode,
            applicationId
          };
          this.$store
            .dispatch('user/loginByValidateCode', param)
            .then(async res => {
              await this.$store.dispatch('user/getInfo');
              await this.$store.dispatch('permission/getRoute');
              let { data } = res;
              this.loginCompanyList = data.companyList;
              let path = '/businessManage/index';
              this.$router.push({
                path: path
              });

              this.loading = false;
            })
            .catch(() => {
              setTimeout(() => {
                this.loading = false;
              }, 500);
            });
        } else {
          return false;
        }
      });
    },

    /**
     * 获取验证码
     */
    getCode() {
      if (isPhone(this.loginForm.phoneNo)) {
        this.codeStatus = true;
        let time = 60;
        var getphoneNoIntval = setInterval(() => {
          if (time > 0) {
            time--;
            this.phoneNoCodeText = `${time}s后重发`;
          } else {
            clearInterval(getphoneNoIntval);
            getphoneNoIntval = null;
            this.phoneNoCodeText = '发送验证码';
            this.codeStatus = false;
          }
        }, 1000);
        this.$refs.verificationCode.focus();

        getPhoneCode({ phoneNo: this.loginForm.phoneNo, applicationId: this.loginForm.applicationId, type: 'Login' })
          .then(res => {
            setTimeout(() => {
              this.$message.info(
                '验证码已发送至手机：' + String(this.loginForm.phoneNo).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
              );
            }, 1000);
          })
          .catch(res => {
            clearInterval(getphoneNoIntval);
            getphoneNoIntval = null;
            this.phoneNoCodeText = '发送验证码';
            this.codeStatus = false;
          });
      } else {
        this.$message.error('请正确输入手机号');
      }
    },

    /**
     *  选择主体-下拉框切换公司
     */

    changeCompany(item) {
      this.loginForm.selectedCompany = item;
    },

    /**
     * 选择主体-确定
     */
    confirmCompany() {
      this.$refs.switchCompanyForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let param = {
            companyId: this.loginForm.selectedCompany.id
          };
          this.$store
            .dispatch('user/changeCompanyToken', param)
            .then(res => {
              let { data } = res;
              if (data.authPassword) {
                this.toStep(2);
                this.loading = false;
              } else {
                this.toMainPage();
                this.loading = false;
              }
            })
            .catch(() => {
              setTimeout(() => {
                this.loading = false;
              }, 500);
            });
        } else {
          return false;
        }
      });
    },

    /**
     * 验证密码-密码确认
     */
    checkPassword() {
      this.$refs.passwordLoginForm.validate(valid => {
        if (valid) {
          let param = {
            password: this.loginForm.firstLoginPassword
          };
          this.$store
            .dispatch('user/checkPassword', param)
            .then(res => {
              this.toMainPage();
              this.loading = false;
            })
            .catch(() => {
              setTimeout(() => {
                this.loading = false;
              }, 500);
            });
        } else {
          return false;
        }
      });
    },

    /**
     * 登录页tab切换
     */
    changeTab() {
      this.$nextTick(() => {
        this.$refs.phoneNoLoginForm.resetFields();
        this.$refs.codeLoginForm.resetFields();
      });
    },

    /**
     * 跳转至首页
     */
    toMainPage() {
      let path = '/';
      this.$router.push({
        path: path
      });
    },

    /**
     * 下一步
     */
    toStep(step) {
      this.currentStep = step;
    },

    /**
     * 上一步
     */
    forward() {
      --this.currentStep;
    }
  }
};
</script>

<style lang="scss" scoped>
$theamColor: #4090f7;

.login-container {
  height: 100%;
  width: 100%;
  background-image: url(../../assets/login/loginBack.png);
  background-size: contain;
  border: 1px solid #fff;

  .layout {
    display: flex;
    flex-direction: row;
    height: 80%;
    width: 74%;
    background-color: #fff;
    box-shadow: 0px 6px 30px 0px rgba(0, 0, 0, 0.15);
    margin-top: 5%;
    margin-left: 13%;

    .layout-left-login {
      position: relative;
      width: 66%;
      height: 100%;
      background-color: rgba(93, 159, 251, 0.19);

      & > img {
        width: 100%;
        height: 100%;
      }

      .action {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
      }
    }

    .layout-right-login {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .title {
        text-align: left;
        padding: 0 10%;

        .title-content-welcome {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #7e7e7e;
          line-height: 29px;
          -webkit-background-clip: text;
        }

        .title-content {
          height: 42px;
          line-height: 42px;
          font-size: 28px;
          font-weight: 600;
          color: #333333;
        }
      }

      .form {
        margin-top: 30px;
        padding: 0 10%;
        min-width: 330px;

        .icon {
          position: absolute;
          transform: translateY(-50%);
          top: 50%;
          left: 12px;
          z-index: 2;
          width: 18px;
          height: 18px;
        }

        .msg {
          font-size: 16px;
          color: #333333;
          margin-bottom: 24px;
        }
      }
    }

    .login-btn {
      margin-top: 40px;
      height: 40px;
      cursor: pointer;
      border-radius: 2px;

      .btn {
        height: 40px !important;
        background: $theamColor;
        color: #fff !important;
        opacity: 1;

        ::v-deep span {
          color: #fff !important;
          font-size: 16px !important;
          font-family: PingFangSC-Regular, PingFang SC, serif !important;
          font-weight: 400 !important;
        }
      }

      .btn:disabled {
        background: $theamColor;
        opacity: 0.3;
        color: white;
      }
    }

    .form-container {
      .login-item {
        margin-bottom: 20px;

        .verificationCode-box {
          display: flex;
          align-content: space-around;

          .validateBtn {
            font-size: 14px;
            color: $theamColor;
            border-color: $theamColor;
          }

          .validateBtn-false {
            font-size: 14px;
            color: #cccccc;
            border-color: #cccccc;
          }

          .validateBtn:disabled {
            color: #cccccc;
            border-color: #cccccc;
          }
        }
      }
    }
  }

  .verificationCode-box {
    display: flex;
    align-content: space-around;

    .validateBtn {
      font-size: 14px;
      color: $theamColor;
      background-color: rgba(64, 144, 247, 0.12);
      border-color: #fff;
    }

    .validateBtn-false {
      font-size: 14px;
      color: #cccccc;
      border-color: #cccccc;
    }

    .validateBtn:disabled {
      color: #cccccc;
      border-color: #cccccc;
    }
  }

  .ant-tabs-tab {
    font-size: 16px;
    color: #666666;
    font-weight: 400;
  }

  .ant-tabs-tab-active {
    font-size: 18px;
    color: $theamColor;
    font-weight: 600;
  }

  .ant-tabs-tab:hover {
    font-size: 18px;
    color: $theamColor;
  }
}

@media screen and (max-width: 1500px) {
  .title-content {
    font-size: 24px !important;
  }
}

@media screen and (max-width: 1200px) {
  .title-content {
    font-size: 22px !important;
  }
}
</style>

<style lang="scss">
$theamColor: #4090f7;
.login-container {
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 36px !important;
  }

  .ant-input-affix-wrapper .ant-input:hover {
    border-color: $theamColor;
  }

  .ant-input-affix-wrapper .ant-input:focus {
    border-color: $theamColor;
    box-shadow: 0px 0px 3px $theamColor;
  }

  .ant-form-item {
    margin-bottom: 12px;
  }

  .ant-form-item-control-wrapper .ant-select-selection:hover {
    border-color: $theamColor;
  }

  .ant-form-item-control {
    .ant-select-selection__placeholder {
      left: 25px !important;
    }

    .ant-select-selection-selected-value {
      position: relative;
      left: 25px !important;
    }
  }

  .ant-tabs-nav .ant-tabs-tab {
    padding: 12px 0px !important;
    margin-right: 50px !important;
    font-size: 18px !important;
  }

  .ant-tabs-nav .ant-tabs-tab:hover {
    color: $theamColor;
  }

  .ant-tabs-nav .ant-tabs-tab-active {
    font-weight: 600;
    color: $theamColor;
  }

  .ant-tabs-ink-bar {
    background-color: $theamColor;
  }

  .phoneIcon {
    width: 16px;
    height: 16px;
  }
}
</style>
