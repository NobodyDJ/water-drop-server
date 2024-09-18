import { InjectRepository } from '@nestjs/typeorm';
import { OrgImage } from './models/orgImage.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrgImageService {
  constructor(
    @InjectRepository(OrgImage)
    private readonly orgImageRepository: Repository<OrgImage>,
  ) {}

  async deleteByOrg(id): Promise<boolean> {
    // 创建一个自定义的查询方法
    const imgs = await this.orgImageRepository
      .createQueryBuilder('orgImage')
      .where(`orgImage.orgIdForFrontId = '${id}'`)
      .orWhere(`orgImage.orgIdForRoomId = '${id}'`)
      .orWhere(`orgImage.orgIdForOtherId = '${id}'`)
      .getMany();
    console.log('imgs', imgs);
    if (imgs.length === 0) {
      return true;
    }
    const delResult = await this.orgImageRepository.delete(
      imgs.map((item) => item.id),
    );
    if (delResult.affected > 0) {
      return true;
    }
    return false;
  }
}
