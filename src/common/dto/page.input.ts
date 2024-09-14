import { Field, InputType } from '@nestjs/graphql';
import { isInt, Min } from 'class-validator';

@InputType()
export class PageInput {
  @Field()
  @isInt()
  @Min(0)
  start: number;

  @Field()
  @isInt()
  @Min(0)
  length: number;
}
