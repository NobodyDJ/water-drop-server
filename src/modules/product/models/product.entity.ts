import { ProductStatus } from '@/common/constants/enmu';
import { CommonEntity } from '@/common/entities/common.entity';
import { Card } from '@/modules/card/module-template/models/card.entity';
import { Organization } from '@/modules/organization/models/org.entity';
import { IsNotEmpty, Min } from 'class-validator';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

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
    comment: '分类',
    nullable: true,
  })
  type: string;

  @Column({
    comment: '商品状态：上架，下架',
    default: ProductStatus.UN_LIST,
  })
  @IsNotEmpty()
  status: string;

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

  // 商品和门店是多对一的关系
  @ManyToOne(() => Organization, (org) => org.products, {
    cascade: true,
  })
  org: Organization;

  // 商品和消费卡是多对多的关系，需要创建一个中间关联表
  @ManyToMany(() => Card, { cascade: true })
  @JoinTable({
    name: 'product_card',
  })
  cards: Card[];
}
