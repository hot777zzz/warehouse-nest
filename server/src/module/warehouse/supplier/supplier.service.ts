import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { CreateSupplierDto, UpdateSupplierDto, QuerySupplierDto } from './dto/index';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierEntity)
    private readonly supplierRepository: Repository<SupplierEntity>,
  ) {}

  // 查询供应商列表
  async findAll(query: QuerySupplierDto) {
    const where: any = { delFlag: '0' };
    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.contact) {
      where.contact = Like(`%${query.contact}%`);
    }
    if (query.status) {
      where.status = query.status;
    }

    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;

    const [list, total] = await this.supplierRepository.findAndCount({
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

  // 查询所有供应商（下拉选择）
  async findAllOptions() {
    const list = await this.supplierRepository.find({
      where: { delFlag: '0', status: '0' },
      select: ['supplierId', 'name', 'code'],
      order: { createTime: 'DESC' },
    });
    return ResultData.ok(list);
  }

  // 查询供应商详情
  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({
      where: { supplierId: id, delFlag: '0' },
    });
    return ResultData.ok(supplier);
  }

  // 新增供应商
  async create(createSupplierDto: CreateSupplierDto) {
    // 检查编码是否重复
    const exists = await this.supplierRepository.findOne({
      where: { code: createSupplierDto.code, delFlag: '0' },
    });
    if (exists) {
      return ResultData.fail(500, '供应商编码已存在');
    }

    const supplier = this.supplierRepository.create(createSupplierDto);
    await this.supplierRepository.save(supplier);
    return ResultData.ok();
  }

  // 修改供应商
  async update(updateSupplierDto: UpdateSupplierDto) {
    // 检查编码是否重复（排除自身）
    const exists = await this.supplierRepository.findOne({
      where: { code: updateSupplierDto.code, delFlag: '0' },
    });
    if (exists && exists.supplierId !== updateSupplierDto.supplierId) {
      return ResultData.fail(500, '供应商编码已存在');
    }

    await this.supplierRepository.update(updateSupplierDto.supplierId, updateSupplierDto);
    return ResultData.ok();
  }

  // 删除供应商
  async remove(id: number) {
    await this.supplierRepository.update(id, { delFlag: '1' });
    return ResultData.ok();
  }
}
