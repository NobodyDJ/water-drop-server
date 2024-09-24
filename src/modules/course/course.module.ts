import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './models/course.entity';
import { CourseService } from './course.service';
import { CourseResolver } from './course.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [ConsoleLogger, CourseService, CourseResolver],
  exports: [CourseService],
})
export class CourseModule {}
