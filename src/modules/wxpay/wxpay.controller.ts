import { Controller, Get, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { StudentService } from '../student/student.service';

@Controller('wx')
export class WxpayController {
  constructor(private readonly studentService: StudentService) {}
  // wx/login
  @Get('login')
  async wxLogin(
    @Query('userId') userId: string,
    @Query('url') url: string,
    @Res() res,
  ): Promise<void> {
    // 跳转到微信登录平台获取openId
    res.redirect(
      `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WXPAY_APPID}&redirect_uri=${process.env.WXPAY_URL}/wx/wxCode&response_type=code&scope=snsapi_base&state=state=${userId}@${encodeURIComponent(url)}#wechat_redirect`,
    );
  }
  // 如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
  // /wx/wxCode
  // 得到 code 然后用 code 直接去获取 openid
  @Get('wxCode')
  async wxCode(
    @Res() res,
    @Query('code') code: string,
    @Query('state') state: string,
  ) {
    const [userId, url] = state.split('@');
    const response = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WXPAY_APPID}
      &secret=${process.env.WXPAY_APPSECRET}&code=${code}&grant_type=authorization_code`,
    );
    const { openid } = response.data;
    await this.studentService.updateById(userId, {
      openid,
    });
    res.redirect(decodeURIComponent(url));
  }
}
