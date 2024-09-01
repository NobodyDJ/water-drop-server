import { Resolver } from '@nestjs/graphql';
import { StudentService } from './student.service';

@Resolver()
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}
}
