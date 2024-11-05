import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, FindOptionsWhere } from 'typeorm';
import { Schedule } from './models/schedule.entity';
@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(entity: DeepPartial<Schedule>): Promise<boolean> {
    const res = await this.scheduleRepository.save(
      this.scheduleRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findById(id: string): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateById(
    id: string,
    entity: DeepPartial<Schedule>,
  ): Promise<boolean> {
    const existEntity = await this.findById(id);
    if (!existEntity) {
      return false;
    }
    Object.assign(existEntity, entity);
    const res = await this.scheduleRepository.save(existEntity);
    if (res) {
      return true;
    }
    return false;
  }

  // 获取所有的课程表
  async findAllSchedules({
    where,
  }: {
    where: FindOptionsWhere<Schedule>;
  }): Promise<[Schedule[], number]> {
    return this.scheduleRepository.findAndCount({
      where,
      order: {
        startTime: 'ASC',
      },
      relations: ['course', 'course.teachers'],
    });
  }

  async findSchedules({
    start,
    length,
    where,
  }: {
    start: number;
    length: number;
    where: FindOptionsWhere<Schedule>;
  }): Promise<[Schedule[], number]> {
    return this.scheduleRepository.findAndCount({
      take: length,
      skip: start,
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const res1 = await this.scheduleRepository.update(id, {
      deletedBy: userId,
    });
    if (res1) {
      const res = await this.scheduleRepository.softDelete(id);
      if (res.affected > 0) {
        return true;
      }
    }
    return false;
  }

  async createInstance(entity: DeepPartial<Schedule>): Promise<Schedule> {
    return this.scheduleRepository.create(entity);
  }

  // 批量保存
  async batchCreate(entities: Schedule[]): Promise<boolean> {
    const res = await this.scheduleRepository.save(entities);
    if (res) {
      return true;
    }
    return false;
  }
}
