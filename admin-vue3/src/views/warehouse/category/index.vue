<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="categoryList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="code" label="分类编码" align="center" />
      <el-table-column prop="orderNum" label="排序" align="center" />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)">新增</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="categoryRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            value-key="id"
            placeholder="选择上级分类"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Category">
const { proxy } = getCurrentInstance()

const categoryList = ref([])
const open = ref(false)
const loading = ref(false)
const showSearch = ref(true)
const title = ref('')
const categoryOptions = ref([])
const isExpandAll = ref(true)
const refreshTable = ref(true)

const data = reactive({
  form: {},
  queryParams: {
    name: undefined,
    status: undefined
  },
  rules: {
    name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
    code: [{ required: true, message: '分类编码不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

// 模拟数据
const mockCategoryList = [
  {
    id: 1,
    name: '办公家具',
    code: 'FL001',
    parentId: 0,
    orderNum: 1,
    status: '0',
    createTime: '2024-01-01 10:00:00',
    children: [
      { id: 11, name: '桌类', code: 'FL001-01', parentId: 1, orderNum: 1, status: '0', createTime: '2024-01-01 10:00:00' },
      { id: 12, name: '椅类', code: 'FL001-02', parentId: 1, orderNum: 2, status: '0', createTime: '2024-01-01 10:00:00' }
    ]
  },
  {
    id: 2,
    name: '办公用品',
    code: 'FL002',
    parentId: 0,
    orderNum: 2,
    status: '0',
    createTime: '2024-01-01 10:00:00',
    children: [
      { id: 21, name: '纸张类', code: 'FL002-01', parentId: 2, orderNum: 1, status: '0', createTime: '2024-01-01 10:00:00' },
      { id: 22, name: '文具类', code: 'FL002-02', parentId: 2, orderNum: 2, status: '0', createTime: '2024-01-01 10:00:00' }
    ]
  },
  { id: 3, name: '电子设备', code: 'FL003', parentId: 0, orderNum: 3, status: '0', createTime: '2024-01-01 10:00:00', children: [] },
  { id: 4, name: '劳保用品', code: 'FL004', parentId: 0, orderNum: 4, status: '0', createTime: '2024-01-01 10:00:00', children: [] }
]

/** 查询分类列表 */
function getList() {
  loading.value = true
  setTimeout(() => {
    categoryList.value = mockCategoryList
    loading.value = false
  }, 300)
}

/** 获取分类树 */
function getCategoryTree() {
  const root = { id: 0, name: '主类目', children: mockCategoryList }
  categoryOptions.value = [root]
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

/** 表单重置 */
function reset() {
  form.value = {
    id: undefined,
    parentId: 0,
    name: undefined,
    code: undefined,
    orderNum: 0,
    status: '0'
  }
  proxy.resetForm('categoryRef')
}

/** 搜索按钮操作 */
function handleQuery() {
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 新增按钮操作 */
function handleAdd(row) {
  reset()
  getCategoryTree()
  if (row && row.id) {
    form.value.parentId = row.id
  }
  open.value = true
  title.value = '添加物资分类'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  getCategoryTree()
  form.value = { ...row }
  open.value = true
  title.value = '修改物资分类'
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['categoryRef'].validate(valid => {
    if (valid) {
      proxy.$modal.msgSuccess(form.value.id ? '修改成功' : '新增成功')
      open.value = false
      getList()
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否确认删除分类名称为"' + row.name + '"的数据项？').then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  }).catch(() => {})
}

getCategoryTree()
getList()
</script>
