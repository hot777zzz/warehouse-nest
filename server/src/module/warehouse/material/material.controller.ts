import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { CreateMaterialDto, UpdateMaterialDto, QueryMaterialDto } from './dto/index';
import { UserTool, UserToolType } from 'src/module/system/user/user.decorator';

@ApiTags('物资管理')
@Controller('warehouse/material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @ApiOperation({ summary: '查询物资列表' })
  @Get('list')
  findAll(@Query() query: QueryMaterialDto) {
    return this.materialService.findAll(query);
  }

  @ApiOperation({ summary: '查询所有物资（下拉选择）' })
  @Get('options')
  findAllOptions() {
    return this.materialService.findAllOptions();
  }

  @ApiOperation({ summary: '查询库存预警列表' })
  @Get('warning')
  getWarningList() {
    return this.materialService.getWarningList();
  }

  @ApiOperation({ summary: '查询物资详情' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.materialService.findOne(id);
  }

  @ApiOperation({ summary: '新增物资' })
  @ApiBody({ type: CreateMaterialDto })
  @Post()
  create(@Body() createMaterialDto: CreateMaterialDto, @UserTool() userTool: UserToolType) {
    userTool.injectCreate(createMaterialDto);
    return this.materialService.create(createMaterialDto);
  }

  @ApiOperation({ summary: '修改物资' })
  @ApiBody({ type: UpdateMaterialDto })
  @Put()
  update(@Body() updateMaterialDto: UpdateMaterialDto, @UserTool() userTool: UserToolType) {
    userTool.injectUpdate(updateMaterialDto);
    return this.materialService.update(updateMaterialDto);
  }

  @ApiOperation({ summary: '删除物资' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.materialService.remove(id);
  }
}
