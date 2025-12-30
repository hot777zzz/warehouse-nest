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
      <el-form-item label="退货类型" prop="returnType">
        <el-select v-model="queryParams.returnType" placeholder="请选择退货类型" clearable>
          <el-option label="采购退货" value="purchase" />
          <el-option label="销售退货" value="sales" />
        </el-select>
      </el-form-item>
      <el-form-item label="退货状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="待处理" value="pending" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
      </el-form-item>
      <el-form-item label="退货时间">
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
        <el-button type="primary" plain icon="Plus" @click="handlePurchaseReturn">采购退货</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Plus" @click="handleSalesReturn">销售退货</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Download" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="returnList">
      <el-table-column label="退货单号" align="center" prop="returnNo" width="140" />
      <el-table-column label="退货类型" align="center" prop="returnType" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.returnType === 'purchase' ? 'primary' : 'warning'">
            {{ scope.row.returnType === 'purchase' ? '采购退货' : '销售退货' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="物资编码" align="center" prop="materialCode" width="100" />
      <el-table-column label="物资名称" align="center" prop="materialName" />
      <el-table-column label="退货数量" align="center" prop="quantity" width="90">
        <template #default="scope">
          <span class="text-danger">{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商/客户" align="center" prop="targetName" />
      <el-table-column label="退货原因" align="center" prop="reason" show-overflow-tooltip />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="operator" width="90" />
      <el-table-column label="退货时间" align="center" prop="returnTime" width="160" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">详情</el-button>
          <el-button
            v-if="scope.row.status === 'pending'"
            link
            type="success"
            icon="Check"
            @click="handleComplete(scope.row)"
          >完成</el-button>
          <el-button
            v-if="scope.row.status === 'pending'"
            link
            type="danger"
            icon="Close"
            @click="handleCancel(scope.row)"
          >取消</el-button>
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

    <!-- 采购退货对话框 -->
    <el-dialog title="采购退货（退给供应商）" v-model="purchaseReturnOpen" width="600px" append-to-body>
      <el-form ref="purchaseReturnRef" :model="purchaseReturnForm" :rules="returnRules" label-width="100px">
        <el-form-item label="选择物资" prop="materialId">
          <el-select v-model="purchaseReturnForm.materialId" placeholder="请选择物资" filterable @change="handleMaterialChange('purchase')">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="`${item.code} - ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存">
          <el-input v-model="purchaseReturnForm.currentStock" disabled />
        </el-form-item>
        <el-form-item label="退货数量" prop="quantity">
          <el-input-number v-model="purchaseReturnForm.quantity" :min="1" :max="purchaseReturnForm.currentStock || 9999" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierId">
          <el-select v-model="purchaseReturnForm.supplierId" placeholder="请选择退货供应商" filterable>
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="退货原因" prop="reason">
          <el-select v-model="purchaseReturnForm.reason" placeholder="请选择退货原因">
            <el-option label="质量问题" value="质量问题" />
            <el-option label="规格不符" value="规格不符" />
            <el-option label="数量错误" value="数量错误" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="purchaseReturnForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitPurchaseReturn">确 定</el-button>
          <el-button @click="purchaseReturnOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 销售退货对话框 -->
    <el-dialog title="销售退货（客户退回）" v-model="salesReturnOpen" width="600px" append-to-body>
      <el-form ref="salesReturnRef" :model="salesReturnForm" :rules="salesReturnRules" label-width="100px">
        <el-form-item label="选择物资" prop="materialId">
          <el-select v-model="salesReturnForm.materialId" placeholder="请选择物资" filterable @change="handleMaterialChange('sales')">
            <el-option
              v-for="item in materialOptions"
              :key="item.id"
              :label="`${item.code} - ${item.name}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存">
          <el-input v-model="salesReturnForm.currentStock" disabled />
        </el-form-item>
        <el-form-item label="退货数量" prop="quantity">
          <el-input-number v-model="salesReturnForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="salesReturnForm.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系电话" prop="customerPhone">
          <el-input v-model="salesReturnForm.customerPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="退货原因" prop="reason">
          <el-select v-model="salesReturnForm.reason" placeholder="请选择退货原因">
            <el-option label="质量问题" value="质量问题" />
            <el-option label="规格不符" value="规格不符" />
            <el-option label="客户不满意" value="客户不满意" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="salesReturnForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitSalesReturn">确 定</el-button>
          <el-button @click="salesReturnOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog title="退货详情" v-model="detailOpen" width="550px" append-to-body>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="退货单号">{{ detailData.returnNo }}</el-descriptions-item>
        <el-descriptions-item label="退货类型">
          <el-tag :type="detailData.returnType === 'purchase' ? 'primary' : 'warning'">
            {{ detailData.returnType === 'purchase' ? '采购退货' : '销售退货' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="物资编码">{{ detailData.materialCode }}</el-descriptions-item>
        <el-descriptions-item label="物资名称">{{ detailData.materialName }}</el-descriptions-item>
        <el-descriptions-item label="退货数量">{{ detailData.quantity }}</el-descriptions-item>
        <el-descriptions-item :label="detailData.returnType === 'purchase' ? '供应商' : '客户'">
          {{ detailData.targetName }}
        </el-descriptions-item>
        <el-descriptions-item label="退货原因">{{ detailData.reason }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailData.status)">
            {{ getStatusLabel(detailData.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="操作人">{{ detailData.operator }}</el-descriptions-item>
        <el-descriptions-item label="退货时间">{{ detailData.returnTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailData.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup name="Return">
const { proxy } = getCurrentInstance()

const returnList = ref([])
const loading = ref(false)
const showSearch = ref(true)
const total = ref(0)
const dateRange = ref([])
const purchaseReturnOpen = ref(false)
const salesReturnOpen = ref(false)
const detailOpen = ref(false)
const materialOptions = ref([])
const supplierOptions = ref([])
const detailData = ref({})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialName: undefined,
    returnType: undefined,
    status: undefined
  },
  purchaseReturnForm: {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    supplierId: undefined,
    reason: undefined,
    remark: undefined
  },
  salesReturnForm: {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    customerName: undefined,
    customerPhone: undefined,
    reason: undefined,
    remark: undefined
  },
  returnRules: {
    materialId: [{ required: true, message: '请选择物资', trigger: 'change' }],
    quantity: [{ required: true, message: '请输入退货数量', trigger: 'blur' }],
    supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
    reason: [{ required: true, message: '请选择退货原因', trigger: 'change' }]
  },
  salesReturnRules: {
    materialId: [{ required: true, message: '请选择物资', trigger: 'change' }],
    quantity: [{ required: true, message: '请输入退货数量', trigger: 'blur' }],
    customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
    reason: [{ required: true, message: '请选择退货原因', trigger: 'change' }]
  }
})

const { queryParams, purchaseReturnForm, salesReturnForm, returnRules, salesReturnRules } = toRefs(data)

// 模拟数据
const mockReturnList = [
  { id: 1, returnNo: 'TH202401001', returnType: 'purchase', materialCode: 'WZ001', materialName: '办公桌', quantity: 5, targetName: '家具供应商A', reason: '质量问题', status: 'completed', operator: '管理员', returnTime: '2024-01-15 10:30:00', remark: '桌面有划痕' },
  { id: 2, returnNo: 'TH202401002', returnType: 'sales', materialCode: 'WZ002', materialName: '办公椅', quantity: 3, targetName: '张三', reason: '规格不符', status: 'pending', operator: '管理员', returnTime: '2024-01-16 14:20:00', remark: '客户要求换大号' },
  { id: 3, returnNo: 'TH202401003', returnType: 'purchase', materialCode: 'WZ003', materialName: 'A4打印纸', quantity: 20, targetName: '文具供应商B', reason: '数量错误', status: 'completed', operator: '管理员', returnTime: '2024-01-17 09:00:00', remark: '多发了20包' },
  { id: 4, returnNo: 'TH202401004', returnType: 'sales', materialCode: 'WZ005', materialName: '笔记本电脑', quantity: 1, targetName: '李四', reason: '质量问题', status: 'pending', operator: '管理员', returnTime: '2024-01-18 11:00:00', remark: '屏幕有坏点' },
  { id: 5, returnNo: 'TH202401005', returnType: 'purchase', materialCode: 'WZ004', materialName: '签字笔', quantity: 50, targetName: '文具供应商B', reason: '质量问题', status: 'cancelled', operator: '管理员', returnTime: '2024-01-19 15:30:00', remark: '已协商换货' }
]

const mockMaterialList = [
  { id: 1, code: 'WZ001', name: '办公桌', stock: 50 },
  { id: 2, code: 'WZ002', name: '办公椅', stock: 80 },
  { id: 3, code: 'WZ003', name: 'A4打印纸', stock: 55 },
  { id: 4, code: 'WZ004', name: '签字笔', stock: 200 },
  { id: 5, code: 'WZ005', name: '笔记本电脑', stock: 15 }
]

const mockSupplierList = [
  { id: 1, name: '家具供应商A' },
  { id: 2, name: '文具供应商B' },
  { id: 3, name: '电子设备供应商C' }
]

/** 获取状态标签类型 */
function getStatusType(status) {
  const map = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

/** 获取状态标签文字 */
function getStatusLabel(status) {
  const map = {
    pending: '待处理',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || '未知'
}

/** 查询退货记录列表 */
function getList() {
  loading.value = true
  setTimeout(() => {
    let list = [...mockReturnList]
    if (queryParams.value.materialName) {
      list = list.filter(item => item.materialName.includes(queryParams.value.materialName))
    }
    if (queryParams.value.returnType) {
      list = list.filter(item => item.returnType === queryParams.value.returnType)
    }
    if (queryParams.value.status) {
      list = list.filter(item => item.status === queryParams.value.status)
    }
    returnList.value = list
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

/** 采购退货 */
function handlePurchaseReturn() {
  purchaseReturnForm.value = {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    supplierId: undefined,
    reason: undefined,
    remark: undefined
  }
  purchaseReturnOpen.value = true
}

/** 销售退货 */
function handleSalesReturn() {
  salesReturnForm.value = {
    materialId: undefined,
    currentStock: 0,
    quantity: 1,
    customerName: undefined,
    customerPhone: undefined,
    reason: undefined,
    remark: undefined
  }
  salesReturnOpen.value = true
}

/** 物资选择变化 */
function handleMaterialChange(type) {
  const form = type === 'purchase' ? purchaseReturnForm : salesReturnForm
  const material = materialOptions.value.find(item => item.id === form.value.materialId)
  if (material) {
    form.value.currentStock = material.stock
  }
}

/** 提交采购退货 */
function submitPurchaseReturn() {
  proxy.$refs['purchaseReturnRef'].validate(valid => {
    if (valid) {
      if (purchaseReturnForm.value.quantity > purchaseReturnForm.value.currentStock) {
        proxy.$modal.msgError('退货数量不能大于当前库存')
        return
      }
      proxy.$modal.msgSuccess('采购退货登记成功')
      purchaseReturnOpen.value = false
      getList()
    }
  })
}

/** 提交销售退货 */
function submitSalesReturn() {
  proxy.$refs['salesReturnRef'].validate(valid => {
    if (valid) {
      proxy.$modal.msgSuccess('销售退货登记成功')
      salesReturnOpen.value = false
      getList()
    }
  })
}

/** 查看详情 */
function handleDetail(row) {
  detailData.value = row
  detailOpen.value = true
}

/** 完成退货 */
function handleComplete(row) {
  proxy.$modal.confirm('确认完成该退货单吗？').then(() => {
    proxy.$modal.msgSuccess('退货已完成')
    row.status = 'completed'
  }).catch(() => {})
}

/** 取消退货 */
function handleCancel(row) {
  proxy.$modal.confirm('确认取消该退货单吗？').then(() => {
    proxy.$modal.msgSuccess('退货已取消')
    row.status = 'cancelled'
  }).catch(() => {})
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
.text-danger {
  color: #f56c6c;
  font-weight: bold;
}
</style>
