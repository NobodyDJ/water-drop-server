import { Field, ObjectType } from '@nestjs/graphql';

/**
 * 学员
 */
@ObjectType()
export class StudentType {
  @Field({
    description: 'id',
  })
  id: string;

  @Field({
    description: '用户名',
  })
  name: string;

  @Field({
    description: '账户信息',
  })
  account: string;

  @Field({
    description: '手机号',
    nullable: true,
  })
  tel: string;

  @Field({
    description: '头像',
    nullable: true,
  })
  avatar: string;
}
