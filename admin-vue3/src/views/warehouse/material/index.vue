<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物资名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入物资名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物资编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入物资编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物资分类" prop="categoryId">
        <el-tree-select
          v-model="queryParams.categoryId"
          :data="categoryOptions"
          :props="{ value: 'id', label: 'name', children: 'children' }"
          value-key="id"
          placeholder="请选择物资分类"
          check-strictly
          clearable
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
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="materialList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物资编码" align="center" prop="code" />
      <el-table-column label="物资名称" align="center" prop="name" />
      <el-table-column label="物资分类" align="center" prop="categoryName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="当前库存" align="center" prop="stock">
        <template #default="scope">
          <el-tag :type="scope.row.stock <= scope.row.safeStock ? 'danger' : 'success'">
            {{ scope.row.stock }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="安全库存" align="center" prop="safeStock" />
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
            {{ scope.row.status === '0' ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改物资对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="materialRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="物资编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入物资编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物资名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入物资名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="物资分类" prop="categoryId">
              <el-tree-select
                v-model="form.categoryId"
                :data="categoryOptions"
                :props="{ value: 'id', label: 'name', children: 'children' }"
                value-key="id"
                placeholder="请选择物资分类"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierId">
              <el-select v-model="form.supplierId" placeholder="请选择供应商" clearable>
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="specification">
              <el-input v-model="form.specification" placeholder="请输入规格型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="请输入单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="安全库存" prop="safeStock">
              <el-input-number v-model="form.safeStock" :min="0" placeholder="请输入安全库存" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="0">正常</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
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

<script setup name="Material">
// 由于后端接口暂未改造，使用模拟数据
const { proxy } = getCurrentInstance()

const materialList = ref([])
const open = ref(false)
const loading = ref(false)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')
const categoryOptions = ref([])
const supplierOptions = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    code: undefined,
    categoryId: undefined,
    status: undefined
  },
  rules: {
    code: [{ required: true, message: '物资编码不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '物资名称不能为空', trigger: 'blur' }],
    categoryId: [{ required: true, message: '物资分类不能为空', trigger: 'change' }],
    unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

// 模拟数据
const mockMaterialList = [
  { id: 1, code: 'WZ001', name: '办公桌', categoryId: 1, categoryName: '办公家具', specification: '1.4m*0.7m', unit: '张', stock: 50, safeStock: 10, supplierId: 1, supplierName: '家具供应商A', status: '0', remark: '' },
  { id: 2, code: 'WZ002', name: '办公椅', categoryId: 1, categoryName: '办公家具', specification: '标准型', unit: '把', stock: 80, safeStock: 20, supplierId: 1, supplierName: '家具供应商A', status: '0', remark: '' },
  { id: 3, code: 'WZ003', name: 'A4打印纸', categoryId: 2, categoryName: '办公用品', specification: '70g', unit: '包', stock: 5, safeStock: 50, supplierId: 2, supplierName: '文具供应商B', status: '0', remark: '' },
  { id: 4, code: 'WZ004', name: '签字笔', categoryId: 2, categoryName: '办公用品', specification: '0.5mm黑色', unit: '支', stock: 200, safeStock: 100, supplierId: 2, supplierName: '文具供应商B', status: '0', remark: '' },
  { id: 5, code: 'WZ005', name: '笔记本电脑', categoryId: 3, categoryName: '电子设备', specification: '14寸', unit: '台', stock: 15, safeStock: 5, supplierId: 3, supplierName: '电子设备供应商C', status: '0', remark: '' }
]

const mockCategoryTree = [
  { id: 1, name: '办公家具', children: [] },
  { id: 2, name: '办公用品', children: [] },
  { id: 3, name: '电子设备', children: [] },
  { id: 4, name: '劳保用品', children: [] }
]

const mockSupplierList = [
  { id: 1, name: '家具供应商A' },
  { id: 2, name: '文具供应商B' },
  { id: 3, name: '电子设备供应商C' }
]

/** 查询物资列表 */
function getList() {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    let list = [...mockMaterialList]
    if (queryParams.value.name) {
      list = list.filter(item => item.name.includes(queryParams.value.name))
    }
    if (queryParams.value.code) {
      list = list.filter(item => item.code.includes(queryParams.value.code))
    }
    if (queryParams.value.categoryId) {
      list = list.filter(item => item.categoryId === queryParams.value.categoryId)
    }
    if (queryParams.value.status) {
      list = list.filter(item => item.status === queryParams.value.status)
    }
    materialList.value = list
    total.value = list.length
    loading.value = false
  }, 300)
}

/** 获取分类树 */
function getCategoryTree() {
  categoryOptions.value = mockCategoryTree
}

/** 获取供应商列表 */
function getSupplierList() {
  supplierOptions.value = mockSupplierList
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
    code: undefined,
    name: undefined,
    categoryId: undefined,
    supplierId: undefined,
    specification: undefined,
    unit: undefined,
    safeStock: 0,
    status: '0',
    remark: undefined
  }
  proxy.resetForm('materialRef')
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加物资'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  const material = mockMaterialList.find(item => item.id === id)
  if (material) {
    form.value = { ...material }
  }
  open.value = true
  title.value = '修改物资'
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['materialRef'].validate(valid => {
    if (valid) {
      proxy.$modal.msgSuccess(form.value.id ? '修改成功' : '新增成功')
      open.value = false
      getList()
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const deleteIds = row.id || ids.value
  proxy.$modal.confirm('是否确认删除物资编号为"' + deleteIds + '"的数据项？').then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.$modal.msgSuccess('导出功能待后端接口实现')
}

getCategoryTree()
getSupplierList()
getList()
</script>
