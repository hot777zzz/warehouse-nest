import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { dateTransformer } from 'src/common/utils/index';

@Entity('wh_stock_record', { comment: '出入库记录表' })
export class StockRecordEntity {
  @ApiProperty({ type: Number, description: '记录ID' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'record_id', comment: '记录ID' })
  public recordId: number;

  @ApiProperty({ type: String, description: '记录编号' })
  @Column({ type: 'varchar', name: 'record_no', length: 50, comment: '记录编号' })
  public recordNo: string;

  @ApiProperty({ type: Number, description: '物资ID' })
  @Column({ type: 'int', name: 'material_id', comment: '物资ID' })
  public materialId: number;

  @ApiProperty({ type: String, description: '物资编码' })
  @Column({ type: 'varchar', name: 'material_code', length: 50, comment: '物资编码' })
  public materialCode: string;

  @ApiProperty({ type: String, description: '物资名称' })
  @Column({ type: 'varchar', name: 'material_name', length: 100, comment: '物资名称' })
  public materialName: string;

  @ApiProperty({ type: String, description: '操作类型：in入库 out出库' })
  @Column({ type: 'varchar', name: 'type', length: 10, comment: '操作类型：in入库 out出库' })
  public type: string;

  @ApiProperty({ type: Number, description: '数量' })
  @Column({ type: 'int', name: 'quantity', comment: '数量' })
  public quantity: number;

  @ApiProperty({ type: Number, description: '操作前库存' })
  @Column({ type: 'int', name: 'before_stock', comment: '操作前库存' })
  public beforeStock: number;

  @ApiProperty({ type: Number, description: '操作后库存' })
  @Column({ type: 'int', name: 'after_stock', comment: '操作后库存' })
  public afterStock: number;

  @ApiProperty({ type: Number, description: '供应商ID' })
  @Column({ type: 'int', name: 'supplier_id', nullable: true, comment: '供应商ID' })
  public supplierId: number;

  @ApiProperty({ type: String, description: '供应商名称' })
  @Column({ type: 'varchar', name: 'supplier_name', length: 100, default: '', comment: '供应商名称' })
  public supplierName: string;

  @ApiProperty({ type: String, description: '领用人' })
  @Column({ type: 'varchar', name: 'receiver', length: 50, default: '', comment: '领用人' })
  public receiver: string;

  @ApiProperty({ type: String, description: '领用部门' })
  @Column({ type: 'varchar', name: 'department', length: 100, default: '', comment: '领用部门' })
  public department: string;

  @ApiProperty({ type: String, description: '操作人' })
  @Column({ type: 'varchar', name: 'operator', length: 50, comment: '操作人' })
  public operator: string;

  @ApiProperty({ type: Date, description: '操作时间' })
  @CreateDateColumn({ type: 'datetime', name: 'operate_time', transformer: dateTransformer, comment: '操作时间' })
  public operateTime: Date;

  @ApiProperty({ type: String, description: '备注' })
  @Column({ type: 'varchar', name: 'remark', length: 500, default: '', comment: '备注' })
  public remark: string;
}
