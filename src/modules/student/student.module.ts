import { Module, ConsoleLogger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './models/student.entity';
import { StudentService } from './student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [ConsoleLogger, StudentService],
  exports: [StudentService],
})
export class StudentModule {}
