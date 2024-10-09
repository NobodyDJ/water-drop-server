import { CommonEntity } from '@/common/entities/common.entity';
import { Organization } from '@/modules/organization/models/org.entity';
import { IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';

/**
 * 商品
 */
@Entity('product')
export class Product extends CommonEntity {
  @Column({
    comment: '名称',
  })
  @IsNotEmpty()
  name: string;

  @Column({
    comment: '描述',
    nullable: true,
  })
  desc: string;

  @Column({
    comment: '库存总数',
    default: 0,
  })
  stock: number;

  @Column({
    comment: '当前库存',
    default: 0,
  })
  curStock: number;

  @Column({
    comment: '购买数量',
    default: 0,
  })
  buyNumber: number;

  @Column({
    comment: '每人限购数量',
    default: -1,
  })
  limitBuyNumber: number;

  @Column({
    comment: '封面图',
  })
  coverUrl: string;

  @Column({
    comment: '头部banner图',
  })
  bannerUrl: string;

  @Column({
    type: 'float',
    comment: '原价',
  })
  @IsNotEmpty()
  @Min(0.01)
  originalPrice: number;

  @Column({
    type: 'float',
    comment: '优惠价',
  })
  @IsNotEmpty()
  @Min(0.01)
  preferentialPrice: number;

  @ManyToOne(() => Organization, (org) => org.products, {
    cascade: true,
  })
  org: Organization;
}
