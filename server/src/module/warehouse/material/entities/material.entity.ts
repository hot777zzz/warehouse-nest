import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base';

@Entity('wh_material', { comment: '物资表' })
export class MaterialEntity extends BaseEntity {
  @ApiProperty({ type: Number, description: '物资ID' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'material_id', comment: '物资ID' })
  public materialId: number;

  @ApiProperty({ type: String, description: '物资编码' })
  @Column({ type: 'varchar', name: 'code', length: 50, unique: true, comment: '物资编码' })
  public code: string;

  @ApiProperty({ type: String, description: '物资名称' })
  @Column({ type: 'varchar', name: 'name', length: 100, comment: '物资名称' })
  public name: string;

  @ApiProperty({ type: Number, description: '分类ID' })
  @Column({ type: 'int', name: 'category_id', comment: '分类ID' })
  public categoryId: number;

  @ApiProperty({ type: String, description: '分类名称' })
  @Column({ type: 'varchar', name: 'category_name', length: 100, default: '', comment: '分类名称' })
  public categoryName: string;

  @ApiProperty({ type: String, description: '规格型号' })
  @Column({ type: 'varchar', name: 'specification', length: 200, default: '', comment: '规格型号' })
  public specification: string;

  @ApiProperty({ type: String, description: '单位' })
  @Column({ type: 'varchar', name: 'unit', length: 20, comment: '单位' })
  public unit: string;

  @ApiProperty({ type: Number, description: '当前库存' })
  @Column({ type: 'int', name: 'stock', default: 0, comment: '当前库存' })
  public stock: number;

  @ApiProperty({ type: Number, description: '安全库存' })
  @Column({ type: 'int', name: 'safe_stock', default: 0, comment: '安全库存' })
  public safeStock: number;

  @ApiProperty({ type: Number, description: '供应商ID' })
  @Column({ type: 'int', name: 'supplier_id', nullable: true, comment: '供应商ID' })
  public supplierId: number;

  @ApiProperty({ type: String, description: '供应商名称' })
  @Column({ type: 'varchar', name: 'supplier_name', length: 100, default: '', comment: '供应商名称' })
  public supplierName: string;

  @ApiProperty({ type: Number, description: '单价' })
  @Column({ type: 'decimal', name: 'price', precision: 10, scale: 2, default: 0, comment: '单价' })
  public price: number;
}
