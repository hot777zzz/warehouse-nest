import { IsString, IsNumber, IsOptional, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto';

export class QueryMaterialDto extends PagingDto {
  @ApiProperty({ required: false, description: '物资名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: '物资编码' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ required: false, description: '分类ID' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateMaterialDto {
  @ApiProperty({ description: '物资编码' })
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty({ description: '物资名称' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: '分类ID' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ required: false, description: '分类名称' })
  @IsOptional()
  @IsString()
  categoryName?: string;

  @ApiProperty({ required: false, description: '规格型号' })
  @IsOptional()
  @IsString()
  specification?: string;

  @ApiProperty({ description: '单位' })
  @IsString()
  @Length(1, 20)
  unit: string;

  @ApiProperty({ required: false, description: '安全库存' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  safeStock?: number;

  @ApiProperty({ required: false, description: '供应商ID' })
  @IsOptional()
  @IsNumber()
  supplierId?: number;

  @ApiProperty({ required: false, description: '供应商名称' })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiProperty({ required: false, description: '单价' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateMaterialDto extends CreateMaterialDto {
  @ApiProperty({ description: '物资ID' })
  @IsNumber()
  materialId: number;
}
