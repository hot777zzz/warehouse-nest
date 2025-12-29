import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('数据看板')
@Controller('warehouse/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: '获取统计数据' })
  @Get('statistics')
  getStatistics() {
    return this.dashboardService.getStatistics();
  }

  @ApiOperation({ summary: '获取库存趋势数据' })
  @Get('trend')
  getStockTrend(@Query('type') type: string) {
    return this.dashboardService.getStockTrend(type);
  }

  @ApiOperation({ summary: '获取物资分类占比' })
  @Get('category-ratio')
  getCategoryRatio() {
    return this.dashboardService.getCategoryRatio();
  }

  @ApiOperation({ summary: '获取预警数据' })
  @Get('warning')
  getWarningData() {
    return this.dashboardService.getWarningData();
  }

  @ApiOperation({ summary: '获取最近出入库记录' })
  @Get('recent-records')
  getRecentRecords(@Query('limit') limit: number) {
    return this.dashboardService.getRecentRecords(limit || 10);
  }
}
