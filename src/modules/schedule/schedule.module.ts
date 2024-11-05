import { ScheduleResolver } from './schedule.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Schedule } from './models/schedule.entity';
import { ScheduleService } from './schedule.service';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), CourseModule],
  providers: [ScheduleService, ScheduleResolver],
  exports: [ScheduleService],
})
export class ScheduleModule {}
