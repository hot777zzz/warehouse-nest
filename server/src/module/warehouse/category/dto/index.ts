import { IsString, IsNumber, IsOptional, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto';

export class QueryCategoryDto {
  @ApiProperty({ required: false, description: '分类名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateCategoryDto {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: '分类编码' })
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty({ required: false, description: '父分类ID' })
  @IsOptional()
  @IsNumber()
  parentId?: number;

  @ApiProperty({ required: false, description: '显示顺序' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  orderNum?: number;

  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {
  @ApiProperty({ description: '分类ID' })
  @IsNumber()
  categoryId: number;
}
