import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field()
  id?: string;
  @Field()
  name?: string;
  @Field()
  desc?: string;
  @Field({ description: '账户信息' })
  account?: string;
  @Field({ description: '手机号' })
  tel?: string;
  @Field()
  code?: string;
}
