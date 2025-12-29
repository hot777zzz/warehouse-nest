import { Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base';

@Entity('wh_category', { comment: '物资分类表' })
@Tree('closure-table')
export class CategoryEntity extends BaseEntity {
  @ApiProperty({ type: Number, description: '分类ID' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'category_id', comment: '分类ID' })
  public categoryId: number;

  @ApiProperty({ type: String, description: '分类名称' })
  @Column({ type: 'varchar', name: 'name', length: 100, comment: '分类名称' })
  public name: string;

  @ApiProperty({ type: String, description: '分类编码' })
  @Column({ type: 'varchar', name: 'code', length: 50, comment: '分类编码' })
  public code: string;

  @ApiProperty({ type: Number, description: '父分类ID' })
  @Column({ type: 'int', name: 'parent_id', default: 0, comment: '父分类ID' })
  public parentId: number;

  @ApiProperty({ type: Number, description: '显示顺序' })
  @Column({ type: 'int', name: 'order_num', default: 0, comment: '显示顺序' })
  public orderNum: number;

  @TreeChildren()
  children: CategoryEntity[];

  @TreeParent()
  parent: CategoryEntity;
}
