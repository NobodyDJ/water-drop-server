import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Organization } from './models/org.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  /**
   * 创建部门
   */
  async create(entity: DeepPartial<Organization>): Promise<boolean> {
    const res = await this.organizationRepository.save(
      this.organizationRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findById(id: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: {
        id,
      },
    });
  }

  async updateById(
    id: string,
    entity: DeepPartial<Organization>,
  ): Promise<boolean> {
    const existEntity = await this.findById(id);
    if (!existEntity) {
      return false;
    }
    Object.assign(existEntity, entity);
    const res = await this.organizationRepository.save(existEntity);
    // 为了及时获取更新时间，需要将两个实例进行合并
    if (res) {
      return true;
    }
    return false;
  }

  async findOrganizations({
    start,
    length,
  }: {
    start: number;
    length: number;
  }): Promise<[Organization[], number]> {
    return this.organizationRepository.findAndCount({
      take: length,
      skip: start,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const res = await this.organizationRepository.update(id, {
      deletedBy: userId,
    });
    if (res) {
      // 软删除
      const res = await this.organizationRepository.softDelete(id);
      if (res.affected > 0) {
        return true;
      }
    }
    return false;
  }
}
