<template>
  <div class="app-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409eff">
              <el-icon :size="28"><Box /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalMaterial }}</div>
              <div class="stat-label">物资种类</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon :size="28"><Tickets /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.totalStock }}</div>
              <div class="stat-label">库存总量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon :size="28"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.warningCount }}</div>
              <div class="stat-label">预警物资</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon :size="28"><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ statistics.todayInOut }}</div>
              <div class="stat-label">今日出入库</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="mb20">
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>库存趋势</span>
              <el-radio-group v-model="trendType" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover">
          <template #header>
            <span>物资分类占比</span>
          </template>
          <div ref="pieChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预警列表和最近记录 -->
    <el-row :gutter="20">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>库存预警</span>
              <el-button type="primary" link @click="goToWarningPage">查看全部</el-button>
            </div>
          </template>
          <el-table :data="warningList" style="width: 100%" max-height="300">
            <el-table-column prop="materialName" label="物资名称" />
            <el-table-column prop="currentStock" label="当前库存" align="center">
              <template #default="scope">
                <el-tag type="danger">{{ scope.row.currentStock }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="safeStock" label="安全库存" align="center" />
            <el-table-column prop="shortage" label="缺口" align="center">
              <template #default="scope">
                <span class="text-danger">{{ scope.row.shortage }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近出入库记录</span>
              <el-button type="primary" link @click="goToStockPage">查看全部</el-button>
            </div>
          </template>
          <el-table :data="recentRecords" style="width: 100%" max-height="300">
            <el-table-column prop="materialName" label="物资名称" />
            <el-table-column prop="type" label="类型" align="center" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.type === 'in' ? 'success' : 'warning'" size="small">
                  {{ scope.row.type === 'in' ? '入库' : '出库' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center" width="80" />
            <el-table-column prop="operateTime" label="时间" width="150" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Dashboard">
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

const router = useRouter()
const trendChartRef = ref(null)
const pieChartRef = ref(null)
const trendType = ref('week')

let trendChart = null
let pieChart = null

const statistics = ref({
  totalMaterial: 156,
  totalStock: 12580,
  warningCount: 8,
  todayInOut: 23
})

const warningList = ref([
  { materialName: 'A4打印纸', currentStock: 5, safeStock: 50, shortage: 45 },
  { materialName: '签字笔(黑)', currentStock: 20, safeStock: 100, shortage: 80 },
  { materialName: '文件夹', currentStock: 15, safeStock: 50, shortage: 35 },
  { materialName: '订书机', currentStock: 3, safeStock: 20, shortage: 17 },
  { materialName: '胶带', currentStock: 8, safeStock: 30, shortage: 22 }
])

const recentRecords = ref([
  { materialName: '办公桌', type: 'in', quantity: 20, operateTime: '2024-01-17 15:30' },
  { materialName: '办公椅', type: 'out', quantity: 10, operateTime: '2024-01-17 14:20' },
  { materialName: 'A4打印纸', type: 'in', quantity: 100, operateTime: '2024-01-17 11:00' },
  { materialName: '笔记本电脑', type: 'out', quantity: 5, operateTime: '2024-01-17 10:30' },
  { materialName: '签字笔', type: 'in', quantity: 200, operateTime: '2024-01-16 16:00' }
])

/** 初始化趋势图 */
function initTrendChart() {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['入库', '出库']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '入库',
          type: 'line',
          smooth: true,
          itemStyle: { color: '#67c23a' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
            ])
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '出库',
          type: 'line',
          smooth: true,
          itemStyle: { color: '#e6a23c' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(230, 162, 60, 0.3)' },
              { offset: 1, color: 'rgba(230, 162, 60, 0.1)' }
            ])
          },
          data: [80, 92, 91, 84, 109, 130, 110]
        }
      ]
    }
    trendChart.setOption(option)
  }
}

/** 初始化饼图 */
function initPieChart() {
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 3500, name: '办公家具', itemStyle: { color: '#409eff' } },
            { value: 4200, name: '办公用品', itemStyle: { color: '#67c23a' } },
            { value: 2800, name: '电子设备', itemStyle: { color: '#e6a23c' } },
            { value: 2080, name: '劳保用品', itemStyle: { color: '#f56c6c' } }
          ]
        }
      ]
    }
    pieChart.setOption(option)
  }
}

/** 跳转预警页面 */
function goToWarningPage() {
  router.push('/warehouse/material')
}

/** 跳转出入库页面 */
function goToStockPage() {
  router.push('/warehouse/stock')
}

/** 监听窗口大小变化 */
function handleResize() {
  trendChart && trendChart.resize()
  pieChart && pieChart.resize()
}

watch(trendType, () => {
  // 切换趋势类型时重新加载数据
  initTrendChart()
})

onMounted(() => {
  initTrendChart()
  initPieChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart && trendChart.dispose()
  pieChart && pieChart.dispose()
})
</script>

<style scoped lang="scss">
.mb20 {
  margin-bottom: 20px;
}

.stat-card {
  .stat-content {
    display: flex;
    align-items: center;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-right: 15px;
  }

  .stat-info {
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #303133;
    }

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-top: 5px;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-danger {
  color: #f56c6c;
  font-weight: bold;
}
</style>
