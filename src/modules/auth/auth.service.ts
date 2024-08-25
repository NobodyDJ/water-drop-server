import { Injectable } from '@nestjs/common';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';
import { getRandomCode } from 'src/shared/utills';
import {
  ACCESS_KEY_ID,
  ACCESS_KEY_SECRET,
  SIGN_NAME,
  TEMPLATE_CODE,
} from 'src/common/constants/aliyun';
@Injectable()
export class AuthService {
  // 发送短信验证码
  async sendCodeMsg(tel: string): Promise<string> {
    const code = getRandomCode();
    const config = new $OpenApi.Config({
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_ID。
      accessKeyId: ACCESS_KEY_ID,
      // 必填，请确保代码运行环境设置了环境变量 ALIBABA_CLOUD_ACCESS_KEY_SECRET。
      accessKeySecret: ACCESS_KEY_SECRET,
    });
    // Endpoint 请参考 https://api.aliyun.com/product/Dysmsapi
    config.endpoint = `dysmsapi.aliyuncs.com`;
    const client = new Dysmsapi20170525(config);
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      signName: SIGN_NAME,
      templateCode: TEMPLATE_CODE,
      phoneNumbers: tel,
      templateParam: `{"code":${code}}`,
    });
    const runtime = new $Util.RuntimeOptions({});
    try {
      // 复制代码运行请自行打印 API 的返回值
      const res = await client.sendSmsWithOptions(sendSmsRequest, runtime);
      console.log('res', res);
    } catch (error) {
      // 此处仅做打印展示，请谨慎对待异常处理，在工程项目中切勿直接忽略异常。
      // 错误 message
      console.log(error.message);
      // 诊断地址
      console.log(error.data['Recommend']);
    }
    return code;
  }
}
