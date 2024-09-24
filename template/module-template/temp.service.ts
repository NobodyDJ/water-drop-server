import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Template } from './models/template.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  /**
   * 创建部门
   */
  async create(entity: DeepPartial<Template>): Promise<boolean> {
    const res = await this.templateRepository.save(
      this.templateRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findById(id: string): Promise<Template> {
    return this.templateRepository.findOne({
      where: {
        id,
      },
      // 关联表查询需要添加relations字段，值为数组值为相关的外键
      relations: ['orgFrontImg', 'orgRoomImg', 'orgOtherImg'],
    });
  }

  async updateById(
    id: string,
    entity: DeepPartial<Template>,
  ): Promise<boolean> {
    if (!id) {
      return false;
    }
    const existEntity = await this.findById(id);
    console.log('existEntity', existEntity);
    if (!existEntity) {
      return false;
    }
    Object.assign(existEntity, entity);
    const res = await this.templateRepository.save(existEntity);
    // 为了及时获取更新时间，需要将两个实例进行合并
    if (res) {
      return true;
    }
    return false;
  }

  async findTemplates({
    start,
    length,
    where,
  }: {
    start: number;
    length: number;
    where: FindOptionsWhere<Template>;
  }): Promise<[Template[], number]> {
    return this.templateRepository.findAndCount({
      take: length,
      skip: start,
      order: {
        createdAt: 'DESC',
      },
      where,
      relations: ['orgFrontImg', 'orgRoomImg', 'orgOtherImg'],
    });
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const res = await this.templateRepository.update(id, {
      deletedBy: userId,
    });
    if (res) {
      // 软删除
      const res = await this.templateRepository.softDelete(id);
      if (res.affected > 0) {
        return true;
      }
    }
    return false;
  }
}
