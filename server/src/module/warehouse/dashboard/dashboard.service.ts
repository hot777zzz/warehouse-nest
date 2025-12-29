import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialEntity } from '../material/entities/material.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { StockRecordEntity } from '../stock/entities/stock-record.entity';
import { ResultData } from 'src/common/utils/result';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(StockRecordEntity)
    private readonly stockRecordRepository: Repository<StockRecordEntity>,
  ) {}

  // 获取统计数据
  async getStatistics() {
    // 物资种类数
    const totalMaterial = await this.materialRepository.count({
      where: { delFlag: '0', status: '0' },
    });

    // 库存总量
    const stockResult = await this.materialRepository
      .createQueryBuilder('m')
      .select('SUM(m.stock)', 'total')
      .where('m.del_flag = :delFlag', { delFlag: '0' })
      .andWhere('m.status = :status', { status: '0' })
      .getRawOne();
    const totalStock = stockResult?.total || 0;

    // 预警物资数
    const warningCount = await this.materialRepository
      .createQueryBuilder('m')
      .where('m.del_flag = :delFlag', { delFlag: '0' })
      .andWhere('m.status = :status', { status: '0' })
      .andWhere('m.stock <= m.safe_stock')
      .getCount();

    // 今日出入库数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayInOut = await this.stockRecordRepository
      .createQueryBuilder('r')
      .where('r.operate_time >= :today', { today })
      .andWhere('r.operate_time < :tomorrow', { tomorrow })
      .getCount();

    return ResultData.ok({
      totalMaterial,
      totalStock: Number(totalStock),
      warningCount,
      todayInOut,
    });
  }

  // 获取库存趋势数据
  async getStockTrend(type: string = 'week') {
    const days = type === 'week' ? 7 : 30;
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // 入库数量
      const inResult = await this.stockRecordRepository
        .createQueryBuilder('r')
        .select('SUM(r.quantity)', 'total')
        .where('r.type = :type', { type: 'in' })
        .andWhere('r.operate_time >= :date', { date })
        .andWhere('r.operate_time < :nextDate', { nextDate })
        .getRawOne();

      // 出库数量
      const outResult = await this.stockRecordRepository
        .createQueryBuilder('r')
        .select('SUM(r.quantity)', 'total')
        .where('r.type = :type', { type: 'out' })
        .andWhere('r.operate_time >= :date', { date })
        .andWhere('r.operate_time < :nextDate', { nextDate })
        .getRawOne();

      result.push({
        date: date.toISOString().split('T')[0],
        inQuantity: Number(inResult?.total || 0),
        outQuantity: Number(outResult?.total || 0),
      });
    }

    return ResultData.ok(result);
  }

  // 获取物资分类占比
  async getCategoryRatio() {
    const result = await this.materialRepository
      .createQueryBuilder('m')
      .select('m.category_name', 'name')
      .addSelect('SUM(m.stock)', 'value')
      .where('m.del_flag = :delFlag', { delFlag: '0' })
      .andWhere('m.status = :status', { status: '0' })
      .groupBy('m.category_id')
      .getRawMany();

    return ResultData.ok(
      result.map((item) => ({
        name: item.name || '未分类',
        value: Number(item.value || 0),
      })),
    );
  }

  // 获取预警数据
  async getWarningData() {
    const list = await this.materialRepository
      .createQueryBuilder('m')
      .select([
        'm.material_id as materialId',
        'm.name as materialName',
        'm.stock as currentStock',
        'm.safe_stock as safeStock',
        '(m.safe_stock - m.stock) as shortage',
      ])
      .where('m.del_flag = :delFlag', { delFlag: '0' })
      .andWhere('m.status = :status', { status: '0' })
      .andWhere('m.stock <= m.safe_stock')
      .orderBy('shortage', 'DESC')
      .limit(10)
      .getRawMany();

    return ResultData.ok(list);
  }

  // 获取最近出入库记录
  async getRecentRecords(limit: number = 10) {
    const list = await this.stockRecordRepository.find({
      select: ['recordId', 'materialName', 'type', 'quantity', 'operateTime'],
      order: { operateTime: 'DESC' },
      take: limit,
    });
    return ResultData.ok(list);
  }
}
