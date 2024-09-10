import { Injectable } from '@nestjs/common';
import * as $Util from '@alicloud/tea-util';
import * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import { getRandomCode } from '@/shared/utills';
import { UserService } from '../user/user.service';
import { SIGN_NAME, TEMPLATE_CODE } from '@/common/constants/aliyun';
// 形成了单例client
import { client } from '@/shared/utills/msg';
import dayjs from 'dayjs';
import {
  SUCCESS,
  CODE_NOT_EXPIRE,
  UPDATE_ERROR,
  CODE_SEND_ERROR,
} from '@/common/constants/code';
import { Result } from '@/dto/result.type';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // 发送短信验证码
  async sendCodeMsg(tel: string): Promise<Result> {
    // 对验证码的时间是否过期进行校验
    const user = await this.userService.findByTel(tel);
    if (user) {
      const diffTime = dayjs().diff(dayjs(user.codeCreateTimeAt));
      if (diffTime < 60 * 60 * 1000) {
        return {
          code: CODE_NOT_EXPIRE,
          message: 'code 尚未过期',
        };
      }
    }
    const code = getRandomCode();
    // client变量只需要创建一次即可
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      signName: SIGN_NAME,
      templateCode: TEMPLATE_CODE,
      phoneNumbers: tel,
      templateParam: `{"code":${code}}`,
    });
    const runtime = new $Util.RuntimeOptions({});
    try {
      // 复制代码运行请自行打印 API 的返回值
      await client.sendSmsWithOptions(sendSmsRequest, runtime);
      const user = await this.userService.findByTel(tel);
      if (user) {
        const result = await this.userService.updateCode(
          user.id,
          code,
          new Date(),
        );
        if (result) {
          return {
            code: SUCCESS,
            message: '获取验证码成功',
          };
        }
        return {
          code: UPDATE_ERROR,
          message: '更新 code 失败',
        };
      }
      await this.userService.create({
        tel,
        code,
        codeCreateTimeAt: new Date(),
      });
      return {
        code: SUCCESS,
        message: '用户创建并获取验证码成功',
      };
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      return {
        code: CODE_SEND_ERROR,
        message: '发送验证码失败，请稍后再试',
      };
      // 诊断地址
      // console.log(error.data['Recommend']);
    }
  }
}
