import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import dayjs from 'dayjs';
import { Result } from '@/dto/result.type';
import {
  ACCOUNT_NOT_EXIST,
  CODE_EXPIRE,
  CODE_NOT_EXIST,
  LOGIN_ERROR,
  SUCCESS,
} from '@/common/constants/code';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Result, { description: '发送验证码' })
  async sendCodeMsg(@Args('tel') tel: string): Promise<Result> {
    return await this.authService.sendCodeMsg(tel);
  }

  @Mutation(() => Result, { description: '登录' })
  async login(
    @Args('tel') tel: string,
    @Args('code') code: string,
  ): Promise<Result> {
    // 首先要找到手机号码存在
    // 手机号存在时，验证码存在并且验证码要在1个小时之内，否则需要重新输入验证码
    const user = await this.userService.findByTel(tel);
    if (!user) {
      return {
        code: ACCOUNT_NOT_EXIST,
        message: '账户不存在',
      };
    }
    if (!user.codeCreateTimeAt || !user.code) {
      return {
        code: CODE_NOT_EXIST,
        message: '验证码不存在',
      };
    }
    if (
      dayjs().diff(dayjs(user.codeCreateTimeAt)) > 60 * 60 * 1000 &&
      user.code === code
    ) {
      return {
        code: CODE_EXPIRE,
        message: '验证码过期',
      };
    }
    if (user.code === code) {
      return {
        code: SUCCESS,
        message: '登录成功',
      };
    }
    return {
      code: LOGIN_ERROR,
      message: '登录失败，手机号或验证码不对',
    };
  }
}
