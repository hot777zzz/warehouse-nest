<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="供应商名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contact">
        <el-input
          v-model="queryParams.contact"
          placeholder="请输入联系人"
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
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="供应商编码" align="center" prop="code" />
      <el-table-column label="供应商名称" align="center" prop="name" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="地址" align="center" prop="address" show-overflow-tooltip />
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

    <!-- 添加或修改供应商对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="supplierRef" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="供应商编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入供应商编码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
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
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
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

<script setup name="Supplier">
const { proxy } = getCurrentInstance()

const supplierList = ref([])
const open = ref(false)
const loading = ref(false)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    contact: undefined,
    status: undefined
  },
  rules: {
    code: [{ required: true, message: '供应商编码不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '供应商名称不能为空', trigger: 'blur' }],
    contact: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
    phone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

// 模拟数据
const mockSupplierList = [
  { id: 1, code: 'GYS001', name: '家具供应商A', contact: '张三', phone: '13800138001', email: 'zhangsan@example.com', address: '北京市朝阳区xxx街道', status: '0', remark: '' },
  { id: 2, code: 'GYS002', name: '文具供应商B', contact: '李四', phone: '13800138002', email: 'lisi@example.com', address: '上海市浦东新区xxx路', status: '0', remark: '' },
  { id: 3, code: 'GYS003', name: '电子设备供应商C', contact: '王五', phone: '13800138003', email: 'wangwu@example.com', address: '深圳市南山区xxx大厦', status: '0', remark: '' },
  { id: 4, code: 'GYS004', name: '劳保用品供应商D', contact: '赵六', phone: '13800138004', email: 'zhaoliu@example.com', address: '广州市天河区xxx园区', status: '1', remark: '暂停合作' }
]

/** 查询供应商列表 */
function getList() {
  loading.value = true
  setTimeout(() => {
    let list = [...mockSupplierList]
    if (queryParams.value.name) {
      list = list.filter(item => item.name.includes(queryParams.value.name))
    }
    if (queryParams.value.contact) {
      list = list.filter(item => item.contact.includes(queryParams.value.contact))
    }
    if (queryParams.value.status) {
      list = list.filter(item => item.status === queryParams.value.status)
    }
    supplierList.value = list
    total.value = list.length
    loading.value = false
  }, 300)
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
    contact: undefined,
    phone: undefined,
    email: undefined,
    address: undefined,
    status: '0',
    remark: undefined
  }
  proxy.resetForm('supplierRef')
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
  title.value = '添加供应商'
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  const supplier = mockSupplierList.find(item => item.id === id)
  if (supplier) {
    form.value = { ...supplier }
  }
  open.value = true
  title.value = '修改供应商'
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['supplierRef'].validate(valid => {
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
  proxy.$modal.confirm('是否确认删除供应商编号为"' + deleteIds + '"的数据项？').then(() => {
    proxy.$modal.msgSuccess('删除成功')
    getList()
  }).catch(() => {})
}

getList()
</script>
