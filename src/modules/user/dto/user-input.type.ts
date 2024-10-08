import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field({ description: '昵称' })
  name?: string;
  @Field({ description: '描述' })
  desc?: string;
  @Field({ description: '头像' })
  avatar?: string;
}
