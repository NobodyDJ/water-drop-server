import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Page } from './page.type';
import { ClassType } from 'type-graphql';

// 接口数据结构规范
interface IResult<T> {
  code: number;
  message?: string;
  data?: T;
}

interface IResults<T> {
  code: number;
  message?: string;
  data?: T[];
  page?: Page;
}
// 生成器，生成一个实例
export function createResult<T extends object>(
  ItemType: ClassType<T>,
): ClassType<IResult<T>> {
  @ObjectType()
  class Result {
    @Field(() => Int)
    code: number;
    @Field(() => String)
    message?: string;
    @Field(() => ItemType, { nullable: true })
    data?: T;
  }
  return Result;
}

// 生成器，生成一个实例
export function createResults<T extends object>(
  ItemType: ClassType<T>,
): ClassType<IResults<T>> {
  @ObjectType()
  class Results {
    @Field(() => Int)
    code: number;
    @Field(() => String)
    message?: string;
    @Field(() => ItemType, { nullable: true })
    data?: T[];
    @Field(() => Page, { nullable: true })
    page?: Page;
  }
  return Results;
}

// 一个短信示例
@ObjectType()
export class Result {
  @Field(() => Int)
  code: number;
  @Field(() => String)
  message: string;
}
