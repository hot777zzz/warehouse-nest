import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MaterialEntity } from '../material/entities/material.entity';
import { CategoryEntity } from '../category/entities/category.entity';
import { StockRecordEntity } from '../stock/entities/stock-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialEntity, CategoryEntity, StockRecordEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
