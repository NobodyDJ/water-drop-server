import { Field, Int } from '@nestjs/graphql';

export class Page {
  @Field(() => Int)
  total: number;
  @Field(() => Int)
  start?: number;
  @Field(() => Int)
  length?: number;
}
