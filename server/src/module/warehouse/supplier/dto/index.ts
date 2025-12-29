import { IsString, IsNumber, IsOptional, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PagingDto } from 'src/common/dto';

export class QuerySupplierDto extends PagingDto {
  @ApiProperty({ required: false, description: '供应商名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: '联系人' })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class CreateSupplierDto {
  @ApiProperty({ description: '供应商编码' })
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty({ description: '供应商名称' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: '联系人' })
  @IsString()
  @Length(1, 50)
  contact: string;

  @ApiProperty({ description: '联系电话' })
  @IsString()
  @Length(1, 20)
  phone: string;

  @ApiProperty({ required: false, description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, description: '地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, description: '状态' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false, description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpdateSupplierDto extends CreateSupplierDto {
  @ApiProperty({ description: '供应商ID' })
  @IsNumber()
  supplierId: number;
}
