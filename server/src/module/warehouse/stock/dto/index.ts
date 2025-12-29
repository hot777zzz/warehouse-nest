import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto';

export class QueryStockRecordDto extends PagingDto {
  @ApiProperty({ required: false, description: '物资名称' })
  @IsOptional()
  @IsString()
  materialName?: string;

  @ApiProperty({ required: false, description: '操作类型：in入库 out出库' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false, description: '开始时间' })
  @IsOptional()
  @IsString()
  beginTime?: string;

  @ApiProperty({ required: false, description: '结束时间' })
  @IsOptional()
  @IsString()
  endTime?: string;
}

export class StockInDto {
  @ApiProperty({ description: '物资ID' })
  @IsNumber()
  materialId: number;

  @ApiProperty({ description: '入库数量' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false, description: '供应商ID' })
  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @ApiProperty({ required: false, description: '供应商名称' })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class StockOutDto {
  @ApiProperty({ description: '物资ID' })
  @IsNumber()
  materialId: number;

  @ApiProperty({ description: '出库数量' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '领用人' })
  @IsString()
  receiver: string;

  @ApiProperty({ required: false, description: '领用部门' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}
