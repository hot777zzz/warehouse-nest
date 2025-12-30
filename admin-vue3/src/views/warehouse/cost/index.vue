<template>
  <div class="app-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--primary">
          <div class="stat-card__content">
            <div class="stat-card__icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__value">¥{{ formatMoney(summaryData.totalInCost) }}</div>
              <div class="stat-card__label">入库总成本</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--warning">
          <div class="stat-card__content">
            <div class="stat-card__icon">
              <el-icon><Goods /></el-icon>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__value">¥{{ formatMoney(summaryData.totalOutCost) }}</div>
              <div class="stat-card__label">出库总成本</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--danger">
          <div class="stat-card__content">
            <div class="stat-card__icon">
              <el-icon><RefreshLeft /></el-icon>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__value">¥{{ formatMoney(summaryData.totalReturnCost) }}</div>
              <div class="stat-card__label">退货总成本</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card--success">
          <div class="stat-card__content">
            <div class="stat-card__icon">
              <el-icon><Coin /></el-icon>
            </div>
            <div class="stat-card__info">
              <div class="stat-card__value">¥{{ formatMoney(summaryData.netCost) }}</div>
              <div class="stat-card__label">净成本（入库-退货）</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 查询表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="物资名称" prop="materialName">
        <el-input
          v-model="queryParams.materialName"
          placeholder="请输入物资名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="queryParams.categoryId" placeholder="请选择分类" clearable>
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="统计周期">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain icon="Download" @click="handleExport">导出报表</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Printer" @click="handlePrint">打印报表</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 成本明细表 -->
    <el-table v-loading="loading" :data="costList" show-summary :summary-method="getSummaries">
      <el-table-column label="物资编码" align="center" prop="materialCode" width="100" />
      <el-table-column label="物资名称" align="center" prop="materialName" />
      <el-table-column label="分类" align="center" prop="categoryName" width="100" />
      <el-table-column label="单价" align="center" prop="unitPrice" width="100">
        <template #default="scope">
          ¥{{ formatMoney(scope.row.unitPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="入库" align="center">
        <el-table-column label="数量" align="center" prop="inQuantity" width="80">
          <template #default="scope">
            <span class="text-success">+{{ scope.row.inQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本" align="center" prop="inCost" width="110">
          <template #default="scope">
            <span class="text-success">¥{{ formatMoney(scope.row.inCost) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="出库" align="center">
        <el-table-column label="数量" align="center" prop="outQuantity" width="80">
          <template #default="scope">
            <span class="text-warning">-{{ scope.row.outQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本" align="center" prop="outCost" width="110">
          <template #default="scope">
            <span class="text-warning">¥{{ formatMoney(scope.row.outCost) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="退货" align="center">
        <el-table-column label="采购退货" align="center" prop="purchaseReturnQuantity" width="80">
          <template #default="scope">
            <span class="text-danger">{{ scope.row.purchaseReturnQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售退货" align="center" prop="salesReturnQuantity" width="80">
          <template #default="scope">
            <span class="text-info">{{ scope.row.salesReturnQuantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退货成本" align="center" prop="returnCost" width="110">
          <template #default="scope">
            <span class="text-danger">¥{{ formatMoney(scope.row.returnCost) }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="当前库存" align="center" prop="currentStock" width="80" />
      <el-table-column label="库存成本" align="center" prop="stockCost" width="110">
        <template #default="scope">
          ¥{{ formatMoney(scope.row.stockCost) }}
        </template>
      </el-table-column>
      <el-table-column label="净成本" align="center" prop="netCost" width="110">
        <template #default="scope">
          <span :class="scope.row.netCost >= 0 ? 'text-success' : 'text-danger'">
            ¥{{ formatMoney(scope.row.netCost) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template #default="scope">
          <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">明细</el-button>
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

    <!-- 成本明细对话框 -->
    <el-dialog :title="`${detailData.materialName} - 成本明细`" v-model="detailOpen" width="900px" append-to-body>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="入库记录" name="in">
          <el-table :data="detailData.inRecords" max-height="400">
            <el-table-column label="记录编号" align="center" prop="recordNo" />
            <el-table-column label="入库数量" align="center" prop="quantity" />
            <el-table-column label="单价" align="center" prop="unitPrice">
              <template #default="scope">¥{{ formatMoney(scope.unitPrice) }}</template>
            </el-table-column>
            <el-table-column label="成本" align="center" prop="cost">
              <template #default="scope">¥{{ formatMoney(scope.cost) }}</template>
            </el-table-column>
            <el-table-column label="供应商" align="center" prop="supplier" />
            <el-table-column label="操作时间" align="center" prop="operateTime" width="160" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="出库记录" name="out">
          <el-table :data="detailData.outRecords" max-height="400">
            <el-table-column label="记录编号" align="center" prop="recordNo" />
            <el-table-column label="出库数量" align="center" prop="quantity" />
            <el-table-column label="单价" align="center" prop="unitPrice">
              <template #default="scope">¥{{ formatMoney(scope.unitPrice) }}</template>
            </el-table-column>
            <el-table-column label="成本" align="center" prop="cost">
              <template #default="scope">¥{{ formatMoney(scope.cost) }}</template>
            </el-table-column>
            <el-table-column label="领用人" align="center" prop="receiver" />
            <el-table-column label="操作时间" align="center" prop="operateTime" width="160" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="退货记录" name="return">
          <el-table :data="detailData.returnRecords" max-height="400">
            <el-table-column label="退货单号" align="center" prop="returnNo" />
            <el-table-column label="退货类型" align="center" prop="returnType">
              <template #default="scope">
                <el-tag :type="scope.row.returnType === 'purchase' ? 'primary' : 'warning'" size="small">
                  {{ scope.row.returnType === 'purchase' ? '采购退货' : '销售退货' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="退货数量" align="center" prop="quantity" />
            <el-table-column label="单价" align="center" prop="unitPrice">
              <template #default="scope">¥{{ formatMoney(scope.unitPrice) }}</template>
            </el-table-column>
            <el-table-column label="退货成本" align="center" prop="cost">
              <template #default="scope">¥{{ formatMoney(scope.cost) }}</template>
            </el-table-column>
            <el-table-column label="退货时间" align="center" prop="returnTime" width="160" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="detail-summary">
        <el-descriptions :column="4" border>
          <el-descriptions-item label="入库总成本">
            <span class="text-success">¥{{ formatMoney(detailData.inCost) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="出库总成本">
            <span class="text-warning">¥{{ formatMoney(detailData.outCost) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="退货总成本">
            <span class="text-danger">¥{{ formatMoney(detailData.returnCost) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="净成本">
            <span :class="detailData.netCost >= 0 ? 'text-success' : 'text-danger'">
              ¥{{ formatMoney(detailData.netCost) }}
            </span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="Cost">
import { TrendCharts, Goods, RefreshLeft, Coin } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

const costList = ref([])
const loading = ref(false)
const showSearch = ref(true)
const total = ref(0)
const dateRange = ref([])
const detailOpen = ref(false)
const detailData = ref({})
const activeTab = ref('in')
const categoryOptions = ref([])

const summaryData = reactive({
  totalInCost: 0,
  totalOutCost: 0,
  totalReturnCost: 0,
  netCost: 0
})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    materialName: undefined,
    categoryId: undefined
  }
})

const { queryParams } = toRefs(data)

// 模拟成本数据
const mockCostList = [
  {
    id: 1,
    materialCode: 'WZ001',
    materialName: '办公桌',
    categoryName: '办公家具',
    unitPrice: 500,
    inQuantity: 20,
    inCost: 10000,
    outQuantity: 5,
    outCost: 2500,
    purchaseReturnQuantity: 2,
    salesReturnQuantity: 0,
    returnCost: 1000,
    currentStock: 13,
    stockCost: 6500,
    netCost: 9000,
    inRecords: [
      { recordNo: 'RK202401001', quantity: 10, unitPrice: 500, cost: 5000, supplier: '家具供应商A', operateTime: '2024-01-10 10:00:00' },
      { recordNo: 'RK202401005', quantity: 10, unitPrice: 500, cost: 5000, supplier: '家具供应商A', operateTime: '2024-01-15 14:00:00' }
    ],
    outRecords: [
      { recordNo: 'CK202401001', quantity: 3, unitPrice: 500, cost: 1500, receiver: '张三', operateTime: '2024-01-12 09:00:00' },
      { recordNo: 'CK202401003', quantity: 2, unitPrice: 500, cost: 1000, receiver: '李四', operateTime: '2024-01-16 11:00:00' }
    ],
    returnRecords: [
      { returnNo: 'TH202401001', returnType: 'purchase', quantity: 2, unitPrice: 500, cost: 1000, returnTime: '2024-01-14 15:00:00' }
    ]
  },
  {
    id: 2,
    materialCode: 'WZ002',
    materialName: '办公椅',
    categoryName: '办公家具',
    unitPrice: 300,
    inQuantity: 50,
    inCost: 15000,
    outQuantity: 20,
    outCost: 6000,
    purchaseReturnQuantity: 0,
    salesReturnQuantity: 3,
    returnCost: 900,
    currentStock: 33,
    stockCost: 9900,
    netCost: 15000,
    inRecords: [
      { recordNo: 'RK202401002', quantity: 50, unitPrice: 300, cost: 15000, supplier: '家具供应商A', operateTime: '2024-01-11 10:00:00' }
    ],
    outRecords: [
      { recordNo: 'CK202401002', quantity: 20, unitPrice: 300, cost: 6000, receiver: '行政部', operateTime: '2024-01-13 14:00:00' }
    ],
    returnRecords: [
      { returnNo: 'TH202401002', returnType: 'sales', quantity: 3, unitPrice: 300, cost: 900, returnTime: '2024-01-17 10:00:00' }
    ]
  },
  {
    id: 3,
    materialCode: 'WZ003',
    materialName: 'A4打印纸',
    categoryName: '办公耗材',
    unitPrice: 25,
    inQuantity: 200,
    inCost: 5000,
    outQuantity: 100,
    outCost: 2500,
    purchaseReturnQuantity: 20,
    salesReturnQuantity: 0,
    returnCost: 500,
    currentStock: 80,
    stockCost: 2000,
    netCost: 4500,
    inRecords: [
      { recordNo: 'RK202401003', quantity: 100, unitPrice: 25, cost: 2500, supplier: '文具供应商B', operateTime: '2024-01-08 09:00:00' },
      { recordNo: 'RK202401006', quantity: 100, unitPrice: 25, cost: 2500, supplier: '文具供应商B', operateTime: '2024-01-16 09:00:00' }
    ],
    outRecords: [
      { recordNo: 'CK202401004', quantity: 50, unitPrice: 25, cost: 1250, receiver: '财务部', operateTime: '2024-01-10 10:00:00' },
      { recordNo: 'CK202401005', quantity: 50, unitPrice: 25, cost: 1250, receiver: '人事部', operateTime: '2024-01-15 15:00:00' }
    ],
    returnRecords: [
      { returnNo: 'TH202401003', returnType: 'purchase', quantity: 20, unitPrice: 25, cost: 500, returnTime: '2024-01-17 09:00:00' }
    ]
  },
  {
    id: 4,
    materialCode: 'WZ004',
    materialName: '签字笔',
    categoryName: '办公耗材',
    unitPrice: 2,
    inQuantity: 500,
    inCost: 1000,
    outQuantity: 300,
    outCost: 600,
    purchaseReturnQuantity: 50,
    salesReturnQuantity: 0,
    returnCost: 100,
    currentStock: 150,
    stockCost: 300,
    netCost: 900,
    inRecords: [
      { recordNo: 'RK202401004', quantity: 500, unitPrice: 2, cost: 1000, supplier: '文具供应商B', operateTime: '2024-01-09 11:00:00' }
    ],
    outRecords: [
      { recordNo: 'CK202401006', quantity: 300, unitPrice: 2, cost: 600, receiver: '各部门', operateTime: '2024-01-12 16:00:00' }
    ],
    returnRecords: [
      { returnNo: 'TH202401005', returnType: 'purchase', quantity: 50, unitPrice: 2, cost: 100, returnTime: '2024-01-19 15:30:00' }
    ]
  },
  {
    id: 5,
    materialCode: 'WZ005',
    materialName: '笔记本电脑',
    categoryName: '电子设备',
    unitPrice: 5000,
    inQuantity: 10,
    inCost: 50000,
    outQuantity: 5,
    outCost: 25000,
    purchaseReturnQuantity: 0,
    salesReturnQuantity: 1,
    returnCost: 5000,
    currentStock: 6,
    stockCost: 30000,
    netCost: 50000,
    inRecords: [
      { recordNo: 'RK202401007', quantity: 10, unitPrice: 5000, cost: 50000, supplier: '电子设备供应商C', operateTime: '2024-01-17 11:00:00' }
    ],
    outRecords: [
      { recordNo: 'CK202401007', quantity: 5, unitPrice: 5000, cost: 25000, receiver: '研发部', operateTime: '2024-01-18 10:00:00' }
    ],
    returnRecords: [
      { returnNo: 'TH202401004', returnType: 'sales', quantity: 1, unitPrice: 5000, cost: 5000, returnTime: '2024-01-18 11:00:00' }
    ]
  }
]

const mockCategoryList = [
  { id: 1, name: '办公家具' },
  { id: 2, name: '办公耗材' },
  { id: 3, name: '电子设备' }
]

/** 格式化金额 */
function formatMoney(value) {
  if (value === undefined || value === null) return '0.00'
  return Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/** 计算汇总数据 */
function calculateSummary(list) {
  summaryData.totalInCost = list.reduce((sum, item) => sum + item.inCost, 0)
  summaryData.totalOutCost = list.reduce((sum, item) => sum + item.outCost, 0)
  summaryData.totalReturnCost = list.reduce((sum, item) => sum + item.returnCost, 0)
  summaryData.netCost = summaryData.totalInCost - summaryData.totalReturnCost
}

/** 表格合计行 */
function getSummaries({ columns, data }) {
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const prop = column.property
    if (['inQuantity', 'outQuantity', 'purchaseReturnQuantity', 'salesReturnQuantity', 'currentStock'].includes(prop)) {
      sums[index] = data.reduce((sum, item) => sum + (item[prop] || 0), 0)
    } else if (['inCost', 'outCost', 'returnCost', 'stockCost', 'netCost'].includes(prop)) {
      const total = data.reduce((sum, item) => sum + (item[prop] || 0), 0)
      sums[index] = '¥' + formatMoney(total)
    } else {
      sums[index] = ''
    }
  })
  return sums
}

/** 查询成本列表 */
function getList() {
  loading.value = true
  setTimeout(() => {
    let list = [...mockCostList]
    if (queryParams.value.materialName) {
      list = list.filter(item => item.materialName.includes(queryParams.value.materialName))
    }
    if (queryParams.value.categoryId) {
      const category = categoryOptions.value.find(c => c.id === queryParams.value.categoryId)
      if (category) {
        list = list.filter(item => item.categoryName === category.name)
      }
    }
    costList.value = list
    total.value = list.length
    calculateSummary(list)
    loading.value = false
  }, 300)
}

/** 获取分类列表 */
function getCategoryList() {
  categoryOptions.value = mockCategoryList
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

/** 查看明细 */
function handleDetail(row) {
  detailData.value = row
  activeTab.value = 'in'
  detailOpen.value = true
}

/** 导出报表 */
function handleExport() {
  proxy.$modal.msgSuccess('导出功能待后端接口实现')
}

/** 打印报表 */
function handlePrint() {
  proxy.$modal.msgSuccess('打印功能待后端接口实现')
}

getCategoryList()
getList()
</script>

<style scoped>
.mb20 {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
}

.stat-card__content {
  display: flex;
  align-items: center;
}

.stat-card__icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
}

.stat-card--primary .stat-card__icon {
  background: rgba(64, 158, 255, .1);
  color: #409eff;
}

.stat-card--warning .stat-card__icon {
  background: rgba(230, 162, 60, .1);
  color: #e6a23c;
}

.stat-card--danger .stat-card__icon {
  background: rgba(245, 108, 108, .1);
  color: #f56c6c;
}

.stat-card--success .stat-card__icon {
  background: rgba(103, 194, 58, .1);
  color: #67c23a;
}

.stat-card__value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-card__label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.text-success {
  color: #67c23a;
  font-weight: bold;
}

.text-warning {
  color: #e6a23c;
  font-weight: bold;
}

.text-danger {
  color: #f56c6c;
  font-weight: bold;
}

.text-info {
  color: #909399;
  font-weight: bold;
}

.detail-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
