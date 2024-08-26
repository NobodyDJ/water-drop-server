import { Injectable } from '@nestjs/common';
import * as $Util from '@alicloud/tea-util';
import * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import { getRandomCode } from 'src/shared/utills';
import { UserService } from '../user/user.service';
import { SIGN_NAME, TEMPLATE_CODE } from 'src/common/constants/aliyun';
// 形成了单例client
import { client } from 'src/shared/utills/msg';
import dayjs from 'dayjs';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // 发送短信验证码
  async sendCodeMsg(tel: string): Promise<boolean> {
    // 对验证码的时间是否过期进行校验
    const user = await this.userService.findByTel(tel);
    if (user) {
      const diffTime = dayjs().diff(dayjs(user.codeCreateTimeAt));
      if (diffTime < 60 * 1000) {
        return false;
      }
    }
    const code = getRandomCode();
    // client变量只需要创建一次即可
    console.log('tel', tel);
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
      console.log('user found', user);
      if (user) {
        const result = await this.userService.updateCode(user.id, code);
        console.log('result', result);
        if (result) {
          return true;
        }
        return false;
      }
      console.log('new Date()', new Date());
      await this.userService.create({
        tel,
        code,
        codeCreateTimeAt: new Date(),
      });
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data['Recommend']);
    }
  }
}
