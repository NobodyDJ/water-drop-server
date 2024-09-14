import { Resolver, Query } from '@nestjs/graphql';
import { OSSType } from './dto/oss.type';
import { OSSService } from './oss.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class OSSResolver {
  // 暂时any类型
  constructor(private readonly OSSService: OSSService) {}

  @Query(() => OSSType, { description: '获取oss相关信息' })
  async getOSSInfo(): Promise<OSSType> {
    return await this.OSSService.getSignature();
  }
}
