import { Module } from '@nestjs/common';
import { WxpayController } from './wxpay.controller';
import { StudentModule } from '../student/student.module';
import { WxpayResolver } from './wxpay.resolver';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [WxpayController],
  providers: [WxpayResolver],
  imports: [StudentModule, ProductModule],
})
export class WxpayModule {}
