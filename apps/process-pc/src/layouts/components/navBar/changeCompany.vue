<template>
  <div class="flex-sub change-company-view">
    <a-dropdown :trigger="['click']" placement="bottomLeft">
      <div class="company-text">
        <div class="company-text-left">{{ selectedCompany.name }}</div>
        <svg-icon icon="dropdown" class="down-arrow" />
      </div>
      <a-menu slot="overlay" :selected-keys="[selectedCompany.id || 0]">
        <a-menu-item v-for="item in companyList" :key="item.id" @click="changeCompany(item)">
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <change-company-dialog :choosedCompany="choosedCompany" ref="changeCompanyDialog" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ChangeCompanyDialog from './changeCompanyDialog.vue';
import { whetherNeedPassword } from '@/api/user';

export default {
  name: 'change-company',
  components: { ChangeCompanyDialog },
  data() {
    return {
      choosedCompany: {}
    };
  },
  computed: {
    ...mapState({
      companyList: state => (state.user.companyList != null ? state.user.companyList : []),
      selectedCompany: state => (state.user.selectedCompany != null ? state.user.selectedCompany : {})
    })
  },
  mounted() {},
  methods: {
    ...mapActions({
      changeCompanyToken: 'user/changeCompanyToken',
      getMenuPermission: 'user/getMenuPermission',
      clearTag: 'tagsView/clearTag',
      getAcountInfo: 'user/getAcountInfo'
    }),

    // 切换公司
    changeCompany(item) {
      if (item.id === this.selectedCompany.id) return;
      this.choosedCompany = item;
      const param = {
        companyId: item.id
      };
      whetherNeedPassword(param).then(res => {
        const { data } = res;
        if (data) {
          if (data.authPassword === true) {
            this.$refs.changeCompanyDialog.visible = true;
          } else {
            this.changeCompanyToken(param).then(res => {
              window.location.reload();
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.change-company-view {
  height: 28px;
  opacity: 1;
  border-radius: 2px;
  margin-left: 2px; /*no*/
  .company-text {
    width: 240px !important;
    height: 28px !important;
    border-radius: 2px;
    margin-left: 2px; /*no*/
    padding-left: 12px; /*no*/
    background: #f4f6f8;
    display: flex;
    flex-direction: row;
    width: 150px; /*no*/
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    width: 230px;
    height: 17px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 17px;
    color: #333333;
    opacity: 1;

    &-left {
      flex: 0 0 130px; /*no*/
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .down-arrow {
      height: 12px;
      margin-right: 10px;
      opacity: 1;
    }
  }
}
</style>
