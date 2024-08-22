import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // 发送短信验证码
  async sendCodeMsg(tel: string): Promise<string> {
    console.log(tel);
    return '';
  }
}
