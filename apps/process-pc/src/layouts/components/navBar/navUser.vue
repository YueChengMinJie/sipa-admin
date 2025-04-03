<template>
  <a-dropdown class="navUser-wrppaer">
    <div>
      <!-- <span class="wellcome">欢迎您，</span> -->
      <span class="userTitle">欢迎您，{{ username }}</span>
      <!-- <img src="../../../assets/nav/user.gif" class="userImg" alt="" /> -->
      <img src="../../../assets/nav/system.png" class="userImg" alt="" />
    </div>

    <a-menu slot="overlay" class="trop-down">
      <!-- <a-menu-item>
        <router-link to="/userSystem/userInfo">个人中心</router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="/userSystem/setting">个人设置</router-link>
      </a-menu-item>
      <a-menu-divider /> -->
      <a-menu-item>
        <div @click.self="change">切换应用</div>
      </a-menu-item>
      <a-menu-item>
        <div @click.self="logout">退出登录</div>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'navUser',
  data() {
    return {};
  },
  computed: {
    ...mapState({
      username: state => (state.user.accountInfo != null ? state.user.accountInfo.name : '')
    })
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout').then(async () => {
        // await this.$store.dispatch('tagsView/clearTag');
        this.$message.success('退出登陆成功');
        window.toSso();
      });
    },
    change() {
      window.toSsoPlatform();
    },
    changePassword() {
      this.$emit('changePassword');
    }
  }
};
</script>

<style lang="scss" scoped>
.navUser-wrppaer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.right-menu-box {
  padding: 0 !important;
  padding-right: 17px !important;
}

.userTitle {
  margin-left: 20px;
  margin-right: 12px;
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
  line-height: 17px;
  display: inline-block;
  // width: 70px; /*no*/
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.userImg {
  width: 31px; /*no*/
  height: 31px; /*no*/
  border-radius: 50%;
  display: inline-block;
  margin-right: 40px;
}

.trop-down {
  margin-right: 16px;
}

.wellcome {
  margin-left: 8px;
  font-weight: 600;
  font-size: 18px;
  display: inline-block;
  vertical-align: middle;
}
</style>
