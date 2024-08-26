import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import dayjs from 'dayjs';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Boolean, { description: '发送验证码' })
  async sendCodeMsg(@Args('tel') tel: string): Promise<boolean> {
    return await this.authService.sendCodeMsg(tel);
  }

  @Mutation(() => Boolean, { description: '登录' })
  async login(
    @Args('tel') tel: string,
    @Args('code') code: string,
  ): Promise<boolean> {
    // 首先要找到手机号码存在
    // 手机号存在时，验证码存在并且验证码要在1个小时之内，否则需要重新输入验证码
    const user = await this.userService.findByTel(tel);
    if (!user) {
      return false;
    }
    if (!user.codeCreateTimeAt || !user.code) {
      return false;
    }
    if (dayjs().diff(dayjs(user.codeCreateTimeAt)) > 60 * 60 * 1000) {
      return false;
    }
    if (user.code === code) {
      return true;
    }
    return false;
  }
}
