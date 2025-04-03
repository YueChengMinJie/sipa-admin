import router from '@/router'

export function toCompanyDetail(id) {
  router.push({
    name: 'companyMerchantDetail',
    query: { id }
  })
}
