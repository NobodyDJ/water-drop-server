import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProductInput {
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
    description: '库存总数',
  })
  stock: number;

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
}
