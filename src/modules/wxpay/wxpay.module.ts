import { Module } from '@nestjs/common';
import { WxpayController } from './wxpay.controller';
import { StudentModule } from '../student/student.module';

@Module({
  controllers: [WxpayController],
  imports: [StudentModule],
})
export class WxpayModule {}
