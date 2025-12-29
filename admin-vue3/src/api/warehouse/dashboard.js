import request from '@/utils/request'

// 获取库存统计数据
export function getStockStatistics() {
  return request({
    url: '/warehouse/dashboard/statistics',
    method: 'get'
  })
}

// 获取库存趋势数据
export function getStockTrend(query) {
  return request({
    url: '/warehouse/dashboard/trend',
    method: 'get',
    params: query
  })
}

// 获取物资分类占比
export function getCategoryRatio() {
  return request({
    url: '/warehouse/dashboard/category-ratio',
    method: 'get'
  })
}

// 获取预警数据
export function getWarningData() {
  return request({
    url: '/warehouse/dashboard/warning',
    method: 'get'
  })
}

// 获取最近出入库记录
export function getRecentRecords(query) {
  return request({
    url: '/warehouse/dashboard/recent-records',
    method: 'get',
    params: query
  })
}
