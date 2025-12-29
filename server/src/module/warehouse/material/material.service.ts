import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { MaterialEntity } from './entities/material.entity';
import { CreateMaterialDto, UpdateMaterialDto, QueryMaterialDto } from './dto/index';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  // 查询物资列表
  async findAll(query: QueryMaterialDto) {
    const where: any = { delFlag: '0' };
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.code) {
      where.code = Like(`%${query.code}%`);
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.status) {
      where.status = query.status;
    }

    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;

    const [list, total] = await this.materialRepository.findAndCount({
      where,
      order: { createTime: 'DESC' },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return ResultData.ok({
      list,
      total,
    });
  }

  // 查询所有物资（下拉选择）
  async findAllOptions() {
    const list = await this.materialRepository.find({
      where: { delFlag: '0', status: '0' },
      select: ['materialId', 'name', 'code', 'stock', 'unit'],
      order: { createTime: 'DESC' },
    });
    return ResultData.ok(list);
  }

  // 查询物资详情
  async findOne(id: number) {
    const material = await this.materialRepository.findOne({
      where: { materialId: id, delFlag: '0' },
    });
    return ResultData.ok(material);
  }

  // 新增物资
  async create(createMaterialDto: CreateMaterialDto) {
    // 检查编码是否重复
    const exists = await this.materialRepository.findOne({
      where: { code: createMaterialDto.code, delFlag: '0' },
    });
    if (exists) {
      return ResultData.fail(500, '物资编码已存在');
    }

    const material = this.materialRepository.create(createMaterialDto);
    await this.materialRepository.save(material);
    return ResultData.ok();
  }

  // 修改物资
  async update(updateMaterialDto: UpdateMaterialDto) {
    // 检查编码是否重复（排除自身）
    const exists = await this.materialRepository.findOne({
      where: { code: updateMaterialDto.code, delFlag: '0' },
    });
    if (exists && exists.materialId !== updateMaterialDto.materialId) {
      return ResultData.fail(500, '物资编码已存在');
    }

    await this.materialRepository.update(updateMaterialDto.materialId, updateMaterialDto);
    return ResultData.ok();
  }

  // 删除物资
  async remove(id: number) {
    await this.materialRepository.update(id, { delFlag: '1' });
    return ResultData.ok();
  }

  // 更新库存
  async updateStock(materialId: number, quantity: number, type: 'in' | 'out') {
    const material = await this.materialRepository.findOne({
      where: { materialId, delFlag: '0' },
    });
    if (!material) {
      return ResultData.fail(500, '物资不存在');
    }

    let newStock = material.stock;
    if (type === 'in') {
      newStock += quantity;
    } else {
      newStock -= quantity;
      if (newStock < 0) {
        return ResultData.fail(500, '库存不足');
      }
    }

    await this.materialRepository.update(materialId, { stock: newStock });
    return ResultData.ok({ beforeStock: material.stock, afterStock: newStock });
  }

  // 获取库存预警列表
  async getWarningList() {
    const list = await this.materialRepository
      .createQueryBuilder('m')
      .where('m.del_flag = :delFlag', { delFlag: '0' })
      .andWhere('m.status = :status', { status: '0' })
      .andWhere('m.stock <= m.safe_stock')
      .orderBy('m.stock', 'ASC')
      .getMany();

    return ResultData.ok(list);
  }
}
