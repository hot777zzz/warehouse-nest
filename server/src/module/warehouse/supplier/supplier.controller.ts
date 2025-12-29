import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto, UpdateSupplierDto, QuerySupplierDto } from './dto/index';
import { UserTool, UserToolType } from 'src/module/system/user/user.decorator';

@ApiTags('供应商管理')
@Controller('warehouse/supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @ApiOperation({ summary: '查询供应商列表' })
  @Get('list')
  findAll(@Query() query: QuerySupplierDto) {
    return this.supplierService.findAll(query);
  }

  @ApiOperation({ summary: '查询所有供应商（下拉选择）' })
  @Get('options')
  findAllOptions() {
    return this.supplierService.findAllOptions();
  }

  @ApiOperation({ summary: '查询供应商详情' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.supplierService.findOne(id);
  }

  @ApiOperation({ summary: '新增供应商' })
  @ApiBody({ type: CreateSupplierDto })
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto, @UserTool() userTool: UserToolType) {
    userTool.injectCreate(createSupplierDto);
    return this.supplierService.create(createSupplierDto);
  }

  @ApiOperation({ summary: '修改供应商' })
  @ApiBody({ type: UpdateSupplierDto })
  @Put()
  update(@Body() updateSupplierDto: UpdateSupplierDto, @UserTool() userTool: UserToolType) {
    userTool.injectUpdate(updateSupplierDto);
    return this.supplierService.update(updateSupplierDto);
  }

  @ApiOperation({ summary: '删除供应商' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.supplierService.remove(id);
  }
}
