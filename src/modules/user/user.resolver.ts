import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserInput } from './dto/user-input.type';
import { UserType } from './dto/user.type';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Result } from '@/common/dto/result.type';
import { SUCCESS, UPDATE_ERROR } from '@/common/constants/code';

@Resolver()
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean, { description: '新增用户' })
  async create(@Args('params') params: UserInput): Promise<boolean> {
    return await this.userService.create(params);
  }

  @Query(() => UserType, { description: '根据 ID 查询用户信息' })
  async find(@Args('id') id: string): Promise<UserType> {
    return await this.userService.find(id);
  }

  @Query(() => UserType, { description: '根据 ID 查询用户信息' })
  // 此处的ctx包含了发送请求的请求信息和响应信息
  async getUserInfo(@Context() ctx: any): Promise<UserType> {
    const id = ctx.req.user.id;
    return await this.userService.find(id);
  }

  @Mutation(() => Result, { description: '更新用户' })
  async updateUserInfo(
    @Args('id') id: string,
    @Args('params') params: UserInput,
  ): Promise<Result> {
    const res = await this.userService.update(id, params);
    if (res) {
      return {
        code: SUCCESS,
        message: '更新成功',
      };
    }
    return {
      code: UPDATE_ERROR,
      message: '更新成功',
    };
  }

  @Mutation(() => Boolean, { description: '删除一个用户' })
  async del(@Args('id') id: string): Promise<boolean> {
    return await this.userService.del(id);
  }
}
