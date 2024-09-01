import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './models/student.entity';
import { StudentService } from './student.service';
import { StudentResolver } from './student.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [ConsoleLogger, StudentService, StudentResolver],
  exports: [StudentService],
})
export class StudentModule {}
