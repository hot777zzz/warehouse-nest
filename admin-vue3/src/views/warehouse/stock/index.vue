<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物资名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物资名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择操作类型" clearable>
          <el-option label="入库" value="in" />
          <el-option label="出库" value="out" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleStockIn">入库登记</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Minus" @click="handleStockOut">出库登记</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="stockRecordList">
      <el-table-column label="记录编号" align="center" prop="recordNo" />
      <el-table-column label="物资编码" align="center" prop="materialCode" />
      <el-table-column label="物资名称" align="center" prop="materialName" />
      <el-table-column label="操作类型" align="center" prop="type">
        <template #default="scope">
          <el-tag :type="scope.row.type === 'in' ? 'success' : 'warning'">
            {{ scope.row.type === 'in' ? '入库' : '出库' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" prop="quantity">
        <template #default="scope">
          <span :class="scope.row.type === 'in' ? 'text-success' : 'text-warning'">
            {{ scope.row.type === 'in' ? '+' : '-' }}{{ scope.row.quantity }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作前库存" align="center" prop="beforeStock" />
      <el-table-column label="操作后库存" align="center" prop="afterStock" />
      <el-table-column label="操作人" align="center" prop="operator" />
      <el-table-column label="操作时间" align="center" prop="operateTime" width="160" />
      <el-table-column label="备注" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">详情</el-button>
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

    <!-- 入库对话框 -->
    <el-dialog title="入库登记" v-model="stockInOpen" width="600px" append-to-body>
      <el-form ref="stockInRef" :model="stockInForm" :rules="stockInRules" label-width="100px">
        <el-form-item label="选择物资" prop="materialId">
          <el-select v-model="stockInForm.materialId" placeholder="请选择物资" filterable @change="handleMaterialChange">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="`${item.code} - ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存">
          <el-input v-model="stockInForm.currentStock" disabled />
        </el-form-item>
        <el-form-item label="入库数量" prop="quantity">
          <el-input-number v-model="stockInForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select v-model="stockInForm.supplierId" placeholder="请选择供应商" clearable>
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="stockInForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitStockIn">确 定</el-button>
          <el-button @click="stockInOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 出库对话框 -->
    <el-dialog title="出库登记" v-model="stockOutOpen" width="600px" append-to-body>
      <el-form ref="stockOutRef" :model="stockOutForm" :rules="stockOutRules" label-width="100px">
        <el-form-item label="选择物资" prop="materialId">
          <el-select v-model="stockOutForm.materialId" placeholder="请选择物资" filterable @change="handleMaterialChangeOut">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="`${item.code} - ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存">
          <el-input v-model="stockOutForm.currentStock" disabled />
        </el-form-item>
        <el-form-item label="出库数量" prop="quantity">
          <el-input-number v-model="stockOutForm.quantity" :min="1" :max="stockOutForm.currentStock || 9999" />
        </el-form-item>
        <el-form-item label="领用人" prop="receiver">
          <el-input v-model="stockOutForm.receiver" placeholder="请输入领用人" />
        </el-form-item>
        <el-form-item label="领用部门" prop="department">
          <el-input v-model="stockOutForm.department" placeholder="请输入领用部门" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="stockOutForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitStockOut">确 定</el-button>
          <el-button @click="stockOutOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="出入库详情" v-model="detailOpen" width="500px" append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="记录编号">{{ detailData.recordNo }}</el-descriptions-item>
        <el-descriptions-item label="物资编码">{{ detailData.materialCode }}</el-descriptions-item>
        <el-descriptions-item label="物资名称">{{ detailData.materialName }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag :type="detailData.type === 'in' ? 'success' : 'warning'">
            {{ detailData.type === 'in' ? '入库' : '出库' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="数量">{{ detailData.quantity }}</el-descriptions-item>
        <el-descriptions-item label="操作前库存">{{ detailData.beforeStock }}</el-descriptions-item>
        <el-descriptions-item label="操作后库存">{{ detailData.afterStock }}</el-descriptions-item>
        <el-descriptions-item label="操作人">{{ detailData.operator }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ detailData.operateTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailData.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="Stock">
const { proxy } = getCurrentInstance()

const stockRecordList = ref([])
const loading = ref(false)
const showSearch = ref(true)
const total = ref(0)
const dateRange = ref([])
const stockInOpen = ref(false)
const stockOutOpen = ref(false)
const detailOpen = ref(false)
const materialOptions = ref([])
const supplierOptions = ref([])
const detailData = ref({})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialName: undefined,
    type: undefined
  },
  stockInForm: {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    supplierId: undefined,
    remark: undefined
  },
  stockOutForm: {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    receiver: undefined,
    department: undefined,
    remark: undefined
  },
  stockInRules: {
    materialId: [{ required: true, message: '请选择物资', trigger: 'change' }],
    quantity: [{ required: true, message: '请输入入库数量', trigger: 'blur' }]
  },
  stockOutRules: {
    materialId: [{ required: true, message: '请选择物资', trigger: 'change' }],
    quantity: [{ required: true, message: '请输入出库数量', trigger: 'blur' }],
    receiver: [{ required: true, message: '请输入领用人', trigger: 'blur' }]
  }
})

const { queryParams, stockInForm, stockOutForm, stockInRules, stockOutRules } = toRefs(data)

// 模拟数据
const mockStockRecordList = [
  { id: 1, recordNo: 'RK202401001', materialCode: 'WZ001', materialName: '办公桌', type: 'in', quantity: 20, beforeStock: 30, afterStock: 50, operator: '管理员', operateTime: '2024-01-15 10:30:00', remark: '采购入库' },
  { id: 2, recordNo: 'CK202401001', materialCode: 'WZ002', materialName: '办公椅', type: 'out', quantity: 10, beforeStock: 90, afterStock: 80, operator: '管理员', operateTime: '2024-01-15 14:20:00', remark: '行政部领用' },
  { id: 3, recordNo: 'RK202401002', materialCode: 'WZ003', materialName: 'A4打印纸', type: 'in', quantity: 100, beforeStock: 5, afterStock: 105, operator: '管理员', operateTime: '2024-01-16 09:00:00', remark: '紧急补货' },
  { id: 4, recordNo: 'CK202401002', materialCode: 'WZ003', materialName: 'A4打印纸', type: 'out', quantity: 50, beforeStock: 105, afterStock: 55, operator: '管理员', operateTime: '2024-01-16 15:30:00', remark: '财务部领用' },
  { id: 5, recordNo: 'RK202401003', materialCode: 'WZ005', materialName: '笔记本电脑', type: 'in', quantity: 5, beforeStock: 10, afterStock: 15, operator: '管理员', operateTime: '2024-01-17 11:00:00', remark: '新设备采购' }
]

const mockMaterialList = [
  { id: 1, code: 'WZ001', name: '办公桌', stock: 50 },
  { id: 2, code: 'WZ002', name: '办公椅', stock: 80 },
  { id: 3, code: 'WZ003', name: 'A4打印纸', stock: 5 },
  { id: 4, code: 'WZ004', name: '签字笔', stock: 200 },
  { id: 5, code: 'WZ005', name: '笔记本电脑', stock: 15 }
]

const mockSupplierList = [
  { id: 1, name: '家具供应商A' },
  { id: 2, name: '文具供应商B' },
  { id: 3, name: '电子设备供应商C' }
]

/** 查询出入库记录列表 */
function getList() {
  loading.value = true
  setTimeout(() => {
    let list = [...mockStockRecordList]
    if (queryParams.value.materialName) {
      list = list.filter(item => item.materialName.includes(queryParams.value.materialName))
    }
    if (queryParams.value.type) {
      list = list.filter(item => item.type === queryParams.value.type)
    }
    stockRecordList.value = list
    total.value = list.length
    loading.value = false
  }, 300)
}

/** 获取物资列表 */
function getMaterialList() {
  materialOptions.value = mockMaterialList
}

/** 获取供应商列表 */
function getSupplierList() {
  supplierOptions.value = mockSupplierList
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  proxy.resetForm('queryRef')
  handleQuery()
}

/** 入库登记 */
function handleStockIn() {
  stockInForm.value = {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    supplierId: undefined,
    remark: undefined
  }
  stockInOpen.value = true
}

/** 出库登记 */
function handleStockOut() {
  stockOutForm.value = {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    receiver: undefined,
    department: undefined,
    remark: undefined
  }
  stockOutOpen.value = true
}

/** 物资选择变化（入库） */
function handleMaterialChange(val) {
  const material = materialOptions.value.find(item => item.id === val)
  if (material) {
    stockInForm.value.currentStock = material.stock
  }
}

/** 物资选择变化（出库） */
function handleMaterialChangeOut(val) {
  const material = materialOptions.value.find(item => item.id === val)
  if (material) {
    stockOutForm.value.currentStock = material.stock
  }
}

/** 提交入库 */
function submitStockIn() {
  proxy.$refs['stockInRef'].validate(valid => {
    if (valid) {
      proxy.$modal.msgSuccess('入库成功')
      stockInOpen.value = false
      getList()
    }
  })
}

/** 提交出库 */
function submitStockOut() {
  proxy.$refs['stockOutRef'].validate(valid => {
    if (valid) {
      if (stockOutForm.value.quantity > stockOutForm.value.currentStock) {
        proxy.$modal.msgError('出库数量不能大于当前库存')
        return
      }
      proxy.$modal.msgSuccess('出库成功')
      stockOutOpen.value = false
      getList()
    }
  })
}

/** 查看详情 */
function handleDetail(row) {
  detailData.value = row
  detailOpen.value = true
}

/** 导出 */
function handleExport() {
  proxy.$modal.msgSuccess('导出功能待后端接口实现')
}

getMaterialList()
getSupplierList()
getList()
</script>

<style scoped>
.text-success {
  color: #67c23a;
  font-weight: bold;
}

.text-warning {
  color: #e6a23c;
  font-weight: bold;
}
</style>
