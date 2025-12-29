import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { StockRecordEntity } from './entities/stock-record.entity';
import { MaterialEntity } from '../material/entities/material.entity';
import { QueryStockRecordDto, StockInDto, StockOutDto } from './dto/index';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockRecordEntity)
    private readonly stockRecordRepository: Repository<StockRecordEntity>,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  // 查询出入库记录列表
  async findAll(query: QueryStockRecordDto) {
    const queryBuilder = this.stockRecordRepository.createQueryBuilder('r');

    if (query.materialName) {
      queryBuilder.andWhere('r.material_name LIKE :materialName', {
        materialName: `%${query.materialName}%`,
      });
    }
    if (query.type) {
      queryBuilder.andWhere('r.type = :type', { type: query.type });
    }
    if (query.beginTime && query.endTime) {
      queryBuilder.andWhere('r.operate_time BETWEEN :beginTime AND :endTime', {
        beginTime: query.beginTime,
        endTime: query.endTime,
      });
    }

    const pageNum = query.pageNum || 1;
    const pageSize = query.pageSize || 10;

    queryBuilder.orderBy('r.operate_time', 'DESC');
    queryBuilder.skip((pageNum - 1) * pageSize).take(pageSize);

    const [list, total] = await queryBuilder.getManyAndCount();

    return ResultData.ok({
      list,
      total,
    });
  }

  // 查询记录详情
  async findOne(id: number) {
    const record = await this.stockRecordRepository.findOne({
      where: { recordId: id },
    });
    return ResultData.ok(record);
  }

  // 入库操作
  async stockIn(stockInDto: StockInDto & { createBy?: string }) {
    // 查询物资信息
    const material = await this.materialRepository.findOne({
      where: { materialId: stockInDto.materialId, delFlag: '0' },
    });
    if (!material) {
      return ResultData.fail(500, '物资不存在');
    }

    const beforeStock = material.stock;
    const afterStock = beforeStock + stockInDto.quantity;

    // 更新库存
    await this.materialRepository.update(stockInDto.materialId, {
      stock: afterStock,
    });

    // 生成记录编号
    const recordNo = this.generateRecordNo('RK');

    // 创建入库记录
    const record = this.stockRecordRepository.create({
      recordNo,
      materialId: material.materialId,
      materialCode: material.code,
      materialName: material.name,
      type: 'in',
      quantity: stockInDto.quantity,
      beforeStock,
      afterStock,
      supplierId: stockInDto.supplierId,
      supplierName: stockInDto.supplierName || '',
      operator: stockInDto.createBy || '',
      remark: stockInDto.remark || '',
    });
    await this.stockRecordRepository.save(record);

    return ResultData.ok({ recordNo });
  }

  // 出库操作
  async stockOut(stockOutDto: StockOutDto & { createBy?: string }) {
    // 查询物资信息
    const material = await this.materialRepository.findOne({
      where: { materialId: stockOutDto.materialId, delFlag: '0' },
    });
    if (!material) {
      return ResultData.fail(500, '物资不存在');
    }

    const beforeStock = material.stock;
    if (beforeStock < stockOutDto.quantity) {
      return ResultData.fail(500, '库存不足，当前库存：' + beforeStock);
    }

    const afterStock = beforeStock - stockOutDto.quantity;

    // 更新库存
    await this.materialRepository.update(stockOutDto.materialId, {
      stock: afterStock,
    });

    // 生成记录编号
    const recordNo = this.generateRecordNo('CK');

    // 创建出库记录
    const record = this.stockRecordRepository.create({
      recordNo,
      materialId: material.materialId,
      materialCode: material.code,
      materialName: material.name,
      type: 'out',
      quantity: stockOutDto.quantity,
      beforeStock,
      afterStock,
      receiver: stockOutDto.receiver,
      department: stockOutDto.department || '',
      operator: stockOutDto.createBy || '',
      remark: stockOutDto.remark || '',
    });
    await this.stockRecordRepository.save(record);

    return ResultData.ok({ recordNo });
  }

  // 获取最近出入库记录
  async getRecentRecords(limit: number = 10) {
    const list = await this.stockRecordRepository.find({
      order: { operateTime: 'DESC' },
      take: limit,
    });
    return ResultData.ok(list);
  }

  // 生成记录编号
  private generateRecordNo(prefix: string): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${prefix}${year}${month}${day}${random}`;
  }
}
