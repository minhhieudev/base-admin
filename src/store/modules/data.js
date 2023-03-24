import { getOverviewData } from '@/api/helper'
export default {
  state: {
    news: [],
    overviewData: {
      apiKeyServices: [],
      seoServices: [],
      info: {}
    },
    package_groups: [],
    orders: []
  },
  actions: {
    loadDashboardData: function({ state }) {
      getOverviewData().then(rs => {
        if (rs.data.success) {
          state.overviewData = rs.data.overviewData
        }
      })
    },
  }
}
