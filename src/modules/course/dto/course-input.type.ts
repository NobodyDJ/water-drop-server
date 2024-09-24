import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CourseInput {
  @Field({
    description: '用户名',
  })
  name: string;

  @Field({
    description: '手机号',
  })
  tel: string;

  @Field({
    description: '头像',
  })
  avatar: string;
}
