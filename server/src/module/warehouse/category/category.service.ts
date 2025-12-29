import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto, QueryCategoryDto } from './dto/index';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  // 查询分类列表
  async findAll(query: QueryCategoryDto) {
    const where: any = { delFlag: '0' };
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.status) {
      where.status = query.status;
    }

    const list = await this.categoryRepository.find({
      where,
      order: { orderNum: 'ASC', createTime: 'DESC' },
    });

    return ResultData.ok(this.buildTree(list));
  }

  // 查询分类树
  async findTree() {
    const list = await this.categoryRepository.find({
      where: { delFlag: '0', status: '0' },
      order: { orderNum: 'ASC' },
    });
    return ResultData.ok(this.buildTree(list));
  }

  // 查询分类详情
  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id, delFlag: '0' },
    });
    return ResultData.ok(category);
  }

  // 新增分类
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    return ResultData.ok();
  }

  // 修改分类
  async update(updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(updateCategoryDto.categoryId, updateCategoryDto);
    return ResultData.ok();
  }

  // 删除分类
  async remove(id: number) {
    // 检查是否有子分类
    const children = await this.categoryRepository.find({
      where: { parentId: id, delFlag: '0' },
    });
    if (children.length > 0) {
      return ResultData.fail(500, '存在子分类，不允许删除');
    }

    await this.categoryRepository.update(id, { delFlag: '1' });
    return ResultData.ok();
  }

  // 构建树形结构
  private buildTree(list: CategoryEntity[]): CategoryEntity[] {
    const map = new Map<number, CategoryEntity>();
    const roots: CategoryEntity[] = [];

    list.forEach((item) => {
      map.set(item.categoryId, { ...item, children: [] });
    });

    list.forEach((item) => {
      const node = map.get(item.categoryId);
      if (item.parentId === 0 || !map.has(item.parentId)) {
        roots.push(node);
      } else {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      }
    });

    return roots;
  }
}
