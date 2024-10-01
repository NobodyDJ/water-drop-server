import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Card } from './models/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  /**
   * 创建部门
   */
  async create(entity: DeepPartial<Card>): Promise<boolean> {
    const res = await this.cardRepository.save(
      this.cardRepository.create(entity),
    );
    if (res) {
      return true;
    }
    return false;
  }

  async findById(id: string): Promise<Card> {
    return this.cardRepository.findOne({
      where: {
        id,
      },
      // 关联表查询需要添加relations字段，值为数组值为相关的外键
      relations: ['course'],
    });
  }

  async updateById(id: string, entity: DeepPartial<Card>): Promise<boolean> {
    if (!id) {
      return false;
    }
    const existEntity = await this.findById(id);
    console.log('existEntity', existEntity);
    if (!existEntity) {
      return false;
    }
    Object.assign(existEntity, entity);
    const res = await this.cardRepository.save(existEntity);
    // 为了及时获取更新时间，需要将两个实例进行合并
    if (res) {
      return true;
    }
    return false;
  }

  async findCards({
    where,
  }: {
    where: FindOptionsWhere<Card>;
  }): Promise<[Card[], number]> {
    return this.cardRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      where,
    });
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const res = await this.cardRepository.update(id, {
      deletedBy: userId,
    });
    if (res) {
      // 软删除
      const res = await this.cardRepository.softDelete(id);
      if (res.affected > 0) {
        return true;
      }
    }
    return false;
  }
}
