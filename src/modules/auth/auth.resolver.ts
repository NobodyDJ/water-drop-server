import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import dayjs from 'dayjs';
import { Result } from '@/dto/result.type';
import {
  ACCOUNT_EXIST,
  ACCOUNT_NOT_EXIST,
  CODE_EXPIRE,
  CODE_NOT_EXIST,
  LOGIN_ERROR,
  REGISTER_ERROR,
  SUCCESS,
} from '@/common/constants/code';
import { accountAndPwdValidate } from '@/shared/utills';
import { StudentService } from '../student/student.service';
import md5 from 'md5';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly studentService: StudentService,
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

  // 学员注册
  @Mutation(() => Result, { description: '学员注册' })
  async studentRegister(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    const result = accountAndPwdValidate(account, password);
    if (result.code !== SUCCESS) {
      return result;
    }
    const student = await this.studentService.findByAccount(account);
    if (student) {
      return {
        code: ACCOUNT_EXIST,
        message: '账号已经存在，请使用其他账号',
      };
    }
    const res = await this.studentService.create({
      account,
      password: md5(password),
    });
    if (res) {
      return {
        code: SUCCESS,
        message: '注册成功',
      };
    }
    return {
      code: REGISTER_ERROR,
      message: '注册失败',
    };
  }

  // 学员登录
  @Mutation(() => Result, { description: '学员登录' })
  async studentLogin(
    @Args('account') account: string,
    @Args('password') password: string,
  ): Promise<Result> {
    const result = accountAndPwdValidate(account, password);
    if (result.code !== SUCCESS) {
      return result;
    }
    const student = await this.studentService.findByAccount(account);
    if (!student) {
      return {
        code: ACCOUNT_NOT_EXIST,
        message: '账号不存在',
      };
    }
    // 需要对密码进行 md5 加密
    if (student.password === md5(password)) {
      return {
        code: SUCCESS,
        message: '登录成功',
      };
    }
    return {
      code: LOGIN_ERROR,
      message: '登录失败，账号或者密码不对',
    };
  }
}
