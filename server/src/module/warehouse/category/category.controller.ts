import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto } from './dto/index';
import { UserTool, UserToolType } from 'src/module/system/user/user.decorator';

@ApiTags('物资分类管理')
@Controller('warehouse/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '查询分类列表' })
  @Get('list')
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoryService.findAll(query);
  }

  @ApiOperation({ summary: '查询分类树' })
  @Get('tree')
  findTree() {
    return this.categoryService.findTree();
  }

  @ApiOperation({ summary: '查询分类详情' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: '新增分类' })
  @ApiBody({ type: CreateCategoryDto })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @UserTool() userTool: UserToolType) {
    userTool.injectCreate(createCategoryDto);
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: '修改分类' })
  @ApiBody({ type: UpdateCategoryDto })
  @Put()
  update(@Body() updateCategoryDto: UpdateCategoryDto, @UserTool() userTool: UserToolType) {
    userTool.injectUpdate(updateCategoryDto);
    return this.categoryService.update(updateCategoryDto);
  }

  @ApiOperation({ summary: '删除分类' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}
