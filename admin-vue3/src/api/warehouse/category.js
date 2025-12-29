import request from '@/utils/request'

// 查询物资分类列表
export function listCategory(query) {
  return request({
    url: '/warehouse/category/list',
    method: 'get',
    params: query
  })
}

// 查询物资分类详细
export function getCategory(id) {
  return request({
    url: '/warehouse/category/' + id,
    method: 'get'
  })
}

// 新增物资分类
export function addCategory(data) {
  return request({
    url: '/warehouse/category',
    method: 'post',
    data: data
  })
}

// 修改物资分类
export function updateCategory(data) {
  return request({
    url: '/warehouse/category',
    method: 'put',
    data: data
  })
}

// 删除物资分类
export function delCategory(id) {
  return request({
    url: '/warehouse/category/' + id,
    method: 'delete'
  })
}

// 查询分类树结构
export function getCategoryTree() {
  return request({
    url: '/warehouse/category/tree',
    method: 'get'
  })
}
