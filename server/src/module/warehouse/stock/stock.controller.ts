import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { QueryStockRecordDto, StockInDto, StockOutDto } from './dto/index';
import { UserTool, UserToolType } from 'src/module/system/user/user.decorator';

@ApiTags('出入库管理')
@Controller('warehouse/stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @ApiOperation({ summary: '查询出入库记录列表' })
  @Get('record/list')
  findAll(@Query() query: QueryStockRecordDto) {
    return this.stockService.findAll(query);
  }

  @ApiOperation({ summary: '查询出入库记录详情' })
  @Get('record/:id')
  findOne(@Param('id') id: number) {
    return this.stockService.findOne(id);
  }

  @ApiOperation({ summary: '入库操作' })
  @ApiBody({ type: StockInDto })
  @Post('in')
  stockIn(@Body() stockInDto: StockInDto, @UserTool() userTool: UserToolType) {
    userTool.injectCreate(stockInDto);
    return this.stockService.stockIn(stockInDto);
  }

  @ApiOperation({ summary: '出库操作' })
  @ApiBody({ type: StockOutDto })
  @Post('out')
  stockOut(@Body() stockOutDto: StockOutDto, @UserTool() userTool: UserToolType) {
    userTool.injectCreate(stockOutDto);
    return this.stockService.stockOut(stockOutDto);
  }

  @ApiOperation({ summary: '获取最近出入库记录' })
  @Get('recent')
  getRecentRecords(@Query('limit') limit: number) {
    return this.stockService.getRecentRecords(limit || 10);
  }
}
