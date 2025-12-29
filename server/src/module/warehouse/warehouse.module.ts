import { Module, Global } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { SupplierModule } from './supplier/supplier.module';
import { MaterialModule } from './material/material.module';
import { StockModule } from './stock/stock.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Global()
@Module({
  imports: [
    CategoryModule,
    SupplierModule,
    MaterialModule,
    StockModule,
    DashboardModule,
  ],
})
export class WarehouseModule {}
