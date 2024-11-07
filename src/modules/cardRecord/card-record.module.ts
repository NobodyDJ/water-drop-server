import { CardRecordResolver } from './card-record.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CardRecord } from './models/card-record.entity';
import { CardRecordService } from './card-record.service';
import { CardModule } from '../card/card.module';
import { StudentModule } from '../student/student.module';
import { ScheduleRecordModule } from '../schedule-record/schedule-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardRecord]),
    CardModule,
    StudentModule,
    ScheduleRecordModule,
  ],
  providers: [CardRecordService, CardRecordResolver],
  exports: [CardRecordService],
})
export class CardRecordModule {}
