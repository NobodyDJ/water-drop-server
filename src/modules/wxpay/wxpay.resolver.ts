import { StudentService } from './../student/student.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WxConfigResult } from './dto/result-wxpay.output';
import {
  NOT_OPENID,
  PRODUCT_NOT_EXIST,
  SUCCESS,
} from '@/common/constants/code';
import WxPay from 'wechatpay-node-v3';
import { WECHAT_PAY_MANAGER } from 'nest-wechatpay-node-v3';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from '../product/product.service';
import { WxConfig } from './dto/wxConfig.type';

@Resolver()
@UseGuards(GqlAuthGuard)
export class WxpayResolver {
  constructor(
    private readonly studentService: StudentService,
    private readonly productService: ProductService, // @Inject(WECHAT_PAY_MANAGER) private wxPay: WxPay,
  ) {}

  // appId: 'wx2421b1c4370ec43b', // 公众号ID，由商户传入
  // timeStamp: '1395712654', // 时间戳，自1970年以来的秒数
  // nonceStr: 'e61463f8efa94090b1f366cccfbbb444', // 随机串
  // package: 'prepay_id=up_wx21201855730335ac86f8c43d1889123400',
  // signType: 'RSA', // 微信签名方式：
  // paySign: 'oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ\/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq\/xDg==', // 微信签名
  @Mutation(() => WxConfigResult)
  async getWxpayConfig(
    @CurUserId() userId,
    @Args('productId') productId: string,
    @Args('amount') amount: number, // 以分为单位
  ): Promise<WxConfigResult> {
    const student = await this.studentService.findById(userId);
    const product = await this.productService.findById(productId);

    if (!product) {
      return {
        code: PRODUCT_NOT_EXIST,
        message: '没有找到对应的商品',
      };
    }

    if (!student || !student.openid) {
      return {
        code: NOT_OPENID,
        message: '没有找到 OPENID',
      };
    }
    const params = {
      description: product.name,
      out_trade_no: uuidv4().replace(/-/g, ''),
      notify_url: '回调url',
      amount: {
        total: amount,
      },
      payer: {
        openid: student.openid,
      },
    };
    // const result = await this.wxPay.transactions_jsapi(params);
    const result = {
      appId: 'wx2421b1c4370ec43b', // 公众号ID，由商户传入
      timeStamp: '1395712654', // 时间戳，自1970年以来的秒数
      nonceStr: 'e61463f8efa94090b1f366cccfbbb444', // 随机串
      package: 'prepay_id=up_wx21201855730335ac86f8c43d1889123400',
      signType: 'RSA', // 微信签名方式：
      paySign:
        'oR9d8PuhnIc+YZ8cBHFCwfgpaK9gd7vaRvkYD7rthRAZ/X+QBhcCYL21N7cHCTUxbQ+EAt6Uy+lwSN22f5YZvI45MLko8Pfso0jm46v5hqcVwrk6uddkGuT+Cdvu4WBqDzaDjnNa5UK3GfE1Wfl2gHxIIY5lLdUgWFts17D4WuolLLkiFZV+JSHMvH7eaLdT9N5GBovBwu5yYKUR7skR8Fu+LozcSqQixnlEZUfyE55feLOQTUYzLmR9pNtPbPsu6WVhbNHMS3Ss2+AehHvz+n64GDmXxbX++IOBvm2olHu3PsOUGRwhudhVf7UcGcunXt8cqNjKNqZLhLw4jq/xDg==', // 微信签名
    };
    return {
      code: SUCCESS,
      data: result as WxConfig,
      message: '获取微信支付配置信息成功',
    };
  }
}
