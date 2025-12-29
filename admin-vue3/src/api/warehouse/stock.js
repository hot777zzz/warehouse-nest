import request from '@/utils/request'

// 查询库存记录列表
export function listStock(query) {
  return request({
    url: '/warehouse/stock/list',
    method: 'get',
    params: query
  })
}

// 查询库存记录详细
export function getStock(id) {
  return request({
    url: '/warehouse/stock/' + id,
    method: 'get'
  })
}

// 入库操作
export function stockIn(data) {
  return request({
    url: '/warehouse/stock/in',
    method: 'post',
    data: data
  })
}

// 出库操作
export function stockOut(data) {
  return request({
    url: '/warehouse/stock/out',
    method: 'post',
    data: data
  })
}

// 查询出入库记录
export function listStockRecord(query) {
  return request({
    url: '/warehouse/stock/record/list',
    method: 'get',
    params: query
  })
}

// 导出库存记录
export function exportStock(query) {
  return request({
    url: '/warehouse/stock/export',
    method: 'get',
    params: query
  })
}

// 获取库存预警列表
export function listStockWarning(query) {
  return request({
    url: '/warehouse/stock/warning/list',
    method: 'get',
    params: query
  })
}
