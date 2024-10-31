import { CommonType } from '@/common/dto/common.type';
import { CardType } from '@/modules/card/dto/card.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * 商品
 */
@ObjectType()
export class ProductType extends CommonType {
  @Field({
    description: '名称',
  })
  name: string;

  @Field({
    description: '描述',
    nullable: true,
  })
  desc: string;

  @Field({
    description: '状态',
    nullable: true,
  })
  status: string;

  @Field({
    description: '距离',
    nullable: true,
  })
  distance?: string;

  @Field({
    description: '分类',
    nullable: true,
  })
  type: string;

  @Field({
    description: '库存总数',
  })
  stock: number;

  @Field({
    description: '当前库存',
  })
  curStock: number;

  @Field({
    description: '购买数量',
  })
  buyNumber: number;

  @Field({
    description: '每人限购数量',
  })
  limitBuyNumber: number;

  @Field({
    description: '封面图',
  })
  coverUrl: string;

  @Field({
    description: '头部banner图',
  })
  bannerUrl: string;

  @Field({
    description: '原价',
  })
  originalPrice: number;

  @Field({
    description: '优惠价',
  })
  preferentialPrice: number;

  @Field(() => OrganizationType, {
    description: '门店信息',
  })
  org: OrganizationType;

  @Field(() => [CardType], {
    description: '消费卡',
    nullable: true,
  })
  cards: CardType[];
}
