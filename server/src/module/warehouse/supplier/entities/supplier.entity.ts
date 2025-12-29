import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base';

@Entity('wh_supplier', { comment: '供应商表' })
export class SupplierEntity extends BaseEntity {
  @ApiProperty({ type: Number, description: '供应商ID' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'supplier_id', comment: '供应商ID' })
  public supplierId: number;

  @ApiProperty({ type: String, description: '供应商编码' })
  @Column({ type: 'varchar', name: 'code', length: 50, comment: '供应商编码' })
  public code: string;

  @ApiProperty({ type: String, description: '供应商名称' })
  @Column({ type: 'varchar', name: 'name', length: 100, comment: '供应商名称' })
  public name: string;

  @ApiProperty({ type: String, description: '联系人' })
  @Column({ type: 'varchar', name: 'contact', length: 50, default: '', comment: '联系人' })
  public contact: string;

  @ApiProperty({ type: String, description: '联系电话' })
  @Column({ type: 'varchar', name: 'phone', length: 20, default: '', comment: '联系电话' })
  public phone: string;

  @ApiProperty({ type: String, description: '邮箱' })
  @Column({ type: 'varchar', name: 'email', length: 100, default: '', comment: '邮箱' })
  public email: string;

  @ApiProperty({ type: String, description: '地址' })
  @Column({ type: 'varchar', name: 'address', length: 255, default: '', comment: '地址' })
  public address: string;
}
