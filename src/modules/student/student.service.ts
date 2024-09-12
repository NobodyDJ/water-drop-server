import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Student } from './models/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create(entity: DeepPartial<Student>): Promise<boolean> {
    const res = await this.studentRepository.save(
      this.studentRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findByAccount(account: string): Promise<Student> {
    return this.studentRepository.findOne({
      where: {
        account,
      },
    });
  }

  async findById(id: string): Promise<Student> {
    return this.studentRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateById(id: string, entity: DeepPartial<Student>): Promise<boolean> {
    const res = await this.studentRepository.update(id, entity);
    if (res.affected > 0) {
      return true;
    }
    return false;
  }
}
