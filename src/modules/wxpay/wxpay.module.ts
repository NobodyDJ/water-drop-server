import { Module } from '@nestjs/common';
import { WxpayController } from './wxpay.controller';
import { StudentModule } from '../student/student.module';
import { WxpayResolver } from './wxpay.resolver';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { WxorderModule } from '../wxorder/wxorder.module';
import * as fs from 'fs';
import { WeChatPayModule } from 'nest-wechatpay-node-v3';
import { CardRecordModule } from '../cardRecord/card-record.module';

@Module({
  controllers: [WxpayController],
  providers: [WxpayResolver],
  imports: [
    StudentModule,
    ProductModule,
    OrderModule,
    WxorderModule,
    CardRecordModule,
    WeChatPayModule.registerAsync({
      useFactory: async () => {
        return {
          appid: process.env.WXPAY_APPID,
          mchid: process.env.WXPAY_MCHID,
          publicKey: fs.readFileSync(
            process.env.WXPAY_DIR + '/apiclient_cert.pem',
          ), // 公钥
          privateKey: fs.readFileSync(
            process.env.WXPAY_DIR + '/apiclient_key.pem',
          ), // 秘钥
        };
      },
    }),
  ],
})
export class WxpayModule {}
