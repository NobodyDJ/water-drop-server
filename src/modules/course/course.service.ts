import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Course } from './models/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(entity: DeepPartial<Course>): Promise<boolean> {
    const res = await this.courseRepository.save(
      this.courseRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findById(id: string): Promise<Course> {
    return this.courseRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateById(id: string, entity: DeepPartial<Course>): Promise<boolean> {
    if (!id) {
      return false;
    }
    const existEntity = await this.findById(id);
    console.log('existEntity', existEntity);
    if (!existEntity) {
      return false;
    }
    Object.assign(existEntity, entity);
    const res = await this.courseRepository.save(existEntity);
    // 为了及时获取更新时间，需要将两个实例进行合并
    if (res) {
      return true;
    }
    return false;
  }

  async findCourses({
    start,
    length,
    where, // 筛选
  }: {
    start: number;
    length: number;
    where: FindOptionsWhere<Course>;
  }): Promise<[Course[], number]> {
    return this.courseRepository.findAndCount({
      take: length,
      skip: start,
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const res = await this.courseRepository.update(id, {
      deletedBy: userId,
    });
    if (res) {
      // 软删除
      const res = await this.courseRepository.softDelete(id);
      if (res.affected > 0) {
        return true;
      }
    }
    return false;
  }
}
